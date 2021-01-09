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
  @Input('Tracks') Tracks:Track[];

  @Output('open') open = new EventEmitter();

  TrackList:TrackInterface[] = [];
  url: string = '';
  listId;

  constructor(
    private globalService: GlobalHttpService,
    private modalController: ModalController,
    private router: Router,
    private store:Store<AppState>,

  ) { 
    this.url = globalService.baseUrl;
  }

  ngOnInit() {
    this.Tracks.forEach(track =>{
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
  }

  setTrackList(index: number){
    this.store.dispatch(_Actions.set_TrackList({trackList: this.TrackList, index}));
    this.store.dispatch(_Actions.Set_AlbumImg({AlbumImg: this.TrackList[index].ImageUrl}));
    this.openModal();
  }

  deleteList(){
    this.store.dispatch(user_Actions.deletePlaylist({id: this.listId}));
    this.router.navigate(['tabs/tab3']);
  }

  async showConfirm(){
    if(await this.globalService.confirmAlert('Do you want to delete this list?')) this.deleteList();
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
