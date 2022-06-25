import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, forkJoin, of, Subject, take } from 'rxjs';
import { User } from './user.model';


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
  userData:any = null;
  hostsArray:any[] = [];
  userAuthenticated =  new Subject<User | null>();
  loginModeSwitched =  new Subject<boolean>();
  userAuthData:User | null = null;
  userLogout = false;
  private userExpirestimer: any;

  constructor(private http: HttpClient, private router: Router) {
    
    this.http.get('https://parseapi.back4app.com/classes/appServers',{
      headers: new HttpHeaders({
        'accept': 'application/json' 
        , 'X-Parse-Application-Id': 'Ds8YNiIovplM2Irb1XHHom1LbB0oQxWDAUXraAAx' 
        ,'X-Parse-REST-API-Key': 'EquITgXFv0SF5pM52ujKecVmpEDU2M1RlrTkl68k'
      })
    }).pipe(take(1)).subscribe({
      next: (hosts: any) => {
        hosts.results.forEach((host:any) => {
          this.hostsArray.push(host.hostName)
        })
      }
    })
  }


  
  checkUserExistance(username: string, password: string) {
    this.http.get('https://parseapi.back4app.com/classes/appUsers',{
      headers: new HttpHeaders({
        'accept': 'application/json' 
        , 'X-Parse-Application-Id': 'Ds8YNiIovplM2Irb1XHHom1LbB0oQxWDAUXraAAx' 
        ,'X-Parse-REST-API-Key': 'EquITgXFv0SF5pM52ujKecVmpEDU2M1RlrTkl68k'
      })
    }).subscribe({
      next: (users:any) => {
        const userExist = users.results.find((user: any) => user.username === username);

        if(userExist) {
          console.log(userExist)
          this.login(username, password);
        }else {
          this.userAuthenticated.next(null);
        }
      },
      error: () => this.userAuthenticated.next(null)
    })
  }



  login(username: string, password: string) {
    
    const requestsArray = this.hostsArray.map(host => this.http.get(`http://${host}/player_api.php?username=${username}&password=${password}`).pipe(catchError(error => of(error))))
     
    const userAuthResponses = forkJoin(requestsArray)

    userAuthResponses.subscribe({
      next: (responses: any[]) => {
          for(let [index,response] of responses.entries()) {   
            if(response.hasOwnProperty('user_info') && response.user_info.auth === 1 && index < responses.length) {
              this.userData = response;
              console.clear();
              break;
            }  
          }
          if(this.userData) {
            let expiresDate!:Date; 
            if(this.userData.user_info.exp_date) {
              expiresDate  = new Date( Date.now() + +this.userData.user_info.exp_date * 1000);
            }else {
              expiresDate = new Date(Date.now() + 15552000)
            } 

            const user = new User(this.userData.user_info.username, this.userData.user_info.password, expiresDate, `${this.userData.server_info.url}:${this.userData.server_info.port}`);
            this.userAuthenticated.next(user);
            this.userAuthData = user;
            localStorage.setItem("userData", JSON.stringify(user));
            this.autoLogout(15552000);
            
          }else {
            this.userAuthenticated.next(null);
          }
        }
      })
  }


  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData')!);
    if(!userData) {return}
    
    const loadedUser = new User(userData.username, userData.password, new Date(userData.exp_date), userData.host);
    
    if(new Date() < loadedUser.exp_date) {
      this.userAuthenticated.next(loadedUser);
      this.userAuthData = loadedUser;
    }


  }




  logout() {
    this.userAuthenticated.next(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('jwplayerLocalId');
    localStorage.removeItem('jwplayer.bandwidthEstimate');
    this.userAuthData = null;
    this.router.navigate(['/auth'])
    this.userLogout = true;

    if(this.userExpirestimer) {
      clearTimeout(this.userExpirestimer)
    }

    this.userExpirestimer = null;
  }

  autoLogout(expiresDuration: number) {
    this.userExpirestimer = setTimeout(() => {this.logout()},expiresDuration)
  }


  getCommunicationLinks() {
    return this.http.get('https://parseapi.back4app.com/classes/websiteData',{
      headers: new HttpHeaders({
        'accept': 'application/json' 
        , 'X-Parse-Application-Id': 'Ds8YNiIovplM2Irb1XHHom1LbB0oQxWDAUXraAAx' 
        ,'X-Parse-REST-API-Key': 'EquITgXFv0SF5pM52ujKecVmpEDU2M1RlrTkl68k'
      })
    })
  }
}
