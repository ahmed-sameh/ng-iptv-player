import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, throwError } from 'rxjs';


export interface AuthResponse {
  username: string;
  password: string;
  exp_date: string;
  auth: 0 | 1;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  hostsArray = ['u-on.cc:2095','unioniptv.xyz'];

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    // let responseData;
    
    // for(let host of this.hostsArray) {

    //   this.http.get<any>(`http://${host}/player_api.php?username=${username}&password=${password}`).subscribe({
    //     next: userData => {
    //       console.log(userData.user_info)
    //       responseData = userData.user_info;
    //     },
    //     error: () => {
    //       responseData = 'no user';
    //     }
    //   })
  
    //   if(responseData === 'no user') {
    //     continue;
    //   }else {
    //     console.log('response case case')
    //     console.log(responseData)
    //     break;
    //   }
    // }
    // return responseData;
    
    return this.http.get(`http://${this.hostsArray[0]}/player_api.php?username=${username}&password=${password}`).pipe(take(1),map(
      responseData => {
        let authProcess: {continue: boolean, userData:any};
        console.log(responseData)
        if(responseData) {
          authProcess = {continue: false, userData: responseData};
        }else {
          authProcess = {continue: true, userData: null};
        }
        return authProcess
      }
    ), exhaustMap( (authContinue: {continue: boolean, userData:any}) => {
      if(authContinue.continue) {
        return this.http.get(`http://${this.hostsArray[1]}/player_api.php?username=${username}&password=${password}`)
      }else {
        return authContinue.userData 
      }
    }))
 
      
    

    
  }
}
