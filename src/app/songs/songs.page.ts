import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/Api.service';
import { ALbumInterface, TrackInterface } from '../models/global.interface';
import { ActivatedRoute } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular'
import { MediaPlayerPage } from '../media-player/media-player.page';
import { AudioplayerService } from '../services/audioplayer.service';
import { StorageService } from '../services/storage.service';

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
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.activeTrack = null;
    //modified, using storageService instead of localstorage
    this.timer = setInterval(()=>{
       if(!this.activeTrack || this.activeTrack != this.storage.getTrackName()){
        this.activeTrack = this.storage.getTrackName();
       }
    },1000);
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
    this.storage.setAlbumImg(this.Album.ImageUrl);
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