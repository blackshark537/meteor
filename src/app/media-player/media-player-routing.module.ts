import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MediaPlayerPage } from './media-player.page';

const routes: Routes = [
  {
    path: '',
    component: MediaPlayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaPlayerPageRoutingModule {}
