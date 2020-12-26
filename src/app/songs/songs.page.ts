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
  slice = 15;
  Album: Album = {
    id: null,
    nombre: '',
    artistas: [],
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
    private global: GlobalHttpService,
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
      if(this.Album.canciones.tracks.length>0){
        this.Album.canciones.tracks.forEach((track)=>{
          this.TrackList.push({
            _id: track.id,
            Name: track.nombre,
            TrackUrl: this.url+track.file.url,
            ArtistName: this.Album.artistas[0].nombre,
            AlbumName: this.Album.nombre,
            TrackNumber: track.id,
            Plays: track.reproducido,
            Duration: track.file.size,
            ImageUrl: this.url+track.image.url
          });
        });
      } else {
        this.Album.canciones.file.forEach((track)=>{
          this.TrackList.push({
            Name: track.name,
            TrackUrl: this.url+track.url,
            ArtistName: this.Album.artistas[0].nombre,
            AlbumName: this.Album.nombre,
            TrackNumber: track.id,
            Plays: "0",
            Duration: track.size,
            ImageUrl: this.url+this.Album.portada[0].formats.small.url
          });
        });
      }
    });
  }

  ngOnDestroy(){
    this.modalController.dismiss();
  }

  setTrackList(index: number){
    this.store.dispatch(_Actions.set_TrackList({trackList: this.TrackList, index}));
    this.store.dispatch(_Actions.Set_AlbumImg({AlbumImg: this.TrackList[index].ImageUrl}));
    this.openModal();
  }

  loadData(evt){
    setTimeout(() => {
      this.slice += 10;
      evt.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.slice == this.TrackList.length) {
        evt.target.disabled = true;
      }
    }, 500);
  }

  async searchTrack(){
    this.TrackList = [];
    let canciones = this.Album.canciones.file.filter((track)=>{
      return track.name.toLowerCase().match(this.search.toLowerCase()) || track.name.toLowerCase().includes(this.search.toLowerCase());
    });
    canciones.forEach(track =>{
      this.TrackList.push({
        Name: track.name,
        TrackUrl: this.url+track.url,
        ArtistName: this.Album.artistas[0].nombre,
        AlbumName: this.Album.nombre,
        TrackNumber: track.id,
        Duration: track.size,
        ImageUrl: this.url+this.Album.portada[0].formats.small.url
      })
    });
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
