import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SongsPage } from './songs.page';
import { MediaPlayerPage } from '../media-player/media-player.page';

const routes: Routes = [
  {
    path: '',
    component: SongsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SongsPageRoutingModule {}
