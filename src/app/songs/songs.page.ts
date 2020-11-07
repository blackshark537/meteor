import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/Api.service';
import { ALbumInterface, TrackInterface } from '../models/global.interface';
import { ActivatedRoute } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular'
import { MediaPlayerPage } from '../media-player/media-player.page';
import { AudioplayerService } from '../services/audioplayer.service';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import * as _Actions from '../actions/media.actions';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
})
export class SongsPage implements OnInit, OnDestroy {

  Album: ALbumInterface = {
    Artist: '',
    ImageUrl: 'assets/icon.png',
    Name: '',
    TrackList: [],
    releaseDate: ''
  };
  TrackList: TrackInterface[];
  activeTrack: string;
  search: string = '';
  timer;

  constructor(
    private albumService: ApiService,
    private activeRoute: ActivatedRoute,
    private toastController: ToastController,
    private modalController: ModalController,
    public audioCtrl: AudioplayerService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.activeTrack = null;

    this.store.select('MediaState').subscribe((vals: AppState) =>{
        this.activeTrack = vals.trackName;
        window.document.title = vals.trackName;
    });

    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.albumService.getAlbum(id).subscribe(resp => {
      this.Album = resp.doc;
      this.TrackList = this.Album.TrackList;
    }, error => this.presentToast(error));
  }

  ngOnDestroy(){
    clearInterval(this.timer);
  }

  setTrackList(index: number){
    this.audioCtrl.setTrackList(this.TrackList, index);
    //modified, using storageService instead of localstorage
    //this.storage.setAlbumImg(this.Album.ImageUrl);
    this.store.dispatch(_Actions.Set_AlbumImg({AlbumImg: this.Album.ImageUrl}));
    this.openModal();
  }

  async searchTrack(){
    this.TrackList = this.Album.TrackList.filter((val)=>{
      return val.Name.toLowerCase().match(this.search.toLowerCase()) || val.Name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

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
    //localStorage.setItem('Album', JSON.stringify(this.Album));
    modal.present();
  }

  doRefresh(event) {
    let album;
    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.albumService.getAlbum(id).subscribe(resp => {
      album = resp.doc;
      setTimeout(()=>{
        event.target.complete();
        this.Album = album;
      },2000);
    }, error => this.presentToast(error));
  }
}
