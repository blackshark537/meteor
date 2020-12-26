import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/Api.service';
import { MediaPlayerPage } from '../media-player/media-player.page';
import { Album, TrackInterface } from '../models/global.interface';
import {Store} from '@ngrx/store';
import * as _Actions from '../actions/media.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('search', {static: false}) search;

  list: TrackInterface[] = [];
  albums: Album[] = [];
  activeTrack: number;
  url = ''
  searched: boolean = false;

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private modalController: ModalController,
    private store: Store<any>
  ) { 
    this.url = apiService.url;
  }

  ngOnInit() {
  }

  onSearch(){
    if(this.search.value.length > 2){
      this.list = [];
      this.albums = [];
      this.searched = false;
      this.apiService.getTrack(this.search.value).subscribe(resp=>{
        this.searched = true;
        console.log(resp);
        resp.forEach(async (track) =>{
          this.list.push({
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
      }, error => this.presentToast(error));

      this.apiService.getTrackFile(this.search.value).subscribe(resp =>{
        resp.forEach(async track =>{
          this.list.push({
            _id: track.id,
            Name: track.name,
            TrackUrl: this.url+track.url,
            ArtistName: '',
            AlbumName: '',
            TrackNumber: track.id,
            Duration: null,
            Plays: "0",
            ImageUrl: 'assets/thumbnail.svg'
          });
        });
      });

      this.apiService.getAlbumByName(this.search.value).subscribe(resp=>{
        console.log(resp)
        this.albums = resp;
      }, error => this.presentToast(error));
    }
  }

  setTrackList(index: number){
    this.activeTrack = index;
    this.store.dispatch(_Actions.set_TrackList({trackList: this.list, index}));
    //this.store.dispatch(_Actions.Set_AlbumImg({AlbumImg: this.list[index].ImageUrl}));
    this.openModal();
  }

  async openModal(){
    const modal = await this.modalController.create({
      component: MediaPlayerPage,
      animated: true,
      swipeToClose: true,
      id: 'mediaplayer',
      backdropDismiss: true,
      mode: 'ios',
      showBackdrop: true,
      componentProps: {
        fromSongs: true
      }
    });
    modal.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
