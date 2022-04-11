import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MoviesService } from './movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit, OnDestroy {
  categoryVisible = false;
  errorMessage = '';
  errorSub!: Subscription;

  constructor(private moviesService: MoviesService) { }

  ngOnInit(): void {
    this.errorSub =this.moviesService.errorOccured.subscribe({
      next: errorMessage => this.errorMessage = errorMessage
    })
  }

  onHandleError() {
    this.errorMessage = '';
  }

  ngOnDestroy(): void {
      this.errorSub.unsubscribe()
  }
}
