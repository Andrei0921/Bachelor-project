import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login';
import {RegisterComponent} from './components/register/register';
import {MainLayoutComponent} from './components/main-layout/main-layout';
import {HomePageComponent} from './components/home-page/home-page';
import {AuthGuard} from './guards/auth.guard';
import {ModelComponent} from './components/model3d/model3d';
import {LessonList} from './components/lesson-page/lesson-list';
import {QuizPage} from './components/quiz-page/quiz-page';
import {adminGuard} from './guards/admin.guard';
import {AdminQuiz} from './components/admin-quiz/admin-quiz';
import {AdminLesson} from './components/admin-lesson/admin-lesson';

export const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin/quiz',
    canActivate: [adminGuard],
    component: AdminQuiz
  },
  {
    path: 'admin/lesson',
    canActivate: [adminGuard],
    component: AdminLesson
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomePageComponent
      },
      {
        path: 'model',
        component: ModelComponent
      },
      {
        path: 'lesson',
        redirectTo: 'lesson/1',
        pathMatch: 'full'
      },
      {
        path: 'lesson/:page',
        component: LessonList
      },
      {
        path: 'quiz',
        component: QuizPage
      }


    ]
  },
  { path: '**', redirectTo: 'login' }

];
