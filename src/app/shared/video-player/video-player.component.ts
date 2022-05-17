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
    console.log(this.videoType)
    this.setPlayer();
  }


  setPlayer() {
    if(this.videoType === 'mkv') {
      console.log('from flow player')
      console.log(this.videoSrc)
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
        
        console.log(this.videoSrc)
        console.log('from jw player')
      jwplayer("mediaplayer").setup({
        file: this.videoSrc,
        autostart: true,
        width: "85%",
        height: "70%"
      });
    }
  }

}
