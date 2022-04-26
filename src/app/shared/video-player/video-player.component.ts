import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {
  @Input() videoSrc!: string;
  @Input() videoType!: 'Stream' | 'Normal';

  vidType!:string;

  constructor() { }
  ngOnInit(): void {
  }

}
