import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShowsService } from './shows.service';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})
export class ShowsComponent implements OnInit {
  categoryVisible = false;
  errorMessage = '';
  errorSub!: Subscription;

  constructor(private showsService: ShowsService) { }

  ngOnInit(): void {
    this.errorSub =this.showsService.errorOccured.subscribe({
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
