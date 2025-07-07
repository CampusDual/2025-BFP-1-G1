import { Component } from '@angular/core';
import { LoadingScreenService } from '../services/loading-screen.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css'],
})
export class LoadingScreenComponent {
  loading = this.loaderService.loading$;

  constructor(private loaderService: LoadingScreenService) {}
}

