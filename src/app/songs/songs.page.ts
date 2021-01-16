import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/Api.service';
import { Album, TrackInterface } from '../models/global.interface';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular'
import { MediaPlayerPage } from '../media-player/media-player.page';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import * as _Actions from '../actions/media.actions';
import { GlobalHttpService } from '../services/global.http.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
})
export class SongsPage implements OnInit, OnDestroy {

  url = '';  
  Album: Album = {
    id: null,
    nombre: '',
    artistas: [],
    tracks:[],
    canciones:{
      file: [],
      id: null,
      name: null,
      nombre: null,
      url: ''
    }
  };
  TrackList: TrackInterface[] = [];
  activeTrack: string;
  search: string = '';

  constructor(
    global: GlobalHttpService,
    private albumService: ApiService,
    private activeRoute: ActivatedRoute,
    private modalController: ModalController,
    private store: Store<AppState>
  ) { 
    this.url = global.baseUrl;
  }

  ngOnInit() {
    this.activeTrack = null;

    this.store.select('MediaState').subscribe(state =>{
        this.activeTrack = state.trackName;
        window.document.title = state.trackName;
    });

    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.albumService.getAlbum(id).subscribe(resp => {
      this.Album = resp;
    });
  }

  ngOnDestroy(){
    this.modalController.dismiss();
  }

  async searchTrack(){
    this.TrackList = [];
    let canciones = this.Album.canciones.file.filter((track)=>{
      return track.name.toLowerCase().match(this.search.toLowerCase()) || track.name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  doRefresh(event) {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.albumService.getAlbum(id).subscribe(resp => {
      setTimeout(()=>{
        event.target.complete();
        this.Album = resp;
      },2000);
    });
  }
}
