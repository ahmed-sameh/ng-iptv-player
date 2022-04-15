import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { exhaustMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { GetDataService } from '../shared/get.data.service';

export interface CategoryResponse {
  category_id: string; 
  category_name: string 
  parent_id: number; 
}

export interface MoviesResponse {
  name: string;
  stream_id:string;
  stream_icon:string;
  rating_5based:string;
}

@Injectable()
export class MoviesService {

  catName = '';
  catMovies: MoviesResponse[] =[];
  moviesCategories:CategoryResponse[] = [];
  errorOccured = new Subject<string>();
  

  constructor(private getDataService: GetDataService, private authService: AuthService) { }

  getCategories() {
    if(this.authService.userAuthData) {
      return this.getDataService.getData(`http://${this.authService.userAuthData!.host}/player_api.php?action=get_vod_categories&password=${this.authService.userAuthData!.password}&username=${this.authService.userAuthData!.username}`)

    }else {
      return this.authService.userAuthenticated.pipe(take(1), exhaustMap(
        userData => {
          return this.getDataService.getData(`http://${userData!.host}/player_api.php?username=${userData!.username}&password=${userData!.password}&action=get_vod_categories`)
        }
      ),tap(categoriesResp => this.moviesCategories = categoriesResp))
    }
  }
  
  
  
  getCategoryMovies(categoryId:string) {
    if(this.authService.userAuthData) {
      return this.getDataService.getData(`http://${this.authService.userAuthData.host}/player_api.php?username=${this.authService.userAuthData.username}&password=${this.authService.userAuthData.password}&action=get_vod_streams&category_id=${categoryId}`)
  
    }else {
     
      return this.authService.userAuthenticated.pipe(take(1), exhaustMap(
        userData => {
          return this.getDataService.getData(`http://${userData!.host}/player_api.php?username=${userData!.username}&password=${userData!.password}&action=get_vod_streams&category_id=${categoryId}`)
        }
      ),tap(moviesRes => this.catMovies = moviesRes))
    }
    
  }
  
  getMovieDetails(movieId:string){

    if(this.authService.userAuthData) {
      return this.getDataService.getData(`http://${this.authService.userAuthData.host}/player_api.php?username=${this.authService.userAuthData.username}&password=${this.authService.userAuthData.password}&action=get_vod_info&vod_id=${movieId}`)
  
    }else {
     
      return this.authService.userAuthenticated.pipe(take(1), exhaustMap(
        userData => {
          return this.getDataService.getData(`http://${userData!.host}/player_api.php?username=${userData!.username}&password=${userData!.password}&action=get_vod_info&vod_id=${movieId}`)
        }
      ))
    }

  }
}
