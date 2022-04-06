import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { LiveTvComponent } from './live-tv/live-tv.component';
import { CategoryMoviesComponent } from './movies/category-movies/category-movies.component';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { MoviesComponent } from './movies/movies.component';
import { ShowsComponent } from './shows/shows.component';

const routes: Routes = [
  {path:'auth', component: AuthComponent},
  {path:'home', component: HomeComponent},
  {path:'movies', component: MoviesComponent,children:[
    {path:'', component: CategoryMoviesComponent, pathMatch: 'full'},
    {path:':categoryName/:categoryId', component: CategoryMoviesComponent},
  ]},
  {path:'movie/:movieName/:movieId', component: MovieDetailsComponent},
  {path:'shows', component: ShowsComponent},
  {path:'livetv', component: LiveTvComponent},
  {path:'app-faild', component: ErrorComponent},
  {path:'', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
