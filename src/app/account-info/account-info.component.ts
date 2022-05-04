import { Component, OnInit } from '@angular/core';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { GetDataService } from '../shared/get.data.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  username = '';
  status = '';
  trial = '';
  active_cons = '';
  max_cons = '';
  creation_date!:Date;
  expire_date!:Date;
  constructor(private getDataService: GetDataService, private authService: AuthService) { }

  ngOnInit(): void {
    
    if(this.authService.userAuthData) {

       this.getDataService.getData(`http://${this.authService.userAuthData!.host}/player_api.php?password=${this.authService.userAuthData!.password}&username=${this.authService.userAuthData!.username}`).subscribe({
         next: userData => {
           console.log( userData)
          this.username = userData.user_info.username;
          this.status = userData.user_info.status;
          this.trial = userData.user_info.is_trial === "0" ? 'No' : 'Yes';
          this.active_cons = userData.user_info.active_cons;
          this.max_cons = userData.user_info.max_connections;
          this.creation_date = new Date(+userData.user_info.created_at * 1000)
          this.expire_date = new Date(+userData.user_info.exp_date * 1000)

          console.log(+userData.user_info.exp_date)
         }
       })

    }

  }
}