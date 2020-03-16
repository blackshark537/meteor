import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';

import { MediaPlayerPage } from '../media-player/media-player.page';
import { MediaPlayerPageModule } from '../media-player/media-player.module';

@NgModule({
  entryComponents: [
    MediaPlayerPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    MediaPlayerPageModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
