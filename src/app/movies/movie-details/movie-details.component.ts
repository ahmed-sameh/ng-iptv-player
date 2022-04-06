import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MoviesService } from '../movies.service';
import { faHeart, faStar, faBookmark, faPlay } from '@fortawesome/free-solid-svg-icons';
import { exhaustMap, take, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

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
    stream_id?: string
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



  constructor(private currentRoute: ActivatedRoute, private moviesService: MoviesService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.currentRoute.params.pipe(take(1), exhaustMap((movieParams: Params) => {
        this.movieId = movieParams['movieId'];
        return this.moviesService.getMovieDetails(this.movieId)
      })).subscribe({
        next: (movieObject: MovieDetailsResponse) => {
          this.movieName = movieObject.info.name || movieObject.info.o_name || 'movie name';
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
          this.movieVideoSrc = `http://unioniptv.xyz/movie/samer12/12samer/${this.movieId}.${this.movieVideoExtention}`;
        },
        error: error =>  console.log(error)
      });
  }

  onAddToWatchList() {
    let watchedList:{itemID: string, itemName: string, itemPoster: string}[] = [];

    if(localStorage.getItem('watchedList')) {
      watchedList =  JSON.parse(localStorage.getItem('watchedList')!);
      let movieExist = false;
      watchedList.forEach(movie => {
        if(movie.itemID === this.movieId) {
          movieExist = true;
          console.log(movieExist);
        } 
      }) 

      if(!movieExist) {
        watchedList.push({itemID: this.movieId, itemName: this.movieName, itemPoster: this.moviePoster});
        localStorage.removeItem('watchedList');
        localStorage.setItem('watchedList', JSON.stringify(watchedList))
      }
    }else {
      watchedList = [{itemID:this.movieId, itemName:this.movieName, itemPoster:this.moviePoster}];
      localStorage.setItem('watchedList', JSON.stringify(watchedList));
    }
  }

  onAddToFavourites() {
    let favMovieArray:{itemID: string, itemName: string, itemPoster: string}[] = [];

    if(localStorage.getItem('favMovieArray')) {
      favMovieArray =  JSON.parse(localStorage.getItem('favMovieArray')!);
      let movieExist = false;
      favMovieArray.forEach(movie => {
        if(movie.itemID === this.movieId) {
          movieExist = true;
          console.log(movieExist);
        } 
      }) 

      if(!movieExist) {
        favMovieArray.push({itemID: this.movieId, itemName: this.movieName, itemPoster: this.moviePoster});
        localStorage.removeItem('favMovieArray');
        localStorage.setItem('favMovieArray', JSON.stringify(favMovieArray))
      }
    }else {
      favMovieArray = [{itemID:this.movieId, itemName:this.movieName, itemPoster:this.moviePoster}];
      localStorage.setItem('favMovieArray', JSON.stringify(favMovieArray));
    }
  }
  
  
  
  onAddToLatestWatch() {
    let latestWatchArray:{itemID: string, itemName: string, itemPoster: string}[] = [];
  
    if(localStorage.getItem('latestWatchArray')) {
      latestWatchArray =  JSON.parse(localStorage.getItem('latestWatchArray')!);
      let movieExist = false;
      latestWatchArray.forEach(movie => {
        if(movie.itemID === this.movieId) {
          movieExist = true;
          console.log(movieExist);
        } 
      }) 
  
      if(!movieExist) {
        latestWatchArray.push({itemID: this.movieId, itemName: this.movieName, itemPoster: this.moviePoster});
        localStorage.removeItem('latestWatchArray');
        localStorage.setItem('latestWatchArray', JSON.stringify(latestWatchArray))
      }
    }else {
      latestWatchArray = [{itemID:this.movieId, itemName:this.movieName, itemPoster:this.moviePoster}];
      localStorage.setItem('latestWatchArray', JSON.stringify(latestWatchArray));
    }
    
  }

  onWatchMovie() {
    this.onAddToLatestWatch();
    this.PlayerRendered = true;
    this.moviePlayerRendered = true;
  }
      

  


}
