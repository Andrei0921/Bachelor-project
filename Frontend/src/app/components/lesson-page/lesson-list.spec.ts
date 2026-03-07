import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonList } from './lesson-list';

describe('LessonList', () => {
  let component: LessonList;
  let fixture: ComponentFixture<LessonList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
