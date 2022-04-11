import { Component, OnInit } from '@angular/core';
import { faGear, faL, faMagnifyingGlass,faXmark } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  settingIcon = faGear;
  searchIcon = faMagnifyingGlass;
  closeIcon = faXmark;
  toggleNavSearchIcon = false;
  isAuthenticated = false;
  userSub!: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    if(this.authService.userAuthData) {
      this.isAuthenticated = true;
    }else {
      this.isAuthenticated = false;

    }

    this.userSub = this.authService.userAuthenticated.subscribe({
      next: userAuthData => {
        if(userAuthData) {
          this.isAuthenticated = true;
        }else {
          this.isAuthenticated = false;
        }
      }
    })
  }

  onSettingClicked() {
    console.log('clicked')
  }

  onLogout() {
    this.authService.logout()
  }
}
