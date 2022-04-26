import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { faStar, faHeart, faBookmark, faPlay, faDownload } from '@fortawesome/free-solid-svg-icons';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { ShowsService } from '../shows.service';


type ShowDetailsResponse  = {
  info : {
    name?: string,
    o_name?: string,
    plot?: string,
    cover?: string,
    backdrop_path?: string[],
    director?: string,
    genre?: string,
    rating_5based?: string,
    releaseDate?: string,
    youtube_trailer?: string,
    actors?: string
  }, episodes: {[key:number]: [{id: string, title: string, season: string}]}
}

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.css']
})
export class ShowDetailsComponent implements OnInit {
  starRateIcon = faStar;
  heartIcon = faHeart;
  watchListIcon = faBookmark;
  playIcon = faPlay;
  downloadIcon = faDownload;

  seasonsVisible = false;

  PlayerRendered = false;
  showPlayerRendered = false;
  trailerPlayerRendered = false;
  

  showName = "";
  showPoster = "";
  showReleaseDate = "";
  showGenres = "";
  showRate = '';
  showTrailer = '';
  showOverview = "";
  showDirector = "";
  showActors = "";
  showId = '';
  pageBackgroundURL = "";
  
  
  showVideoExtention = '';
  episodeVideoSrc = "";
  episodeName = "";

  showSeasons:any[] = [];
  seasonEpisodes: any[] = [];
  selectedSeason:any[] = [];
  renderedSeason = '';
  

  userAuthData:null | User = null;
  constructor(private currentRoute: ActivatedRoute,private authService: AuthService, private showsService: ShowsService) { }

  ngOnInit(): void {
    
    this.userAuthData = this.authService.userAuthData;

    this.currentRoute.params.pipe(take(1), exhaustMap((showParams: Params) => {
        this.showId = showParams['showId'];
        return this.showsService.getShowDetails(this.showId)
      })).subscribe({
        next: (showObject: ShowDetailsResponse) => {
          this.showName = showObject.info.name || showObject.info.o_name || 'show name';
          this.showPoster = showObject.info.cover ? showObject.info.cover : '../../../assets/imgs/no-image.jpg' ;
          this.showReleaseDate = showObject.info.releaseDate ? showObject.info.releaseDate.replaceAll('-', '/') : '';
          this.showGenres = showObject.info.genre ? showObject.info.genre : '';
          this.showRate = showObject.info.rating_5based || '0';
          this.showTrailer = showObject.info.youtube_trailer ? `https://www.youtube.com/embed/${showObject.info.youtube_trailer}` : '';
          this.showOverview = showObject.info.plot || '';
          this.showDirector = showObject.info.director || '';
          this.showActors = showObject.info.actors || '';
          this.pageBackgroundURL = showObject.info.backdrop_path && showObject.info.backdrop_path[0] ? `url('${showObject.info.backdrop_path[0]}')` :`url('../../../assets/imgs/defult-dropback-bg.jpg')`;
          this.renderSeasonsAndEpisodes(showObject.episodes)
        },
        error: error =>  this.showsService.errorOccured.next(error.name)
      });
  }


  renderSeasonsAndEpisodes( episodes: any) {
    for (const seasonNum in episodes) {
      this.showSeasons.push(seasonNum);
    }
    
    this.seasonEpisodes = episodes
  }
  
  onSeasonEpisodesRender(seasonNum: string) {
    this.renderedSeason = seasonNum;
    for(let season in this.seasonEpisodes) {
      if(season === seasonNum) {
        this.selectedSeason = this.seasonEpisodes[season];
      }
    }
  }

  onAddToWatchList(){
    let watchedList:{itemID: string, itemName: string, itemPoster: string}[] = [];

    if(localStorage.getItem('tvShowsWatchedList')) {
      watchedList =  JSON.parse(localStorage.getItem('tvShowsWatchedList')!);
      let showExist = false;
      watchedList.forEach(show => {
        if(show.itemID === this.showId) {
          showExist = true;
        } 
      }) 

      if(!showExist) {
        watchedList.push({itemID: this.showId, itemName: this.showName, itemPoster: this.showPoster});
        localStorage.removeItem('tvShowsWatchedList');
        localStorage.setItem('tvShowsWatchedList', JSON.stringify(watchedList))
      }
    }else {
      watchedList = [{itemID:this.showId, itemName:this.showName, itemPoster:this.showPoster}];
      localStorage.setItem('tvShowsWatchedList', JSON.stringify(watchedList));
    }
  }







  onAddToFavourites(){
    let favShowsArray:{itemID: string, itemName: string, itemPoster: string}[] = [];

    if(localStorage.getItem('favShowsArray')) {
      favShowsArray =  JSON.parse(localStorage.getItem('favShowsArray')!);
      let showExist = false;
      favShowsArray.forEach(show => {
        if(show.itemID === this.showId) {
          showExist = true;
        } 
      }) 

      if(!showExist) {
        favShowsArray.push({itemID: this.showId, itemName: this.showName, itemPoster: this.showPoster});
        localStorage.removeItem('favShowsArray');
        localStorage.setItem('favShowsArray', JSON.stringify(favShowsArray))
      }
    }else {
      favShowsArray = [{itemID:this.showId, itemName:this.showName, itemPoster:this.showPoster}];
      localStorage.setItem('favShowsArray', JSON.stringify(favShowsArray));
    }
  }








    
  
  onAddToLatestWatch(episodeID: string, episodeName: string) {
    let latestWatchArray:{itemID: string, itemName: string, itemPoster: string}[] = [];
  
    if(localStorage.getItem('latestWatchedShowsArray')) {
      latestWatchArray =  JSON.parse(localStorage.getItem('latestWatchedShowsArray')!);
      let showExist = false;
      latestWatchArray.forEach(show => {
        if(show.itemID === episodeID) {
          showExist = true;
        } 
      }) 
  
      if(!showExist) {
        latestWatchArray.push({itemID: episodeID, itemName: episodeName, itemPoster: this.showPoster});
        localStorage.removeItem('latestWatchedShowsArray');
        localStorage.setItem('latestWatchedShowsArray', JSON.stringify(latestWatchArray))
      }
    }else {
      latestWatchArray = [{itemID:episodeID, itemName:episodeName, itemPoster: this.showPoster}];
      localStorage.setItem('latestWatchedShowsArray', JSON.stringify(latestWatchArray));
    }
    
  }









  onWatchEpisode(episodeID: string, episodeName:string, episodeExtention:string ){
    this.episodeVideoSrc = `http://${this.userAuthData!.host}/series/${this.userAuthData!.username}/${this.userAuthData!.password}/${episodeID}.${episodeExtention}`;
    this.episodeName = episodeName;
    this.PlayerRendered = true;
    this.showPlayerRendered = true;
    this.onAddToLatestWatch(episodeID, episodeName)
  }



}
