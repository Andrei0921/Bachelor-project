import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  AnswerPostDTO,
  AnswerResponseDTO,
  QuestionPostDTO,
  QuestionResponseDTO,
  QuizControllerService,
  QuizPostDTO, QuizResponseDTO
} from '../../api';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';
import {CommonModule} from '@angular/common';
import {Card} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {Accordion, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';
import {Toolbar} from 'primeng/toolbar';
import {Checkbox} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-admin-quiz',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    Card,
    TableModule,
    Accordion,
    Divider,
    Button,
    Toolbar,
    AccordionPanel,
    InputTextModule,
    RadioButtonModule,
    AccordionHeader,
    FormsModule,
  ],
  templateUrl: './admin-quiz.html',
  styleUrl: './admin-quiz.css',
  standalone: true
})
export class AdminQuiz implements OnInit {
  quizzes: QuizResponseDTO[] = [];
  isLoading = false;
  editingId: number | null = null;
  form: any;

  constructor(
    private formBuilder: FormBuilder,
    private quizController: QuizControllerService,
    private toastService: ToastService
  ) {
    this.form = this.formBuilder.group({
      titlu: ['', [Validators.required, Validators.minLength(3)]],
      descriere: [''],
      categorie: ['', [Validators.required]],
      questions: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.load();
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  answersOf(qIndex: number): FormArray {
    return this.questions.at(qIndex).get('answers') as FormArray;
  }


  newQuiz() {
    this.editingId = null;
    this.form.reset({ titlu: '', descriere: '' ,  categorie: ''});
    this.questions.clear();
  }

  addQuestion() {
    this.questions.push(
      this.formBuilder.group({
        id: [null],
        intrebare: ['', [Validators.required, Validators.minLength(3)]],
        answers: this.formBuilder.array([
          this.formBuilder.group({ id: [null], text: ['', Validators.required], isCorrect: [true] }),
          this.formBuilder.group({ id: [null], text: ['', Validators.required], isCorrect: [false] }),
        ]),
      })
    );
  }

  removeQuestion(i: number) {
    this.questions.removeAt(i);
  }

  addAnswer(qIndex: number) {
    this.answersOf(qIndex).push(
      this.formBuilder.group({ id: [null], text: ['', Validators.required], isCorrect: [false] })
    );
  }

  removeAnswer(qIndex: number, aIndex: number) {
    this.answersOf(qIndex).removeAt(aIndex);
  }

  load() {
    this.isLoading = true;
    this.quizController.getAllQuizzes().subscribe({
      next: (data) => (this.quizzes = data ?? []),
      error: () => { this.isLoading = false; this.toastService.error('Nu am putut încărca quiz-urile.'); },
      complete: () => (this.isLoading = false),
    });
  }

  edit(id: number) {
    this.isLoading = true;

    // 1) Quiz
    this.quizController.getQuizById(id).pipe(
      // 2) Questions
      switchMap((quiz) =>
        this.quizController.getByQuiz(id).pipe(
          switchMap((questions) => {
            // 3) Answers pentru fiecare question
            const answersCalls = (questions ?? []).map(q =>
              this.quizController.getAnswers(q.id as number).pipe(
                map(ans => ({ questionId: q.id as number, answers: ans ?? [] })),
                catchError(() => of({ questionId: q.id as number, answers: [] as AnswerResponseDTO[] }))
              )
            );

            return forkJoin([
              of(quiz),
              of(questions ?? []),
              answersCalls.length ? forkJoin(answersCalls) : of([]),
            ]);
          })
        )
      )
    ).subscribe({
      next: ([quiz, questions, answersByQ]) => {
        this.editingId = quiz.id as number;

        this.form.reset({
          titlu: quiz.titlu ?? '',
          descriere: quiz.descriere ?? '',
          categorie: quiz.categorie ?? '',
        });

        this.questions.clear();

        (questions as QuestionResponseDTO[]).forEach((qq) => {
          const answersForThisQ = answersByQ.find(x => x.questionId === qq.id)?.answers ?? [];

          const answersFA = this.formBuilder.array(
            (answersForThisQ as AnswerResponseDTO[]).map(a =>
              this.formBuilder.group({
                id: [a.id ?? null],
                text: [a.text ?? '', Validators.required],
                isCorrect: [!!a.isCorrect],
              })
            )
          );

          this.questions.push(
            this.formBuilder.group({
              id: [qq.id ?? null],
              intrebare: [qq.intrebare ?? '', [Validators.required, Validators.minLength(3)]],
              answers: answersFA.length ? answersFA : this.formBuilder.array([
                this.formBuilder.group({ id: [null], text: ['', Validators.required], isCorrect: [true] }),
                this.formBuilder.group({ id: [null], text: ['', Validators.required], isCorrect: [false] }),
              ])
            })
          );
        });
      },
      error: () => { this.isLoading = false; this.toastService.error('Nu am putut încărca quiz-ul selectat.'); },
      complete: () => (this.isLoading = false),
    });
  }

  remove(id: number) {
    if (!confirm('Sigur vrei să ștergi quiz-ul?')) return;

    this.isLoading = true;
    this.quizController.deleteQuiz(id).subscribe({
      next: () =>  { this.toastService.success('Quiz-ul a fost șters.'); this.load(); },
      error: () => { this.isLoading = false; this.toastService.error('Nu am putut șterge quiz-ul.'); },
      complete: () => (this.isLoading = false),
    });
  }

  setSingleCorrect(qIndex: number, aIndex: number): void {
    const answers = this.answersOf(qIndex);

    answers.controls.forEach((ctrl, idx) => {
      ctrl.get('isCorrect')?.setValue(idx === aIndex, { emitEvent: false });
    });
  }

  hasExactlyOneCorrectAnswerPerQuestion(): boolean {
    return this.questions.controls.every((qCtrl) => {
      const answersFA = qCtrl.get('answers') as FormArray;
      const correctCount = answersFA.controls.filter(a => !!a.get('isCorrect')?.value).length;
      return correctCount === 1;
    });
  }

  getCorrectAnswerIndex(qIndex: number): number | null {
    const answers = this.answersOf(qIndex);
    const idx = answers.controls.findIndex(ctrl => !!ctrl.get('isCorrect')?.value);
    return idx >= 0 ? idx : null;
  }


  save() {
    console.log('save() called', { invalid: this.form.invalid, value: this.form.getRawValue() });

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.hasExactlyOneCorrectAnswerPerQuestion()) {
      this.toastService.warning('Fiecare întrebare trebuie să aibă exact un singur răspuns corect.');
      return;
    }

    this.isLoading = true;

    const raw = this.form.getRawValue();

    const quizDto: QuizPostDTO = {
      titlu: raw.titlu ?? '',
      descriere: raw.descriere ?? '',
      categorie: raw.categorie ?? '',
    }

    const saveQuiz$ = this.editingId
      ? this.quizController.updateQuiz(this.editingId, quizDto)
      : this.quizController.addQuiz(quizDto);

    saveQuiz$.pipe(
      switchMap((savedQuiz) => {
        const quizId = (savedQuiz?.id ?? this.editingId) as number;

        const questionCalls = this.questions.controls.map((qCtrl) => {
          const qId = qCtrl.get('id')?.value as number | null;
          const qText = qCtrl.get('intrebare')?.value as string;

          const qDto: QuestionPostDTO = {
            quizId,
            intrebare: qText,
          };

          const saveQuestion$ = qId
            ? this.quizController.updateQuestion(qId, qDto)
            : this.quizController.addQuestion(quizId, qDto);

          return saveQuestion$.pipe(
            switchMap((savedQuestion) => {
              const questionId = savedQuestion.id as number;


              if (!qId) {
                qCtrl.patchValue({ id: questionId });
              }

              const answersFA = qCtrl.get('answers') as FormArray;

              const answerCalls = answersFA.controls.map((aCtrl) => {
                const aId = aCtrl.get('id')?.value as number | null;
                const aText = aCtrl.get('text')?.value as string;
                const aCorrect = !!aCtrl.get('isCorrect')?.value;

                const aDto: AnswerPostDTO = {
                  questionId,
                  text: aText,
                  isCorrect: aCorrect,
                } as AnswerPostDTO;

                const saveAnswer$ = aId
                  ? this.quizController.updateAnswer(aId, aDto)
                  : this.quizController.addAnswer(questionId, aDto);

                return saveAnswer$.pipe(
                  tap((savedAnswer: any) => {
                    if (!aId && savedAnswer?.id) {
                      aCtrl.patchValue({ id: savedAnswer.id });
                    }
                  })
                );
              });

              return answerCalls.length ? forkJoin(answerCalls) : of([]);
            })
          );
        });

        return questionCalls.length ? forkJoin(questionCalls) : of([]);
      })
    ).subscribe({
      next: () => {
        this.toastService.success(this.editingId ? 'Quiz-ul a fost actualizat.' : 'Quiz-ul a fost creat.');
        this.newQuiz();
        this.load();
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error('Nu am putut salva quiz-ul.');
        this.isLoading = false;
      }
    });
  }
}
