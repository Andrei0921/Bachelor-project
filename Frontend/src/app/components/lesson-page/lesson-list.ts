import {Component, OnInit} from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import {LessonControllerService, LessonDTO} from '../../api';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-lesson-list',
  imports: [ PaginatorModule, CommonModule],
  templateUrl: './lesson-list.html',
  styleUrls: ['./lesson-list.css'],
  standalone: true,
})
export class LessonList implements OnInit {
  currentLessonIndex = 0;
  lessons: LessonDTO[] = [];
  lesson!: LessonDTO;
  totalLessons = 0;
  private pendingIndex = 0;

  constructor(
    private lessonService: LessonControllerService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const pageParam = Number(pm.get('page') ?? '1');
      const idx = Number.isFinite(pageParam) ? Math.max(0, pageParam - 1) : 0;
      this.pendingIndex = idx;
      if (this.lessons.length) {
        this.loadLesson(Math.min(idx, Math.max(0, this.lessons.length - 1)));
      }
    });

    this.lessonService.getAllLessons().subscribe(res => {
      const data = (res ?? []) as LessonDTO[];

      this.lessons = [...data].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      this.totalLessons = this.lessons.length;

      this.loadLesson(Math.min(this.pendingIndex, Math.max(0, this.lessons.length - 1)));
    });
  }

  loadLesson(index: number) {
    if (index >= 0 && index < this.lessons.length) {
      this.currentLessonIndex = index;
      this.lesson = this.lessons[index];
    }
  }

  onPageChange(event: any) {
    const idx = event.page as number;
    this.loadLesson(idx);
    this.router.navigate(['/lesson', idx + 1]);
  }


}
