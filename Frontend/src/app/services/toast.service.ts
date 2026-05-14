import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Toast} from '../components/toast/toast';


@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private nextId = 1;

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000): void {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  error(message: string, duration = 4000): void {
    this.show(message, 'error', duration);
  }
  warning(message: string, duration = 3000): void {
    this.show(message, 'warning', duration);
  }

  remove(id: number): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
  }
}

