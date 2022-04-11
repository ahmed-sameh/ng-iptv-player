import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  userNotAuthenticated = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    if(this.authService.userAuthData) {
      this.router.navigate(['/home']);
    }else {
      this.authService.userAuthenticated.subscribe({
        next: userAuthData => {
          if(userAuthData) {
            console.log(userAuthData);
            this.router.navigate(['/home']);
          }else {
            this.userNotAuthenticated = true;
          }
          
          this.isLoading = false;
        }
      })
    }
  }
  
  onSubmit(authForm: NgForm) {
    if(authForm.invalid) {
      return
    }
    this.isLoading = true;
    
    this.authService.login(authForm.value.username, authForm.value.password)
    
  }
  
  
  onHandleError() {
    this.userNotAuthenticated = false;
    this.isLoading = false;
  }
}






// fy 7aga bt emit null 7awal tshof hia fen 