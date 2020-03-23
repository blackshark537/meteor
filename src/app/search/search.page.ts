import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/Api.service';
import { AudioplayerService } from '../services/audioplayer.service';
import { MediaPlayerPage } from '../media-player/media-player.page';
import { ALbumInterface } from '../models/global.interface';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('search', {static: false}) search;

  list: any[] = [];
  albums: ALbumInterface[] = [];

  constructor(
    private apiService: ApiService,
    private audioCtrl: AudioplayerService,
    private toastController: ToastController,
    private modalController: ModalController,
    private storge: StorageService
  ) { }

  ngOnInit() {
  }

  onSearch(){
    if(this.search.value.length > 2){
      this.list = [];
      this.albums = [];
      this.apiService.getTrack(this.search.value).subscribe(resp=>{
        this.list = resp.docs;
      }, error => this.presentToast(error));

      this.apiService.getAlbumByName(this.search.value).subscribe(resp=>{
        this.albums.push(... resp.docs);
      }, error => this.presentToast(error));
    }
  }

  setTrackList(index: number){
    this.audioCtrl.setTrackList(this.list, index);
    this.storge.setAlbumImg('/assets/thumbnail.svg');
    this.openModal();
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
