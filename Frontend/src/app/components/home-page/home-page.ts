import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {BrushingSessionDTO, DashboardControllerService, DashboardDTO} from '../../api';
import {TokenService} from '../../services/token.service';
import {catchError, of} from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePageComponent implements OnInit {
  displayName = '';
  latestBrushing: BrushingSessionDTO | null = null;
  quizzesWithoutMaxScore = 0;
  lessonCount = 0;
  isLoading = true;

  constructor(
    private readonly tokenService: TokenService,
    private readonly dashboardApi: DashboardControllerService,
  ) {}

  ngOnInit(): void {
    this.displayName = this.tokenService.getDisplayNameFromToken() || 'utilizator';
    const userId = this.tokenService.getUserId();

    if (!userId) {
      this.isLoading = false;
      return;
    }

    this.loadDashboard(userId);
  }

  resultLabel(result?: string | null): string {
    if (result === 'good') return 'Bun';
    if (result === 'ok') return 'Mediu';
    if (result === 'poor') return 'Slab';
    return 'Necunoscut';
  }

  formatDuration(seconds?: number): string {
    const safeSeconds = Math.max(0, Math.floor(seconds ?? 0));
    const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (safeSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }

  private loadDashboard(userId: number): void {
    this.dashboardApi.getDashboard(userId).pipe(
      catchError(() => of({} as DashboardDTO))
    ).subscribe((dashboard) => {
      this.latestBrushing = dashboard.latestBrushing ?? null;
      this.quizzesWithoutMaxScore = dashboard.quizzesWithoutMaxScore ?? 0;
      this.lessonCount = dashboard.lessonCount ?? 0;
      this.isLoading = false;
    });
  }
}
