import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePageComponent {
  readonly highlights = [
    {
      title: 'Quizuri interactive',
      description: 'Teste rapide, scor final și progres vizibil pentru fiecare întrebare.',
      route: '/quiz',
      button: 'Mergi la quizuri'
    },
    {
      title: 'Lecții structurate',
      description: 'Parcurgi lecțiile pas cu pas, într-un flux simplu și ușor de urmărit.',
      route: '/lesson',
      button: 'Deschide lecțiile'
    },
    {
      title: 'Model 3D',
      description: 'Explorezi vizual și interactiv conținutul direct din aplicație.',
      route: '/model',
      button: 'Vezi modelul'
    }
  ];
}
