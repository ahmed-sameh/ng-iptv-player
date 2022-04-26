import { Component, OnInit } from '@angular/core';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { CategoryResponse, ChannelsResponse, TvChannelsService } from '../tv-channels.service';


@Component({
  selector: 'app-main-live-categories',
  templateUrl: './main-live-categories.component.html',
  styleUrls: ['./main-live-categories.component.css']
})
export class MainLiveCategoriesComponent implements OnInit {
  categories!: CategoryResponse[];
  rightArrowIcon = faAngleRight;
  leftArrowIcon = faAngleLeft;

  categoryChannels!:ChannelsResponse[];
  channelsAvalible = false;
  categoriesVisible = true;
  selectedCategoryId = '';
  selectedChannelId = '';

  constructor(private liveServices: TvChannelsService) { }

  ngOnInit(): void {
    if(this.liveServices.moviesCategories.length === 0) {

      this.liveServices.getCategories().subscribe({
        next: catResponse => this.categories = catResponse,
        error: error => this.liveServices.errorOccured.next(error.name)
      })

    }else {
      this.categories = this.liveServices.moviesCategories
    }
  }

  onRenderChannels(categoryId: string) {
    this.channelsAvalible = false;
    if(categoryId === this.selectedCategoryId) {
      this.onCloseChannels();
    } else {
      this.selectedCategoryId = categoryId;
      this.categoryChannels = [];
      this.liveServices.getCategoryChannels(categoryId).subscribe({
        next: allChannelsResp => {
          if(allChannelsResp.length === 0) {
            this.channelsAvalible = false;
          } else {
            this.categoryChannels = allChannelsResp;
            this.channelsAvalible = true;
          }
        },
        error: error => {
          this.liveServices.errorOccured.next(error.name);
        }
      })
    }

    this.categoriesVisible = false;
  }

  onRenderChannelStream(channelId: string, channelName: string) {
    this.categoriesVisible = false;
    this.selectedChannelId = channelId;
    this.liveServices.streamRender.next({streamId:channelId, channelName:channelName});
  }

  onCloseChannels() {
    this.channelsAvalible = false;
    this.selectedCategoryId = '';
    this.categoryChannels = [];
  }

}
