import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuiz } from './admin-quiz';

describe('AdminQuiz', () => {
  let component: AdminQuiz;
  let fixture: ComponentFixture<AdminQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
