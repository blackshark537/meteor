import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MediaPlayerPageRoutingModule } from './media-player-routing.module';

import { MediaPlayerPage } from './media-player.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MediaPlayerPageRoutingModule
  ],
  declarations: [MediaPlayerPage]
})
export class MediaPlayerPageModule {}
