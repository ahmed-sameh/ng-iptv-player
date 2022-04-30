import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGurd } from './auth/auth.guard';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { LiveTvComponent } from './live-tv/live-tv.component';
import { CategoryMoviesComponent } from './movies/category-movies/category-movies.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { MoviesComponent } from './movies/movies.component';
import { CatShowsComponent } from './shows/cat-shows/cat-shows.component';
import { ShowDetailsComponent } from './shows/show-details/show-details.component';
import { ShowsComponent } from './shows/shows.component';

const routes: Routes = [
  {path:'auth', component: AuthComponent},
  {path:'home', component: HomeComponent, canActivate: [AuthGurd]},
  {path:'movies', component: MoviesComponent,
    canActivate: [AuthGurd],
    children:[
      {path:'', component: CategoryMoviesComponent, pathMatch: 'full'},
      {path:':categoryName/:categoryId', component: CategoryMoviesComponent},
  ]},
  {path:'movie/:movieName/:movieId', component: MovieDetailsComponent},
  {path:'shows', component: ShowsComponent,canActivate: [AuthGurd],
  children:[
    {path:'', component: CatShowsComponent, pathMatch: 'full'},
    {path:':categoryName/:categoryId', component: CatShowsComponent},
  ]},
  {path:'show/:showName/:showId', component: ShowDetailsComponent},
  {path:'livetv', component: LiveTvComponent,canActivate: [AuthGurd]},
  {path:'app-faild', component: ErrorComponent},
  {path:'', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'top',
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
