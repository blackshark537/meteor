import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import { TrackInterface } from '../models/global.interface';
import { GlobalHttpService } from '../services/global.http.service';
import * as _Actions from '../actions/media.actions';
import { MediaPlayerPage } from '../media-player/media-player.page';

@Component({
  selector: 'app-liked',
  templateUrl: './liked.page.html',
  styleUrls: ['./liked.page.scss'],
})
export class LikedPage implements OnInit {

  TrackList: TrackInterface[] = [];
  url;

  constructor(
    global: GlobalHttpService,
    private modalController: ModalController,
    private store:Store<AppState>
  ) { 
    this.url = global.baseUrl;
  }

  ngOnInit() {
    this.store.select('UserState').subscribe(resp =>{
      this.TrackList = [];
      resp.likes.forEach(track =>{
        this.TrackList.push({
          _id: track.id,
          Name: track.nombre,
          TrackUrl: this.url+track.file.url,
          ArtistName: '',
          AlbumName: '',
          TrackNumber: track.id,
          Plays: track.reproducido,
          Duration: track.file.size,
          ImageUrl: this.url+track.image.url
        })
      });
    });
  }

  setTrackList(index: number){
    this.store.dispatch(_Actions.set_TrackList({trackList: this.TrackList, index}));
    this.store.dispatch(_Actions.Set_AlbumImg({AlbumImg: this.TrackList[index].ImageUrl}));
    this.openModal();
  }

  //Open the media player page
  async openModal(){
    const modal = await this.modalController.create({
      component: MediaPlayerPage,
      animated: true,
      id: 'mediaplayer',
      backdropDismiss: true,
      swipeToClose: true,
      mode: 'ios',
      showBackdrop: true,
      componentProps: {
        fromSongs: true
      }
    });
    await modal.present();
  }
}
