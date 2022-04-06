import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
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
  moviesCategories:CategoryResponse[] = [];
  catMovies: MoviesResponse[] =[];
  

  constructor(private getDataService: GetDataService) { }

  getCategories() {
    return this.getDataService.getData('http://unioniptv.xyz/player_api.php?username=samer12&password=12samer&action=get_vod_categories').pipe(tap(categoriesResp => this.moviesCategories = categoriesResp))
  }
  
  getCategoryMovies(categoryId:string) {
    return this.getDataService.getData(`http://unioniptv.xyz/player_api.php?username=samer12&password=12samer&action=get_vod_streams&category_id=${categoryId}`).pipe(tap(moviesRes => this.catMovies = moviesRes ))
  }

  getMovieDetails(movieId:string){
    return this.getDataService.getData(`http://unioniptv.xyz/player_api.php?username=samer12&password=12samer&action=get_vod_info&vod_id=${movieId}`)
  }
}
