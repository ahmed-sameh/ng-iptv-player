import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(authForm: NgForm) {
    if(authForm.invalid) {
      return
    }

    this.authService.login(authForm.value.username, authForm.value.password).subscribe({
      next: userResponse => {
        console.log(userResponse)
      }
    })

  }
}
