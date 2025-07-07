import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private loadingStartTime: number | null = null;
  private minDuration = 1500;

  show() {
    this.loadingStartTime = Date.now();
    this.loadingSubject.next(true);
  }

  hide() {
    const now = Date.now();
    const elapsed = this.loadingStartTime ? now - this.loadingStartTime : this.minDuration;
    const remaining = this.minDuration - elapsed;

    if (remaining > 0) {
      setTimeout(() => {
        this.loadingSubject.next(false);
        this.loadingStartTime = null;
      }, remaining);
    } else {
      this.loadingSubject.next(false);
      this.loadingStartTime = null;
    }
  }

  constructor() { }
}
