import { Component, OnInit } from '@angular/core';
import { CategoryResponse, MoviesService } from '../movies.service';

@Component({
  selector: 'app-movies-categories',
  templateUrl: './movies-categories.component.html',
  styleUrls: ['./movies-categories.component.css']
})
export class MoviesCategoriesComponent implements OnInit {
  categories!: CategoryResponse[];

  constructor(private moviesService: MoviesService) { }

  ngOnInit(): void {
    if(this.moviesService.moviesCategories.length === 0) {

      this.moviesService.getCategories().subscribe({
        next: catResponse => this.categories = catResponse,
        error: error => this.moviesService.errorOccured.next(error.name)
      })

    }else {
      this.categories = this.moviesService.moviesCategories
    }
  }

}
