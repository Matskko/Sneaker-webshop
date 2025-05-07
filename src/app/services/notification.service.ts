import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<string>('');
  message$ = this.messageSubject.asObservable();

  showMessage(message: string) {
    this.messageSubject.next(message);
    // Clear message after 3 seconds
    setTimeout(() => {
      this.messageSubject.next('');
    }, 3000);
  }
} 