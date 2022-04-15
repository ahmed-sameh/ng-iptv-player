import { Injectable } from '@angular/core';
import { take, exhaustMap, tap, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { GetDataService } from '../shared/get.data.service';


export interface CategoryResponse {
  category_id: string; 
  category_name: string 
  parent_id: number; 
}

export interface ShowssResponse {
  name: string;
  series_id:string;
  cover:string;
  rating_5based:string;
}

@Injectable({
  providedIn: 'root'
})
export class ShowsService {
  catName = '';
  catShows: ShowssResponse[] =[];
  showsCategories:CategoryResponse[] = [];
  errorOccured = new Subject<string>();
  
  constructor(private getDataService: GetDataService, private authService: AuthService) { }

  getCategories() {
    if(this.authService.userAuthData) {
      return this.getDataService.getData(`http://${this.authService.userAuthData!.host}/player_api.php?action=get_series_categories&password=${this.authService.userAuthData!.password}&username=${this.authService.userAuthData!.username}`)

    }else {
      return this.authService.userAuthenticated.pipe(take(1), exhaustMap(
        userData => {
          return this.getDataService.getData(`http://${userData!.host}/player_api.php?username=${userData!.username}&password=${userData!.password}&action=get_series_categories`)
        }
      ),tap(categoriesResp => this.showsCategories = categoriesResp))
    }
  }



  getCategoryShows(categoryId:string) {
    if(this.authService.userAuthData) {
      return this.getDataService.getData(`http://${this.authService.userAuthData.host}/player_api.php?username=${this.authService.userAuthData.username}&password=${this.authService.userAuthData.password}&action=get_series&category_id=${categoryId}`)
  
    }else {
     
      return this.authService.userAuthenticated.pipe(take(1), exhaustMap(
        userData => {
          return this.getDataService.getData(`http://${userData!.host}/player_api.php?username=${userData!.username}&password=${userData!.password}&action=get_series&category_id=${categoryId}`)
        }
      ),tap(showsResp => this.catShows = showsResp))
    }
    
  }


    
  getShowDetails(showId:string){

    if(this.authService.userAuthData) {
      return this.getDataService.getData(`http://${this.authService.userAuthData.host}/player_api.php?username=${this.authService.userAuthData.username}&password=${this.authService.userAuthData.password}&action=get_series_info&series_id=${showId}`)
  
    }else {
     
      return this.authService.userAuthenticated.pipe(take(1), exhaustMap(
        userData => {
          return this.getDataService.getData(`http://${userData!.host}/player_api.php?username=${userData!.username}&password=${userData!.password}&action=get_series_info&series_id=${showId}`)
        }
      ))
    }

  }

}
