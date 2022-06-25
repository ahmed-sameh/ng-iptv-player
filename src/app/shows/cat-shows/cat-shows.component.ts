import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ShowsService, ShowssResponse } from '../shows.service';

@Component({
  selector: 'app-cat-shows',
  templateUrl: './cat-shows.component.html',
  styleUrls: ['./cat-shows.component.css']
})
export class CatShowsComponent implements OnInit {
  categoryId!: string;
  categoryName!: string;
  showsOfCategory: ShowssResponse[] = [];
  isLoading = false;
  noItemsAvalible = false;
  clearIcon = faXmark;
  searchKeyword = '';

  constructor(private currentRoute: ActivatedRoute, private router :Router, private showsService: ShowsService) { }

  ngOnInit(): void {
    if(this.showsService.showsCategories.length === 0 && this.showsOfCategory.length === 0 && this.currentRoute.snapshot.url.length === 0) {

      // case of load component and no category or shows exist in service or here in component
      if(this.showsService.showsCategories.length === 0) {
        this.showsService.getCategories().subscribe({
          next: categories => {
            this.categoryName = categories[16].category_name;
            this.showsService.catName = categories[16].category_name;
            this.categoryId = categories[16].category_id;
            this.router.navigate(['/shows', this.categoryName, this.categoryId]);
            this.isLoading = false;
            
          },
          error: error => {
            this.showsService.errorOccured.next(error.name)
            this.isLoading = false;
          }
        })
      }else {
        // case of load component and there is categories loaded but there is shows in shows service
        this.categoryName = this.showsService.showsCategories[16].category_name;
        this.categoryId = this.showsService.showsCategories[16].category_id;
        this.router.navigate(['/shows', this.categoryName, this.categoryId]);
        this.isLoading = false;
      }
    }else {
      // case of load component and there is shows loaded in shows service
      this.isLoading = false;
      this.showsOfCategory = this.showsService.catShows;
      this.categoryName = this.showsService.catName;
    }
    
    
    
    
    
    this.currentRoute.params.subscribe({
      next: (updatedParams: Params ) => {
        this.categoryId = updatedParams['categoryId'];
        this.categoryName = updatedParams['categoryName'];
        if(this.categoryId) {
          this.isLoading = true
          this.gettingCatShows(this.categoryId);
          this.showsService.catName = updatedParams['categoryName']
        }else {
          this.categoryName = this.showsService.catName;
        }  
      },
      error: error => {
        this.showsService.errorOccured.next(error.name)
        this.isLoading = false;
      }
  })
  }



  gettingCatShows(CatId: string) {
    this.showsOfCategory = [];
    this.searchKeyword = '';
    this.showsService.getCategoryShows(CatId).subscribe({
      next: allShowsResp => {
        
        if(allShowsResp.length === 0) {
          this.noItemsAvalible = true;
          this.isLoading = false
        } else {
          this.showsOfCategory = allShowsResp;
          this.noItemsAvalible = false;
          this.isLoading = false
        }
      },
      error: error => {
        this.showsService.errorOccured.next(error.name)
        this.isLoading = false
      }
    })
  }
}
