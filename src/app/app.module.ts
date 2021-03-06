import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DropdownDirective } from './shared/dropdown.directive';
import { ToggleSearchDirective } from './navbar/toggle-search.directive';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { MoviesComponent } from './movies/movies.component';
import { ShowsComponent } from './shows/shows.component';
import { LiveTvComponent } from './live-tv/live-tv.component';
import { ErrorComponent } from './error/error.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { MoviesCategoriesComponent } from './movies/movies-categories/movies-categories.component';
import { CategoryMoviesComponent } from './movies/category-movies/category-movies.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';

import { HomeService } from './home/home.service';
import { MoviesService } from './movies/movies.service';


import { DashedCatNamePipe } from './shared/dashed.name.pipe';
import { cutStringsPipe } from './shared/cut.strings.pipe';
import { urlParamsTransformPipe } from './shared/nameToUrlPrams.pipe';
import { VideoPlayerComponent } from './shared/video-player/video-player.component';
import { SafePipe } from './shared/safe.pipe';
import { CookieService } from 'ngx-cookie-service';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from '@angular/forms';
import { ShowsCategoriesListComponent } from './shows/shows-categories-list/shows-categories-list.component';
import { CatShowsComponent } from './shows/cat-shows/cat-shows.component';
import { NoItemsAvailableComponent } from './shared/no-items-available/no-items-available.component';
import { HomeSliderComponent } from './home/home-slider/home-slider.component';
import { ShowDetailsComponent } from './shows/show-details/show-details.component';
import { MainLiveCategoriesComponent } from './live-tv/main-live-categories/main-live-categories.component';
import { ChannelsPlayerComponent } from './live-tv/channels-player/channels-player.component';
import { FooterComponent } from './footer/footer.component';
import { FilterPipe } from './shared/filter.pipe';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AccountInfoComponent } from './account-info/account-info.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    HomeSliderComponent,
    MoviesComponent,
    CategoryMoviesComponent,
    MovieDetailsComponent,
    MoviesCategoriesComponent,
    ShowsComponent,
    ShowsCategoriesListComponent,
    CatShowsComponent,
    ShowDetailsComponent,
    LiveTvComponent,
    DropdownDirective,
    ToggleSearchDirective,
    ErrorComponent,
    LoadingSpinnerComponent,
    cutStringsPipe,
    DashedCatNamePipe,
    urlParamsTransformPipe,
    VideoPlayerComponent,
    SafePipe,
    FilterPipe,
    NoItemsAvailableComponent,
    AuthComponent,
    MainLiveCategoriesComponent,
    ChannelsPlayerComponent,
    FooterComponent,
    AccountInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [
    CookieService,
    HomeService,
    MoviesService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
