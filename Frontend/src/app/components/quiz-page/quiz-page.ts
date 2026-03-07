import {Component, OnInit} from '@angular/core';
import {
  QuestionResponseDTO,
  QuizControllerService,
  QuizResponseDTO,
  QuizResultDTO,
  UserControllerService
} from '../../api';
import { CommonModule } from '@angular/common';
import {TokenService} from '../../services/token.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-quiz-page',
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './quiz-page.html',
  styleUrl: './quiz-page.css',
  standalone: true
})
export class QuizPage implements OnInit {
  quizzes: QuizResponseDTO[] = [];
  activeQuiz: QuizResponseDTO | null = null;
  questions: QuestionResponseDTO[] = [];

  totalByQuizId:  Record<number, number | undefined> = {};
  bestResultByQuizId: Record<number, QuizResultDTO> = {};
  expandedQuizId: number | null = null;

  currentIndex = 0;
  selectedByQuestionId: Record<number, number | undefined> = {};

  isLoading = false;
  userId: number | null = null;

  private startedAtMs = 0;
  result: QuizResultDTO | null = null;

  constructor(
    private quizApi: QuizControllerService,
    private userApi: UserControllerService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadQuizzes();
  }

  get currentQuestion(): QuestionResponseDTO | null {
    if (!this.questions.length) return null;
    return this.questions[this.currentIndex] ?? null;
  }

  get hasSelectedCurrentAnswer(): boolean {
    const question = this.currentQuestion;
    if (!question?.id) return false;
    return this.selectedByQuestionId[question.id] !== undefined;
  }

  toggleQuizDetails(quizId?: number): void {
    if (!quizId) return;
    this.expandedQuizId = this.expandedQuizId === quizId ? null : quizId;
  }

  isExpanded(quizId?: number): boolean {
    if (!quizId) return false;
    return this.expandedQuizId === quizId;
  }

  loadQuizzes(): void {
    this.isLoading = true;
    this.quizApi.getAllQuizzes().pipe(
      catchError(() => of([] as QuizResponseDTO[]))
    ).subscribe((quizzes) => {
      this.quizzes = quizzes ?? [];
      this.isLoading = false;

      this.loadQuestionCounts();
      if (this.userId) this.loadUserResults();
    });
  }

  loadCurrentUser(): void {
    const email = this.tokenService.getEmailFromToken();
    if (!email) return;

    this.userApi.getUserByEmail(email).pipe(
      catchError(() => of(null))
    ).subscribe((u: any) => {
      this.userId = u?.id ?? null;
      if (this.userId) this.loadUserResults();
    });
  }

  private loadQuestionCounts(): void {
    const calls = (this.quizzes ?? [])
      .filter(q => !!q.id)
      .map(q => this.quizApi.getByQuiz(q.id as number).pipe(
        map(qs => ({ quizId: q.id as number, total: (qs ?? []).length })),
        catchError(() => of({ quizId: q.id as number, total: 0 }))
      ));

    if (!calls.length) {
      this.totalByQuizId = {};
      return;
    }

    forkJoin(calls).subscribe(rows => {
      const mapTotal: Record<number, number> = {};
      for (const r of rows) mapTotal[r.quizId] = r.total;
      this.totalByQuizId = mapTotal;
    });
  }

  private loadUserResults(): void {
    if (!this.userId) return;

    this.quizApi.getByUser(this.userId).pipe(
      catchError(() => of(null))
    ).subscribe((res: any) => {
      const arr: QuizResultDTO[] = Array.isArray(res) ? res : (res ? [res] : []);

      const byQuiz: Record<number, QuizResultDTO> = {};
      for (const r of arr) {
        const qid = r.quizId as number | undefined;
        if (!qid) continue;

        const prev = byQuiz[qid];
        const prevScore = prev?.scor ?? -1;
        const currentScore = r.scor ?? -1;

        if (!prev || currentScore > prevScore || (currentScore === prevScore && (r.id ?? 0) > (prev.id ?? 0))) {
          byQuiz[qid] = r;
        }
      }

      this.bestResultByQuizId = byQuiz;
    });
  }

