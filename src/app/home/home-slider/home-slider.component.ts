
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faChevronRight,faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { HomeService } from '../home.service';
import { SliderItem } from '../movie.show.type'

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.css']
})
export class HomeSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('SliderRef', {static: true}) sliderRef!: ElementRef;
  @Input() sliderType!: 'movies' | 'shows';

  rightArrowIcon = faChevronRight;
  leftArrowIcon = faChevronLeft;

  sliderItems: Array<SliderItem> = [];
  itemsLoading = false;
  ItemsAvailable = true;
  errorMessage = '';
  itemsType = 'RecentlyAdded';
  sliderItemsType!:'movie' | 'show';

  constructor(private homeService: HomeService, private router: Router){}
  
  ngOnInit(): void {  
    if(this.sliderType === 'movies'){
      this.getRecentltAddedMovies();
      this.sliderItemsType = 'movie';
    }else if(this.sliderType === 'shows'){
      this.getRecentltAddedShows();
      this.sliderItemsType = 'show';
    }
  }
  
  ngAfterViewInit(): void {
    this.onSliderScrollHandler(); 
  }
  
 
  getRecentlyAddedItems() {
    this.itemsType = 'RecentlyAdded';
    this.ItemsAvailable = true;
    if(this.sliderType === 'movies') {
      this.getRecentltAddedMovies();
    }else if(this.sliderType === 'shows') {
      this.sliderItems = this.homeService.recentlyAddedShows;
    }
  }
  
  
  
  
  getRecentlyWatchedItems() {
    this.itemsType = 'RecentlyWatched';
    this.ItemsAvailable = true;
    this.sliderItems = [];
    if(this.sliderType === 'movies') {
      this.getRecentlyWatchedMovies();
    }else if(this.sliderType === 'shows') {
      this.getRecentlyWatchedShows();
    }
  }
  
  getFavouritesItems() {
    this.itemsType = 'Favourites';
    this.ItemsAvailable = true;
    this.sliderItems = [];
    if(this.sliderType === 'movies') {
      this.getFavouritesMovies();
    }else if(this.sliderType === 'shows') {
      this.getFavouritesShows();
    }
  }
  
  getWatchedListItems() {
    this.itemsType = 'WatchedList';
    this.ItemsAvailable = true;
    this.sliderItems = [];
    if(this.sliderType === 'movies') {
      this.getMoviesWatchList();
    }else if(this.sliderType === 'shows') {
      this.getShowsWatchList();
    }
  }
  
  





  getRecentltAddedMovies() {
    // checking if home service have the recently movies or not
    if(this.homeService.recentlyAddedMovies.length === 0) {
      // if it not have  the movies. it will send the request to get it and store it
      this.itemsLoading = true;

      this.homeService.getRecentlyAddedMovies().subscribe({
        next: movies => {
          if(movies.length > 0) {
            this.sliderItems = movies;
            this.itemsLoading = false;
          }else {
            this.itemsLoading = false;
            this.ItemsAvailable = false;
          }
        },
        error: error => this.onErrorOccurred(error.name)
      })
      
    }else {
      // if it have the recently moves. i get it and render it 
      this.sliderItems = this.homeService.recentlyAddedMovies;
    } 
  }

  
  getRecentlyWatchedMovies() {
    if(this.homeService.recentlyWatchedMovies.length > 0) {
      this.sliderItems = this.homeService.recentlyWatchedMovies;
    }else{
      let moviesItem = this.homeService.getRecentlyWatchedMovies();
      if(moviesItem) {
        this.sliderItems = moviesItem;
      }else {
        this.ItemsAvailable = false;
      }  
    }
  }

  
  getFavouritesMovies() {
    if(this.homeService.favouritesMovies.length > 0) {
      this.sliderItems = this.homeService.favouritesMovies;
    }else{
      let moviesItem = this.homeService.getFavouritesMovies();
      if(moviesItem) {
        this.sliderItems = moviesItem;
      }else {
        this.ItemsAvailable = false;
      }  
    }
  }

  
  getMoviesWatchList() {
    if(this.homeService.moviesWatchList.length > 0) {
      this.sliderItems = this.homeService.moviesWatchList;
    }else{
      let moviesItem = this.homeService.getMoviesWatchedList();
      if(moviesItem) {
        this.sliderItems = moviesItem;
      }else {
        this.ItemsAvailable = false;
      }  
    }
  }

  
  













  getRecentltAddedShows() {
    if(this.homeService.recentlyAddedShows.length === 0) {

      this.itemsLoading = true;
      this.homeService.getRecentlyAddedShows().subscribe({
        next: shows => {
          this.sliderItems = shows
          this.itemsLoading = false;
        },
        error: error => this.onErrorOccurred(error.name)
      })   
    }else {
      this.sliderItems = this.homeService.recentlyAddedShows;
    }
  }
  
  
  
  getRecentlyWatchedShows() {
    if(this.homeService.recentlyWatchedShows.length > 0) {
      this.sliderItems = this.homeService.recentlyWatchedShows;
    }else{
      let showsItems = this.homeService.getRecentlyWatchedShows();
      if(showsItems) {
        this.sliderItems = showsItems;
      }else {
        this.ItemsAvailable = false;
      }  
    }
  }

  
  getFavouritesShows() {
    if(this.homeService.favouritesShows.length > 0) {
      this.sliderItems = this.homeService.favouritesShows;
    }else{
      let showsItems = this.homeService.getFavouritesShows();
      if(showsItems) {
        this.sliderItems = showsItems;
      }else {
        this.ItemsAvailable = false;
      }  
    }
  }

  
  getShowsWatchList() {
    if(this.homeService.showsWatchList.length > 0) {
      this.sliderItems = this.homeService.showsWatchList;
    }else{
      let showsItems = this.homeService.getShowsWatchedList();
      if(showsItems) {
        this.sliderItems = showsItems;
      }else {
        this.ItemsAvailable = false;
      }  
    }
  }




















  
  onSliderScrollHandler() {
    const productContainers = (this.sliderRef.nativeElement as HTMLElement).querySelector('.slider-container');
    const nxtBtn =(this.sliderRef.nativeElement as HTMLElement).querySelector('.nxt-btn');
    const preBtn =(this.sliderRef.nativeElement as HTMLElement).querySelector('.pre-btn');
    
    let containerDimensions = productContainers!.getBoundingClientRect();
      let containerWidth = containerDimensions.width;
      
      nxtBtn!.addEventListener('click', () => {
        productContainers!.scrollLeft += containerWidth;
      })
      
      preBtn!.addEventListener('click', () => {
        productContainers!.scrollLeft -= containerWidth;
      })   
  }

  onErrorOccurred(message: string) {
    this.ItemsAvailable = false;
    this.itemsLoading = false;
    this.errorMessage = message;
  }


  onErrorHandling() {
    this.errorMessage = '';
    this.router.navigate(['/home'])
  }

}
