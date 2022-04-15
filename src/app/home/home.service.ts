import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap} from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { GetDataService } from '../shared/get.data.service';
import { Movie, SliderItem, Show } from './movie.show.type';

@Injectable()
export class HomeService {
  recentlyAddedMovies: SliderItem[] = [];
  recentlyWatchedMovies: SliderItem[] = [];
  favouritesMovies: SliderItem[] = [];
  moviesWatchList: SliderItem[] = [];
  
  recentlyAddedShows: SliderItem[] = [];
  recentlyWatchedShows: SliderItem[] = [];
  favouritesShows: SliderItem[] = [];
  showsWatchList: SliderItem[] = [];
  
  

 
  //  get today date and convert it to timestamp and sub from it 172800 to get the date from 2 weeks ago
  date = Math.floor(+new Date().getTime() / 1000) - 1209600;


  constructor(private getDataService: GetDataService, private authService: AuthService) { }

  getRecentlyAddedMovies() {

    if(this.authService.userAuthData) {

      return this.getDataService.getData(`http://${this.authService.userAuthData.host}/player_api.php?username=${this.authService.userAuthData.username}&password=${this.authService.userAuthData.password}&action=get_vod_streams`).pipe(map(
        (moviesResponse: Array<Movie>) => {

          const selectedMovies = moviesResponse.filter( movie => movie.added > this.date).slice(0,20);
  
          let recentlyMovies:Array<SliderItem> = [];
    
          selectedMovies.forEach( movie => {
            recentlyMovies.push({
              id: movie.stream_id,
              title: movie.name,
              posterSrc: movie.stream_icon
            })
          })
          return recentlyMovies
        }), tap( movies => this.recentlyAddedMovies = movies))

    }else {
      return this.authService.userAuthenticated.pipe(take(1), exhaustMap(
        authData => {
          return this.getDataService.getData(`http://${authData!.host}/player_api.php?username=${authData!.username}&password=${authData!.password}&action=get_vod_streams`)
        }
      ),map(
        (moviesResponse: Array<Movie>) => {
  
        const selectedMovies = moviesResponse.filter( movie => movie.added > this.date).slice(0,20);
  
        let recentlyMovies:Array<SliderItem> = [];
  
         selectedMovies.forEach( movie => {
           recentlyMovies.push({
             id: movie.stream_id,
             title: movie.name,
             posterSrc: movie.stream_icon
           })
         })
         return recentlyMovies
      }), tap( movies => this.recentlyAddedMovies = movies))
    }
  }


  getRecentlyWatchedMovies() {
    if(localStorage.getItem('latestWatchedMoviesArray')) {
      const recentlyMovies = JSON.parse(localStorage.getItem('latestWatchedMoviesArray')!);
      recentlyMovies.forEach((movie: any) => {
        let movieItem = {id: movie.itemID, title: movie.itemName, posterSrc: movie.itemPoster};
        this.recentlyWatchedMovies.push(movieItem);
      })
      return this.recentlyWatchedMovies
    }else {
      return null;
    }
  }


  getFavouritesMovies() {
    if(localStorage.getItem('favMovieArray')) {
      const favMovies = JSON.parse(localStorage.getItem('favMovieArray')!);
      favMovies.forEach((movie: any) => {
        let movieItem = {id: movie.itemID, title: movie.itemName, posterSrc: movie.itemPoster};
        this.favouritesMovies.push(movieItem);
      })
      return this.favouritesMovies
    }else {
      return null;
    }
  }


  getMoviesWatchedList() {
    if(localStorage.getItem('moviesWatchedList')) {
      const moviesList = JSON.parse(localStorage.getItem('moviesWatchedList')!);
      moviesList.forEach((movie: any) => {
        let movieItem = {id: movie.itemID, title: movie.itemName, posterSrc: movie.itemPoster};
        this.moviesWatchList.push(movieItem);
      })
      return this.moviesWatchList
    }else {
      return null;
    }
  }














  getRecentlyAddedShows() {

    if(this.authService.userAuthData) {
      return this.getDataService.getData(`http://${this.authService.userAuthData.host}/player_api.php?username=${this.authService.userAuthData.username}&password=${this.authService.userAuthData.password}&action=get_series`).pipe(map(
        (showsResponse: Array<Show>) => {
          const selectedShows = showsResponse.filter(show => +show.last_modified > this.date).slice(0,20);
          
          let recentlyShows:Array<SliderItem> = [];
          
          selectedShows.forEach( show => {
            recentlyShows.push({
              id: show.series_id,
              title: show.name,
              posterSrc: show.cover
            })
          })
          return recentlyShows
        }
      ), tap( shows => this.recentlyAddedShows = shows))

    }else {
      return this.authService.userAuthenticated.pipe(take(1), exhaustMap(
        authData => {
          return this.getDataService.getData(`http://${authData!.host}/player_api.php?username=${authData!.username}&password=${authData!.password}&action=get_series`)
        }
      ),map(
        (showsResponse: Array<Show>) => {
          const selectedShows = showsResponse.filter(show => +show.last_modified > this.date).slice(0,20);
          
          let recentlyShows:Array<SliderItem> = [];
          
          selectedShows.forEach( show => {
            recentlyShows.push({
              id: show.series_id,
              title: show.name,
              posterSrc: show.cover
            })
          })
          return recentlyShows
        }
      ), tap( shows => this.recentlyAddedShows = shows))
    }
    
  }

  

  getRecentlyWatchedShows() {
    if(localStorage.getItem('latestWatchedShowsArray')) {
      const recentlyShows = JSON.parse(localStorage.getItem('latestWatchedShowsArray')!);
      recentlyShows.forEach((show: any) => {
        let showItem = {id: show.itemID, title: show.itemName, posterSrc: show.itemPoster};
        this.recentlyWatchedShows.push(showItem);
      })
      return this.recentlyWatchedShows
    }else {
      return null;
    }
  }


  getFavouritesShows() {
    if(localStorage.getItem('favShowsArray')) {
      const favShows = JSON.parse(localStorage.getItem('favShowsArray')!);
      favShows.forEach((show: any) => {
        let showItem = {id: show.itemID, title: show.itemName, posterSrc: show.itemPoster};
        this.favouritesShows.push(showItem);
      })
      return this.favouritesShows
    }else {
      return null;
    }
  }


  getShowsWatchedList() {
    if(localStorage.getItem('tvShowsWatchedList')) {
      const showsList = JSON.parse(localStorage.getItem('tvShowsWatchedList')!);
      showsList.forEach((show: any) => {
        let showItem = {id: show.itemID, title: show.itemName, posterSrc: show.itemPoster};
        this.showsWatchList.push(showItem);
      })
      return this.showsWatchList
    }else {
      return null;
    }
  }


  

}