  startQuiz(quiz: QuizResponseDTO): void {
    if (!quiz.id) return;

    this.isLoading = true;
    this.result = null;
    this.selectedByQuestionId = {};
    this.currentIndex = 0;

    this.quizApi.getQuizById(quiz.id).pipe(
      switchMap((fullQuiz) => {
        const qz = fullQuiz ?? quiz;
        const questions = qz.intrebari ?? [];

        const missingAnswers = questions.some(q => !q.answers || q.answers.length === 0);
        if (!missingAnswers && questions.length > 0) {
          return of({ quiz: qz, questions });
        }

        return this.quizApi.getByQuiz(quiz.id!).pipe(
          switchMap((qs) => {
            const safeQs = qs ?? [];
            if (safeQs.length === 0) return of({ quiz: qz, questions: [] as QuestionResponseDTO[] });

            const calls = safeQs.map((question) => {
              if (!question.id) return of(question);
              return this.quizApi.getAnswers(question.id).pipe(
                map((ans) => ({ ...question, answers: ans ?? [] } as QuestionResponseDTO)),
                catchError(() => of({ ...question, answers: [] } as QuestionResponseDTO))
              );
            });

            return forkJoin(calls).pipe(map((withAnswers) => ({ quiz: qz, questions: withAnswers })));
          }),
          catchError(() => of({ quiz: qz, questions: [] as QuestionResponseDTO[] }))
        );
      }),
      catchError(() => of({ quiz, questions: [] as QuestionResponseDTO[] }))
    ).subscribe(({ quiz: loadedQuiz, questions }) => {
      this.activeQuiz = loadedQuiz;
      this.questions = questions ?? [];
      this.startedAtMs = Date.now();
      this.isLoading = false;
    });
  }

  next(): void {
    if (!this.hasSelectedCurrentAnswer) return;
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex += 1;
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
  }

  goToQuestion(index: number): void {
    if (index < 0 || index >= this.questions.length) return;
    this.currentIndex = index;
  }

  finish(): void {
    if (!this.activeQuiz?.id || !this.hasSelectedCurrentAnswer) return;

    const total = this.questions.length;
    let correct = 0;

    for (const q of this.questions) {
      const qid = q.id;
      if (!qid) continue;
      const selectedAnswerId = this.selectedByQuestionId[qid];
      const selected = (q.answers ?? []).find(a => a.id === selectedAnswerId);
      if (selected?.isCorrect) correct += 1;
    }

    const wrong = Math.max(0, total - correct);

    const result: QuizResultDTO = {
      userId: this.userId ?? undefined,
      quizId: this.activeQuiz.id,
      scor: correct,
      raspunsuriGresite: wrong,
    };

    if (this.userId) {
      this.quizApi.addResult(result).pipe(
        catchError(() => of(result))
      ).subscribe((saved) => {
        this.result = saved ?? result;

        if (this.activeQuiz?.id) {
          const quizId = this.activeQuiz.id;
          const prevBest = this.bestResultByQuizId[quizId];
          const prevScore = prevBest?.scor ?? -1;
          const newScore = this.result?.scor ?? -1;

          if (!prevBest || newScore >= prevScore) {
            this.bestResultByQuizId[quizId] = this.result;
          }
        }
      });
    } else {
      this.result = result;
    }
  }

  isCorrect(question: QuestionResponseDTO): boolean | null {
    const qid = question.id;
    if (!qid) return null;
    const selectedAnswerId = this.selectedByQuestionId[qid];
    if (!selectedAnswerId) return null;
    const selected = (question.answers ?? []).find(a => a.id === selectedAnswerId);
    return selected?.isCorrect ?? false;
  }

  selectedText(question: QuestionResponseDTO): string {
    const qid = question.id;
    if (!qid) return '-';
    const selectedAnswerId = this.selectedByQuestionId[qid];
    const selected = (question.answers ?? []).find(a => a.id === selectedAnswerId);
    return selected?.text ?? '-';
  }

  correctText(question: QuestionResponseDTO): string {
    const correct = (question.answers ?? []).find(a => a.isCorrect);
    return correct?.text ?? '-';
  }

  reset(): void {
    this.activeQuiz = null;
    this.questions = [];
    this.currentIndex = 0;
    this.selectedByQuestionId = {};
    this.result = null;
    this.startedAtMs = 0;
  }
}
