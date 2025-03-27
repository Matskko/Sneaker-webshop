import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = signal(false);

  isLoggedIn() {
    return this.loggedIn();
  }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      this.loggedIn.set(true);
      return true;
    }
    return false;
  }

  logout() {
    this.loggedIn.set(false);
  }
}
