import { Injectable } from '@angular/core';
import { Subject, take, exhaustMap, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { GetDataService } from '../shared/get.data.service';


export interface CategoryResponse {
  category_id: string; 
  category_name: string 
  parent_id: number; 
}

export interface ChannelsResponse {
  name: string;
  stream_id:string;
  stream_icon:string;
}

@Injectable({
  providedIn: 'root'
})
export class TvChannelsService {

  catName = '';
  catChannels: ChannelsResponse[] =[];
  moviesCategories:CategoryResponse[] = [];
  streamRender = new Subject<{streamId:string, channelName: string}>();
  errorOccured = new Subject<string>();
  

  constructor(private getDataService: GetDataService, private authService: AuthService) { }

  getCategories() {
    if(this.authService.userAuthData) {
      return this.getDataService.getData(`http://${this.authService.userAuthData!.host}/player_api.php?&action=get_live_categories&password=${this.authService.userAuthData!.password}&username=${this.authService.userAuthData!.username}`)

    }else {
      return this.authService.userAuthenticated.pipe(take(1), exhaustMap(
        userData => {
          return this.getDataService.getData(`http://${userData!.host}/player_api.php?username=${userData!.username}&password=${userData!.password}&action=get_live_categories`)
        }
      ),tap(categoriesResp => this.moviesCategories = categoriesResp))
    }
  }
  
  
  
  getCategoryChannels(categoryId:string) {
    if(this.authService.userAuthData) {
      return this.getDataService.getData(`http://${this.authService.userAuthData.host}/player_api.php?username=${this.authService.userAuthData.username}&password=${this.authService.userAuthData.password}&action=get_live_streams&category_id=${categoryId}`)
  
    }else {
     
      return this.authService.userAuthenticated.pipe(take(1), exhaustMap(
        userData => {
          return this.getDataService.getData(`http://${userData!.host}/player_api.php?username=${userData!.username}&password=${userData!.password}&action=get_live_streams&category_id=${categoryId}`)
        }
      ),tap(channelsResp => this.catChannels = channelsResp))
    }
    
  }
  
  getStreamLink(channelId:string){
    
    if(this.authService.userAuthData) {
      
      return `http://${this.authService.userAuthData.host}/live/${this.authService.userAuthData.username}/${this.authService.userAuthData.password}/${channelId}.m3u8`
    }else {
      let streamUrl = '';    
      this.authService.userAuthenticated.subscribe({
        next: authData => {  
          streamUrl = `http://${authData!.host}/live/${authData!.username}/${authData!.password}/${channelId}.m3u8`
       }
     })
     return streamUrl
    }

  }
}
