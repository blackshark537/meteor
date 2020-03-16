import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SongsPageRoutingModule } from './songs-routing.module';

import { SongsPage } from './songs.page';
import { MediaPlayerPage } from '../media-player/media-player.page';
import { MediaPlayerPageModule } from '../media-player/media-player.module';


@NgModule({
  entryComponents:[
    MediaPlayerPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SongsPageRoutingModule,
    MediaPlayerPageModule
  ],
  declarations: [SongsPage]
})
export class SongsPageModule {}
