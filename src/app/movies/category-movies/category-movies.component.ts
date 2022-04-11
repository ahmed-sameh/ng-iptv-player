import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MoviesResponse, MoviesService } from '../movies.service';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category-movies',
  templateUrl: './category-movies.component.html',
  styleUrls: ['./category-movies.component.css']
})
export class CategoryMoviesComponent implements OnInit {
  categoryId!: string;
  categoryName!: string;
  moviesOfCategory: MoviesResponse[] = [];
  isLoading = false;
  rateStarIcon = faStar;

  constructor(private currentRoute: ActivatedRoute, private router :Router, private moviesService: MoviesService) { }

  ngOnInit(): void {
    if(this.moviesService.catMovies.length === 0 && this.moviesOfCategory.length === 0 && this.currentRoute.snapshot.url.length === 0) {

      // case of load component and no category or movies exist in service or here in component
      if(this.moviesService.moviesCategories.length === 0) {
        this.moviesService.getCategories().subscribe({
          next: categories => {
            this.categoryName = categories[0].category_name;
            this.moviesService.catName = categories[0].category_name;
            this.categoryId = categories[0].category_id;
            this.router.navigate(['/movies', this.categoryName, this.categoryId]);
            this.isLoading = false;
            
          },
          error: error => {
            this.moviesService.errorOccured.next(error.name)
            this.isLoading = false;
          }
        })
      }else {
        // case of load component and there is categories loaded but there is movies in movies service
        this.categoryName = this.moviesService.moviesCategories[0].category_name;
        this.categoryId = this.moviesService.moviesCategories[0].category_id;
        this.router.navigate(['/movies', this.categoryName, this.categoryId]);
        this.isLoading = false;
      }
    }else {
      // case of load component and there is movies loaded in movies service
      this.isLoading = false;
      this.moviesOfCategory = this.moviesService.catMovies;
      this.categoryName = this.moviesService.catName;
    }
    
    
    
    
    
    this.currentRoute.params.subscribe({
      next: (updatedParams: Params ) => {
        this.categoryId = updatedParams['categoryId'];
        this.categoryName = updatedParams['categoryName'];
        if(this.categoryId) {
          this.isLoading = true
          this.gettingCatMovies(this.categoryId);
          this.moviesService.catName = updatedParams['categoryName']
        }else {
          this.categoryName = this.moviesService.catName;
        }  
      },
      error: error => {
        this.moviesService.errorOccured.next(error.name)
        this.isLoading = false;
      }
  })
  }



  gettingCatMovies(CatId: string) {
    this.moviesOfCategory = [];
    this.moviesService.getCategoryMovies(CatId).subscribe({
      next: allMoviesRes => {
        if(allMoviesRes.length === 0) {
          this.router.navigate(['/home']);
        } else {
          this.moviesOfCategory = allMoviesRes;
          this.isLoading = false
        }
      },
      error: error => {
        this.moviesService.errorOccured.next(error.name)
        this.isLoading = false
      }
    })
  }


  

}
