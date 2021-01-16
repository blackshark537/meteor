import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as user_Actions from '../../actions/user.actions';
import * as _Actions from '../../actions/media.actions';
import { AppState } from 'src/app/models/app.state';
import { Track, TrackInterface } from 'src/app/models/global.interface';
import { GlobalHttpService } from 'src/app/services/global.http.service';
import { ModalController } from '@ionic/angular';
import { MediaPlayerPage } from '../../media-player/media-player.page';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  @Input('name') name: string;
  @Input('album') album: string = '';
  @Input('artist') artist: string = '';
  @Input('Tracks') Tracks:Track[];
  @Input('can_delete') can_delete = false;

  @Output('open') open = new EventEmitter();
  @Output('delete') delete = new EventEmitter();

  TrackList:TrackInterface[] = [];
  url: string = '';
  listId;
  slice = 15;

  constructor(
    private globalService: GlobalHttpService,
    private modalController: ModalController,
    private router: Router,
    private store:Store<AppState>,

  ) { 
    this.url = globalService.baseUrl;
  }

  ngOnInit() {
    this.Tracks.forEach((track, i )=>{
      this.TrackList.push({
        _id: track.id,
        Name: track.nombre,
        TrackUrl: this.url+track.file.url,
        ArtistName: track.artist.nombre? track.artist.nombre : this.artist,
        AlbumName: track.album.nombre? track.album.nombre : this.album,
        TrackNumber: track.id,
        Duration: null,
        Plays: track.reproducido,
        ImageUrl: this.url + track.image.url
      });
    });
  }

  setTrackList(index: number){
    this.store.dispatch(_Actions.set_TrackList({trackList: this.TrackList, index}));
    this.store.dispatch(_Actions.Set_AlbumImg({AlbumImg: this.TrackList[index].ImageUrl}));
    this.openModal();
  }

  deleteOne(id){
    this.delete.emit(id);
  }

  async showConfirm(id){
    if(await this.globalService.confirmAlert('Do you want to delete this list?')) this.deleteOne(id);
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
