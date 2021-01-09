import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LikedPageRoutingModule } from './liked-routing.module';

import { LikedPage } from './liked.page';
import { MediaPlayerPage } from '../media-player/media-player.page';
import { ShareModule } from '../share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShareModule,
    LikedPageRoutingModule
  ],
  declarations: [LikedPage, MediaPlayerPage]
})
export class LikedPageModule {}
