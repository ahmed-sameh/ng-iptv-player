import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
declare var jwplayer: any;
declare var flowplayer: any;
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnChanges {

  @Input() videoSrc!: string;

  @Input() videoType!: string;
  @ViewChild('player',{static: true}) playerEl!: ElementRef<any>

  vidType!:string;

  constructor() { }
  ngOnInit(): void {
    this.setPlayer()
  }

  ngOnChanges(): void {
    this.setPlayer();
  }


  setPlayer() {
    if(this.videoType === 'mkv') {
      flowplayer(this.playerEl.nativeElement, {
        autoplay: true,
          aspectRatio: "16:9",
          clip: {
            sources: [
              { type: "video/mp4",
              src:  this.videoSrc }
            ]
          }
        });
      } else {
      jwplayer("mediaplayer").setup({
        file: this.videoSrc,
        autostart: true,
        width: "85%",
        height: "70%"
      });
    }
  }

}
