import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MediaPlayerPage } from '../media-player/media-player.page';
import { AppState } from '../models/app.state';
import { TrackInterface } from '../models/global.interface';
import * as _Actions from '../actions/media.actions';
import { GlobalHttpService } from '../services/global.http.service';
import { ApiService } from '../services/Api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage implements OnInit {

  TrackList: TrackInterface[] = [];
  url: string;
  name: string = '';

  constructor(
    global: GlobalHttpService,
    private store:Store<AppState>,
    private apiService: ApiService,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute
  ) { 
    this.url = global.baseUrl;
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.apiService.getPlaylist(id).subscribe(resp =>{
      this.name = resp.nombre;
      this.TrackList = [];
      resp.canciones.forEach(track =>{
        this.TrackList.push({
          _id: track.id,
          Name: track.nombre,
          TrackUrl: this.url+track.file.url,
          ArtistName: track.artist? track.artist.nombre : '',
          AlbumName: track.album? track.album.nombre : '',
          TrackNumber: track.id,
          Duration: null,
          Plays: track.reproducido,
          ImageUrl: this.url + track.image.url
        });
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
