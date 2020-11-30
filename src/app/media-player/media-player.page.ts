import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import * as _Actions from '../actions/media.actions';
import { MPState } from '../models/mp.state';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.page.html',
  styleUrls: ['./media-player.page.scss'],
})
export class MediaPlayerPage implements OnInit, OnDestroy {
  
  @Input('fromSongs') fromSongs: boolean = false;

  state: MPState = {
    trackName: '',
    AlbumImg: '',
    currentTrack: 0,
    loading: true,
    isPlaying: false,
    trackList: [],
    repeat: false,
    shuffle: false
  };
  
  
  duration: number;
  percent: number = 0;
  limit: number = 10;
  
  seconds: number = 0;
  minutes: number = 0;
  secondsTotal: number = 0;
  minutesTotal: number = 0;

  like_me: boolean;

  constructor(
    private modalCtrl: ModalController,
    private store: Store<AppState>,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit(){

    this.store.select('MediaState').subscribe(state => {
      this.state = {...state};
      this.duration = state.duration;
      this.minutesTotal = Math.floor(this.duration / 60);
      this.secondsTotal = Math.trunc(this.duration - this.minutesTotal * 60);

      this.percent = state.currentTime;
      this.minutes = Math.floor(this.percent / 60);
      this.seconds = Math.trunc(this.percent - this.minutes * 60);
    });

    this.like_me = false;

  }

  ngOnDestroy(){
  }

  togglePlayer(){
    if(this.state.isPlaying){
      this.store.dispatch(_Actions.pause());
    } else {
      /* if(this.state.trackList.length != 0 && !this.fromSongs){
        this.store.dispatch(_Actions.set_TrackList({trackList: this.state.trackList, index: this.state.currentTrack}));
      } else { }*/ 
        this.store.dispatch(_Actions.resume());
    }
  }

  skipF(){
    this.store.dispatch(_Actions.skip_fwrd());
  }

  skipB(){
    this.store.dispatch(_Actions.skip_bkwrd());
  }

  seek(val){
    this.store.dispatch(_Actions.seek({time: val}));
  }

  dismissModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async presentActionSheet(){
    const actionSheet = this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [{
        text: 'add to playList',
        icon: 'add-circle-outline',
        handler: ()=>{
          console.log("added to playlist");
        },
        cssClass: 'dark'
      },{
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: ()=>{
          console.log("closed");
        }
      }]
    });

    await (await actionSheet).present();
  }

  likeMe(){
    this.like_me = !this.like_me;
  }

  repeat(){
    this.store.dispatch(_Actions.repeat({repeat: !this.state.repeat}));
  }

  shuffle(){
    this.store.dispatch(_Actions.shuffle({shuffle: !this.state.shuffle}));
  }
}
