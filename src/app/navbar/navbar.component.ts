import { Component, OnInit } from '@angular/core';
import { faGear, faMagnifyingGlass,faXmark } from '@fortawesome/free-solid-svg-icons';

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
  constructor() { }

  ngOnInit(): void {
  }

  onSettingClicked() {
    console.log('clicked')
  }
}
