import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faWhatsappSquare, faFacebook, faTelegram, faChrome } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  userNotAuthenticated = false;
  isLoading = false;
  loginMoodSub!: Subscription;
  isLoginMode = true;

  whatsAppIcon = faWhatsappSquare;
  facebookIcon = faFacebook;
  telegramIcon = faTelegram;
  chromeIcon = faChrome;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    if(this.authService.userAuthData) {
      this.router.navigate(['/home']);
    }else {
      this.authService.userAuthenticated.subscribe({
        next: userAuthData => {
          if(userAuthData) {
            this.router.navigate(['/home']);
          }else {
            this.userNotAuthenticated = true;
          }
          
          this.isLoading = false;
        }
      })
    }

    this.loginMoodSub = this.authService.loginModeSwitched.subscribe({
      next: isInLoginMode => this.isLoginMode = isInLoginMode
    })
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

  ngOnDestroy(): void {
      this.loginMoodSub.unsubscribe()
  }
}






// fy 7aga bt emit null 7awal tshof hia fen 