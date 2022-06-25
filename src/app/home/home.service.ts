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


  constructor(private getDataService: GetDataService, private authService: AuthService) {
    this.authService.userAuthenticated.subscribe(userData => {
      if(!userData) {
        this.recentlyAddedMovies = []
        this.recentlyAddedShows = []
      }
    })
  }


  getUserAuthData() {
    return JSON.parse(localStorage.getItem('userData')!).username
  }

  getRecentlyAddedMovies() {

    if(this.authService.userAuthData) { 

      return this.getDataService.getData(`http://${this.authService.userAuthData.host}/player_api.php?username=${this.authService.userAuthData.username}&password=${this.authService.userAuthData.password}&action=get_vod_streams`).pipe(map(
        (moviesResponse: Array<Movie>) => {
          
          const selectedMovies = moviesResponse.filter( movie => movie.added > this.date).slice(0,150);
  
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
  
        const selectedMovies = moviesResponse.filter( movie => movie.added > this.date).slice(0,150);
  
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

      const recentlyMoviesData = JSON.parse(localStorage.getItem('latestWatchedMoviesArray')!);
      let moviesList: {itemID: string, itemName: string, itemPoster: string}[] = [];
      let userExist = false;

      for(let username in recentlyMoviesData) {
        if(username === this.getUserAuthData()) {
          moviesList = recentlyMoviesData[username];
          userExist = true;
          break;
        }
      }

      if(userExist) {

        const recentlyMovies:any[] = [];
        moviesList.forEach((movie: any) => {
          let movieItem = {id: movie.itemID, title: movie.itemName, posterSrc: movie.itemPoster};
          recentlyMovies.push(movieItem);
        })
        return recentlyMovies
      }else {
        return null;
      }

    }else {
      return null;
    }

  }


  getFavouritesMovies() {
    if(localStorage.getItem('favMovieArray')) {

      const favMovieData = JSON.parse(localStorage.getItem('favMovieArray')!);
      let moviesList: {itemID: string, itemName: string, itemPoster: string}[] = [];
      let userExist = false;

      for(let username in favMovieData) {
        if(username === this.getUserAuthData()) {
          moviesList = favMovieData[username];
          userExist = true;
          break;
        }
      }

      if(userExist) {

        const favMovies:any[] = [];
        moviesList.forEach((movie: any) => {
          let movieItem = {id: movie.itemID, title: movie.itemName, posterSrc: movie.itemPoster};
          favMovies.push(movieItem);
        })
        return favMovies
      }else {
        return null;
      }

    }else {
      return null;
    }
  }


  getMoviesWatchedList() {
    if(localStorage.getItem('moviesWatchedList')) {

      const watchedListData = JSON.parse(localStorage.getItem('moviesWatchedList')!);
      let moviesList: {itemID: string, itemName: string, itemPoster: string}[] = [];
      let userExist = false;

      for(let username in watchedListData) {
        if(username === this.getUserAuthData()) {
          moviesList = watchedListData[username];
          userExist = true;
          break;
        }
      }

      if(userExist) {

        const moviesWatchList:any[] = [];
        moviesList.forEach((movie: any) => {
          let movieItem = {id: movie.itemID, title: movie.itemName, posterSrc: movie.itemPoster};
          moviesWatchList.push(movieItem);
        })
        return moviesWatchList
      }else {
        return null;
      }

    }else {
      return null;
    }
  }














  getRecentlyAddedShows() {

    if(this.authService.userAuthData) {
      return this.getDataService.getData(`http://${this.authService.userAuthData.host}/player_api.php?username=${this.authService.userAuthData.username}&password=${this.authService.userAuthData.password}&action=get_series`).pipe(map(
        (showsResponse: Array<Show>) => {
          const selectedShows = showsResponse.filter(show => +show.last_modified > this.date).slice(0,150);

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
          const selectedShows = showsResponse.filter(show => +show.last_modified > this.date).slice(0,150);
          
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

      const recentlyShowsData = JSON.parse(localStorage.getItem('latestWatchedShowsArray')!);
      let recentlyShows: {itemID: string, itemName: string, itemPoster: string}[] = [];
      let userExist = false;

      for(let username in recentlyShowsData) {
        if(username === this.getUserAuthData()) {
          recentlyShows = recentlyShowsData[username];
          userExist = true;
          break;
        }
      }

      if(userExist) {

        const recentlyShowsItems:any[] = [];
        recentlyShows.forEach((show: any) => {
          let showItem = {id: show.itemID, title: show.itemName, posterSrc: show.itemPoster};
          recentlyShowsItems.push(showItem);
        })
        return recentlyShowsItems
      }else {
        return null;
      }

    }else {
      return null;
    }
  }


  getFavouritesShows() {

    if(localStorage.getItem('favShowsArray')) {

      const favShowsData = JSON.parse(localStorage.getItem('favShowsArray')!);
      let favShows: {itemID: string, itemName: string, itemPoster: string}[] = [];
      let userExist = false;

      for(let username in favShowsData) {
        if(username === this.getUserAuthData()) {
          favShows = favShowsData[username];
          userExist = true;
          break;
        }
      }

      if(userExist) {

        const favShowsItems:any[] = [];
        favShows.forEach((show: any) => {
          let showItem = {id: show.itemID, title: show.itemName, posterSrc: show.itemPoster};
          favShowsItems.push(showItem);
        })
        return favShowsItems
      }else {
        return null;
      }

    }else {
      return null;
    }
  }


  getShowsWatchedList() {
    if(localStorage.getItem('tvShowsWatchedList')) {

      const watchedListData = JSON.parse(localStorage.getItem('tvShowsWatchedList')!);
      let showsList: {itemID: string, itemName: string, itemPoster: string}[] = [];
      let userExist = false;

      for(let username in watchedListData) {
        if(username === this.getUserAuthData()) {
          showsList = watchedListData[username];
          userExist = true;
          break;
        }
      }

      if(userExist) {

        const showsWatchList:any[] = [];
        showsList.forEach((show: any) => {
          let showItem = {id: show.itemID, title: show.itemName, posterSrc: show.itemPoster};
          showsWatchList.push(showItem);
        })
        return showsWatchList
      }else {
        return null;
      }

    }else {
      return null;
    }
  }


  

}
