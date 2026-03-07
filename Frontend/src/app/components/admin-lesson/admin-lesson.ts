import {Component, OnInit} from '@angular/core';
import {LessonControllerService, LessonDTO} from '../../api';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Card} from 'primeng/card';
import {Toolbar} from 'primeng/toolbar';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FileUploadModule} from 'primeng/fileupload';

@Component({
  selector: 'app-admin-lesson',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TableModule,
    Card,
    Toolbar,
    InputTextModule,
    Button,
    FileUploadModule,
  ],
  templateUrl: './admin-lesson.html',
  styleUrl: './admin-lesson.css',
  standalone: true
})
export class AdminLesson implements OnInit {

  form:any;
  lessons: LessonDTO[] = [];
  isLoading = false;
  editingId: number | null = null;

  selectedImage: File | null = null;
  preview: string | null = null;

  constructor(private formBuilder: FormBuilder, private lessonController: LessonControllerService) {
    this.form = this.formBuilder.group({
    titlu: ['', [Validators.required, Validators.minLength(3)]],
    continut: ['', [Validators.required, Validators.minLength(10)]],
    imagineUrls: [''],
  });}

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.lessonController.getAllLessons().subscribe({
      next: (data) =>
      {
        this.lessons = data ?? [];
        this.isLoading = false
      },
      error: () => { this.isLoading = false; },
    });
  }

  startCreate() {
    this.editingId = null;
    this.form.reset({ titlu: '', continut: '', imagineUrls: '' });
    this.selectedImage = null;
    this.preview = null;
  }

  startEdit(l: LessonDTO) {
    this.editingId = l.id!;
    this.form.reset({
      titlu: l.titlu ?? '',
      continut: l.contentText ?? '',
      imagineUrls: l.imagineUrls ?? '',
    });
  }

  onImageSelected(event: any) {
    const file: File | undefined = event.files?.[0];
    if (!file) return;

    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => (this.preview = reader.result as string);
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.selectedImage = null;
    this.preview = null;
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading = true;

    const lessonPayload: LessonDTO = {
      titlu: this.form.value.titlu ?? '',
      contentText: this.form.value.continut ?? '',
    };

    const image: Blob | undefined = this.selectedImage ?? undefined;

    const req$ = this.editingId != null
      ? this.lessonController.updateLesson(this.editingId, lessonPayload, image)
      : this.lessonController.createLesson(lessonPayload, image);

    req$.subscribe({
      next: () => {
        this.startCreate();
        this.load();
      },
      error: () => (this.isLoading = false),
      complete: () => (this.isLoading = false),
    });
  }

  remove(id: number) {
    if (!confirm('Sigur vrei să ștergi lecția?')) return;

    this.isLoading = true;
    this.lessonController.deleteLesson(id).subscribe({
      next: () => this.load(),
      error: () => (this.isLoading = false),
      complete: () => (this.isLoading = false),
    });
  }
}
