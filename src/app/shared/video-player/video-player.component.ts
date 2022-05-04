import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
declare var jwplayer: any;
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnChanges {

  @Input() videoSrc!: string;
  @ViewChild('player',{static: true}) playerEl!: ElementRef<any>

  vidType!:string;

  constructor() { }
  ngOnInit(): void {
            
  }

  ngOnChanges(): void {
      
    jwplayer("mediaplayer").setup({
      file: this.videoSrc,
      autostart: true,
      width: "85%",
      height: "70%"
    });
      

  }

}
