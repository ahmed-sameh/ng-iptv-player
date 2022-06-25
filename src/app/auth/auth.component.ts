import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faChrome, faTwitter, faFacebook, faTelegram, faWhatsappSquare} from '@fortawesome/free-brands-svg-icons';
import { faBullseye} from '@fortawesome/free-solid-svg-icons';
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

  twitterIcon = faTwitter;
  chromeIcon = faChrome;
  othersIcon = faBullseye;
  facebookIcon = faFacebook ;
  teleIcon = faTelegram;
  whatsIcon = faWhatsappSquare; 

  twitterLink = '';
  whatsAppLink = '';
  websiteLink = '';
  facebookLink = '';
  telegramLink = '';
  othersLink = '';

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
    });

    this.authService.getCommunicationLinks().subscribe({
      next: (links:any) => {
        this.facebookLink = links.results[0].facebook;
        this.othersLink = links.results[0].others;
        this.telegramLink = links.results[0].telegram;
        this.twitterLink = links.results[0].twitter;
        this.websiteLink = links.results[0].website;
        this.whatsAppLink = links.results[0].whatsapp;
      }
    })
  }
  
  onSubmit(authForm: NgForm) {
    if(authForm.invalid) {
      return
    }
    this.isLoading = true;
    
    this.authService.checkUserExistance(authForm.value.username, authForm.value.password);
    
  }
  
  
  onHandleError() {
    this.userNotAuthenticated = false;
    this.isLoading = false;
  }

  ngOnDestroy(): void {
      this.loginMoodSub.unsubscribe()
  }
}