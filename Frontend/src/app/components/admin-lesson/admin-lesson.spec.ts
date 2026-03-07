import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLesson } from './admin-lesson';

describe('AdminLesson', () => {
  let component: AdminLesson;
  let fixture: ComponentFixture<AdminLesson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLesson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLesson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
