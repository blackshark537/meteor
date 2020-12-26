import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import * as _Actions from '../actions/media.actions';
import * as _userActions from '../actions/user.actions';
import { MPState } from '../models/mp.state';
import { Track, TrackInterface, UserInterface, userPlaylist } from '../models/global.interface';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.page.html',
  styleUrls: ['./media-player.page.scss'],
})
export class MediaPlayerPage implements OnInit, OnDestroy {
  
  @Input('fromSongs') fromSongs: boolean = false;
  @ViewChild('playlistSelect', {static: false}) select;

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

  like_me: boolean = false;
  likes: Track[] = [];
  track: TrackInterface;
  user_playlists = [];

  constructor(
    private modalCtrl: ModalController,
    private store: Store<AppState>,
    private actionSheetCtrl: ActionSheetController
  ) { 
    
  }

  ngOnInit(){

    this.store.select('UserState').subscribe(resp => this.user_playlists = resp.playlists )

    this.store.select('MediaState').subscribe(state => {
      this.state = {...state};
      this.track = state.trackList[state.currentTrack];
      this.duration = state.duration;
      this.minutesTotal = Math.floor(this.duration / 60);
      this.secondsTotal = Math.trunc(this.duration - this.minutesTotal * 60);

      this.percent = state.currentTime;
      this.minutes = Math.floor(this.percent / 60);
      this.seconds = Math.trunc(this.percent - this.minutes * 60);
    });

    this.store.select('UserState').subscribe(user =>{
      this.likes = user.likes;
      this.itLikesMe();
    });
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

  seek(val: number){
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
          this.select.el.click()
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

  addToList(value){
    const playlist: userPlaylist = JSON.parse(value);
    if(playlist.id && this.track._id){
      console.log(playlist.id, this.track._id);
    } else {
      console.log('Invalid track');
    }
  }

  likeMe(){
    //dispatch like
    console.log(this.itLikesMe());
    if(!this.like_me ){
      this.store.dispatch(_userActions.Like({trackId: this.track._id}));
    }
  }

  itLikesMe(){
    for(let i =0; i < this.likes.length; ++i){
      let t = this.likes[i];
      if(t.nombre.includes(this.track.Name)) {
        this.like_me = true;
        break;
      }
    }
  }

  repeat(){
    this.store.dispatch(_Actions.repeat({repeat: !this.state.repeat}));
  }

  shuffle(){
    this.store.dispatch(_Actions.shuffle({shuffle: !this.state.shuffle}));
  }
}
