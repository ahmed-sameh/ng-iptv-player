import { Component, OnInit } from '@angular/core';
import { CategoryResponse, ShowsService } from '../shows.service';

@Component({
  selector: 'app-shows-categories-list',
  templateUrl: './shows-categories-list.component.html',
  styleUrls: ['./shows-categories-list.component.css']
})
export class ShowsCategoriesListComponent implements OnInit {
  categories!: CategoryResponse[];
  constructor(private showsService: ShowsService) { }

  ngOnInit(): void {
    if(this.showsService.showsCategories.length === 0) {
      this.showsService.getCategories().subscribe({
        next: catResponse => this.categories = catResponse,
        error: error => this.showsService.errorOccured.next(error.name)
      })
    }
  }

}
