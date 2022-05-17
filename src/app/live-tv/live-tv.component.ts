import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-tv',
  templateUrl: './live-tv.component.html',
  styleUrls: ['./live-tv.component.css']
})
export class LiveTvComponent implements OnInit, OnDestroy {
  categoryVisible = false;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    localStorage.removeItem('jwplayerLocalId');
    localStorage.removeItem('jwplayer.bandwidthEstimate');
    localStorage.removeItem('flowplayerTestStorage');
  }

}
