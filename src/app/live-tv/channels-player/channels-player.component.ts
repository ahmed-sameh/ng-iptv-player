import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TvChannelsService } from '../tv-channels.service';

@Component({
  selector: 'app-channels-player',
  templateUrl: './channels-player.component.html',
  styleUrls: ['./channels-player.component.css']
})
export class ChannelsPlayerComponent implements OnInit, OnDestroy {
  streamSub!:Subscription;
  streamID: string = '';
  streamName: string = '';
  streamLink = '';
  errorOccured = false;
  channelSelected = false;

  constructor(private liveServices: TvChannelsService) { }

  ngOnInit(): void {
    this.streamSub = this.liveServices.streamRender.subscribe({
      next: streamData => {
        this.streamID = streamData.streamId;
        this.streamName = streamData.channelName;
        this.streamLink = this.liveServices.getStreamLink(streamData.streamId);
        this.channelSelected = true;
      },
      error: () => {
        this.errorOccured = true;
        this.channelSelected = false;
      }
    })
  }
  
  ngOnDestroy(): void {
    this.streamSub.unsubscribe()
    this.channelSelected = false;
  }
}
