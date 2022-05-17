import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MoviesService } from '../movies.service';
import { faHeart, faStar, faBookmark, faPlay } from '@fortawesome/free-solid-svg-icons';
import { exhaustMap, take, tap } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';

type MovieDetailsResponse  = {
  info : {
    name?: string,
    o_name?: string,
    description?: string,
    movie_image?: string,
    backdrop_path?: string[],
    director?: string,
    duration?: string,
    genre?: string,
    rating?: string,
    releasedate?: string,
    youtube_trailer?: string,
    actors?: string
  }, movie_data?: {
    container_extension?: string,
    stream_id?: string,
    name?:string
  }
}


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  starRateIcon = faStar;
  heartIcon = faHeart;
  watchListIcon = faBookmark;
  playIcon = faPlay;

  PlayerRendered = false;
  moviePlayerRendered = false;
  trailerPlayerRendered = false;
  

  movieName = '';
  moviePoster = '';
  movieReleaseDate = '';
  movieGenres = '';
  movieDuration = '';
  movieRate = '';
  movieTrailer = '';
  movieOverview = '';
  movieDirector = '';
  movieActors = '';
  movieId = '';
  pageBackgroundURL = '';
  movieVideoExtention = '';
  movieVideoSrc = '';

  userAuthData:null | User = null;



  constructor(private currentRoute: ActivatedRoute, private authService: AuthService, private moviesService: MoviesService) { }

  ngOnInit(): void {

    this.userAuthData = this.authService.userAuthData;

    this.currentRoute.params.pipe(take(1), exhaustMap((movieParams: Params) => {
        this.movieId = movieParams['movieId'];
        return this.moviesService.getMovieDetails(this.movieId)
      })).subscribe({
        next: (movieObject: MovieDetailsResponse) => {
          this.movieName = movieObject.info.name || movieObject.info.o_name || movieObject.movie_data?.name || 'movie name';
          this.moviePoster = movieObject.info.movie_image ? movieObject.info.movie_image : '../../../assets/imgs/no-image.jpg' ;
          this.movieReleaseDate = movieObject.info.releasedate ? movieObject.info.releasedate.replaceAll('-', '/') : '';
          this.movieGenres = movieObject.info.genre ? movieObject.info.genre : '';
          this.movieDuration = movieObject.info.duration ? movieObject.info.duration === '00:00:00' ? '': movieObject.info.duration: '';
          this.movieRate = movieObject.info.rating || '0';
          this.movieTrailer = movieObject.info.youtube_trailer ? `https://www.youtube.com/embed/${movieObject.info.youtube_trailer}` : '';
          this.movieOverview = movieObject.info.description || '';
          this.movieDirector = movieObject.info.director || '';
          this.movieActors = movieObject.info.actors || '';
          this.movieId = movieObject && movieObject.movie_data && movieObject.movie_data.stream_id  ? movieObject.movie_data.stream_id : '' ;
          this.pageBackgroundURL = movieObject.info.backdrop_path && movieObject.info.backdrop_path[0] ? `url('${movieObject.info.backdrop_path[0]}')` :`url('../../../assets/imgs/defult-dropback-bg.jpg')`;
          this.movieVideoExtention = movieObject && movieObject.movie_data && movieObject.movie_data.container_extension ? movieObject.movie_data.container_extension : 'mp4';
          this.movieVideoSrc = `http://${this.userAuthData!.host}/movie/${this.userAuthData!.username}/${this.userAuthData!.password}/${this.movieId}.${this.movieVideoExtention}`;
        },
        error: error =>  this.moviesService.errorOccured.next(error.name)
      });
  }


  
  getUserAuthData() {
    return JSON.parse(localStorage.getItem('userData')!).username
  }

  onAddToWatchList() {


    let watchedListData: {[username: string] : {itemID: string, itemName: string, itemPoster: string}[]};

    let watchedList:{itemID: string, itemName: string, itemPoster: string}[] = []



    if(localStorage.getItem('moviesWatchedList')) {
      watchedListData =  JSON.parse(localStorage.getItem('moviesWatchedList')!);
      let userExist = false;
   
      for(let username in watchedListData) {
        if(username === this.getUserAuthData()) {
          watchedList = watchedListData[username];
          userExist = true;
          break;
        }
      }


      if(userExist) {
        let movieExist = false;

        watchedList.forEach(movie => {
          if(movie.itemID === this.movieId) {
            movieExist = true;
          } 
        }) 
  
        if(!movieExist) {
          watchedList.push({itemID: this.movieId, itemName: this.movieName, itemPoster: this.moviePoster});
          localStorage.removeItem('moviesWatchedList');
          const username = this.getUserAuthData();
          localStorage.setItem('moviesWatchedList', JSON.stringify({...watchedListData, [username]:watchedList}))
        }
      }else {
        localStorage.removeItem('moviesWatchedList');
        const username = this.getUserAuthData();
        localStorage.setItem('moviesWatchedList', JSON.stringify({...watchedListData, [username]:[{itemID: this.movieId, itemName: this.movieName, itemPoster: this.moviePoster}]}))
      }
      
      
    }else {
      const username = this.getUserAuthData();
      watchedList = [{itemID:this.movieId, itemName:this.movieName, itemPoster:this.moviePoster}];
      localStorage.setItem('moviesWatchedList', JSON.stringify({[username]:watchedList}));
    }
    }




    
    onAddToFavourites() {

      let favMoviesData: {[username: string] : {itemID: string, itemName: string, itemPoster: string}[]};

      let favMovies:{itemID: string, itemName: string, itemPoster: string}[] = []
  
  
  
      if(localStorage.getItem('favMovieArray')) {
        favMoviesData =  JSON.parse(localStorage.getItem('favMovieArray')!);
        let userExist = false;
     
        for(let username in favMoviesData) {
          if(username === this.getUserAuthData()) {
            favMovies = favMoviesData[username];
            userExist = true;
            break;
          }
        }
  
  
        if(userExist) {
          let movieExist = false;
  
          favMovies.forEach(movie => {
            if(movie.itemID === this.movieId) {
              movieExist = true;
            } 
          }) 
    
          if(!movieExist) {
            favMovies.push({itemID: this.movieId, itemName: this.movieName, itemPoster: this.moviePoster});
            localStorage.removeItem('favMovieArray');
            const username = this.getUserAuthData();
            localStorage.setItem('favMovieArray', JSON.stringify({...favMoviesData, [username]:favMovies}))
          }
        }else {
          localStorage.removeItem('favMovieArray');
          const username = this.getUserAuthData();
          localStorage.setItem('favMovieArray', JSON.stringify({...favMoviesData, [username]:[{itemID: this.movieId, itemName: this.movieName, itemPoster: this.moviePoster}]}))
        }
        
        
      }else {
        const username = this.getUserAuthData();
        favMovies = [{itemID:this.movieId, itemName:this.movieName, itemPoster:this.moviePoster}];
        localStorage.setItem('favMovieArray', JSON.stringify({[username]:favMovies}));
      }

  }
  
  
  
  onAddToLatestWatch() {

    let latestWatchData: {[username: string] : {itemID: string, itemName: string, itemPoster: string}[]};

    let latestWatchedMovies:{itemID: string, itemName: string, itemPoster: string}[] = [];



    if(localStorage.getItem('latestWatchedMoviesArray')) {
      latestWatchData =  JSON.parse(localStorage.getItem('latestWatchedMoviesArray')!);
      let userExist = false;
   
      for(let username in latestWatchData) {
        if(username === this.getUserAuthData()) {
          latestWatchedMovies = latestWatchData[username];
          userExist = true;
          break;
        }
      }


      if(userExist) {
        let movieExist = false;

        latestWatchedMovies.forEach(movie => {
          if(movie.itemID === this.movieId) {
            movieExist = true;
          } 
        }) 
  
        if(!movieExist) {
          latestWatchedMovies.push({itemID: this.movieId, itemName: this.movieName, itemPoster: this.moviePoster});
          localStorage.removeItem('latestWatchedMoviesArray');
          const username = this.getUserAuthData();
          localStorage.setItem('latestWatchedMoviesArray', JSON.stringify({...latestWatchData, [username]:latestWatchedMovies}))
        }
      }else {
        localStorage.removeItem('latestWatchedMoviesArray');
        const username = this.getUserAuthData();
        localStorage.setItem('latestWatchedMoviesArray', JSON.stringify({...latestWatchData, [username]:[{itemID: this.movieId, itemName: this.movieName, itemPoster: this.moviePoster}]}))
      }
      
      
    }else {
      const username = this.getUserAuthData();
      latestWatchedMovies = [{itemID:this.movieId, itemName:this.movieName, itemPoster:this.moviePoster}];
      localStorage.setItem('latestWatchedMoviesArray', JSON.stringify({[username]:latestWatchedMovies}));
    }
    
  }

  onWatchMovie() {
    this.onAddToLatestWatch();
    this.PlayerRendered = true;
    this.moviePlayerRendered = true;
  }
      

  
  onClosePlayer() {
    this.PlayerRendered = false;
    this.trailerPlayerRendered= false;
    this.moviePlayerRendered = false;
    localStorage.removeItem('jwplayerLocalId');
    localStorage.removeItem('jwplayer.bandwidthEstimate');
    localStorage.removeItem('flowplayerTestStorage'); 
  }
  


}
