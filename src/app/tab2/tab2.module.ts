import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MediaPlayerPageModule } from '../media-player/media-player.module';
import { MediaPlayerPage } from '../media-player/media-player.page';


@NgModule({
  entryComponents:[
    MediaPlayerPage
  ],
  imports: [
    IonicModule,
    MediaPlayerPageModule,
    CommonModule,
    FormsModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
      animation: false,
      responsive: true,
      renderOnClick: false
    }),
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
