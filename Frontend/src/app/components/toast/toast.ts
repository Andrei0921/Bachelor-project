import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html'
})

export class ToastComponent {
  @Input() toasts: Toast[] = [];

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'pi pi-check-circle';
      case 'error': return 'pi pi-times-circle';
      case 'warning': return 'pi pi-exclamation-triangle';
      case 'info': return 'pi pi-info-circle';
      default: return 'pi pi-info-circle';
    }
  }
}

