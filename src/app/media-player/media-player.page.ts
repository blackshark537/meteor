import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AudioplayerService } from 'src/app/services/audioplayer.service';
import { interval, Subscription } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import * as _Actions from '../actions/media.actions';
import { TrackInterface } from '../models/global.interface';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.page.html',
  styleUrls: ['./media-player.page.scss'],
})
export class MediaPlayerPage implements OnInit, OnDestroy {
  
  @Input('fromSongs') fromSongs: boolean = false;

  TrackName: string;
  lastTrack: number;
  AlbumImg: string;
  percent: number = 0;
  limit: number = 10;
  duration: number;
  seconds: number = 0;
  minutes: number = 0;
  secondsTotal: number = 0;
  minutesTotal: number = 0;
  isPlaying: boolean = false;
  _loading: boolean = false;
  _repeat: boolean = false;
  _shuffle: boolean = false;
  lastTime: number = 0;
  timer: Subscription;
  TrackList: TrackInterface[];
  like_me: boolean;

  constructor(
    private modalCtrl: ModalController,
    public audioCtrl: AudioplayerService,
    private store: Store<AppState>,
    private actionSheetCtrl: ActionSheetController
  ) {  }

  ngOnInit(){

    this.store.select('MediaState').subscribe((val: AppState) => {
      this.TrackName = val.trackName;
      this.isPlaying = val.isPlaying;
      this.AlbumImg = val.AlbumImg;
      this.TrackList = val.trackList;
      this.lastTrack = val.currentTrack;
      this._loading = val.loading;
      this._repeat = val.repeat;
      this._shuffle = val.shuffle;
    });

    this.like_me = false;
    
    this.timer = interval(500).subscribe(()=>{

      if(!this.duration || this.duration != this.audioCtrl.getDuration()){
        this.duration = this.audioCtrl.getDuration();
        this.minutesTotal = Math.floor(this.duration / 60);
        this.secondsTotal = Math.trunc(this.duration - this.minutesTotal * 60);
      }

      this.percent = this.audioCtrl.getCurrentTime();
      this.minutes = Math.floor(this.percent / 60);
      this.seconds = Math.trunc(this.percent - this.minutes * 60);
      
    });

  }

  ngOnDestroy(){
    this.timer.unsubscribe();
  }

  togglePlayer(){
    if(this.TrackList.length != 0 && !this.isPlaying && !this.fromSongs){
      //this.audioCtrl.setSrc(this.lastTrack);
      this.audioCtrl.setTrackList(this.TrackList, this.lastTrack)
    } else if(this.isPlaying){
      this.audioCtrl.pause();
      this.store.dispatch(_Actions.isPlaying({isPlaying: false}));
    } else {
      this.audioCtrl.resume();
      this.store.dispatch(_Actions.isPlaying({isPlaying: true}));
    }
  }

  skipF(){
    this.audioCtrl.skipForward();
  }

  skipB(){
    this.audioCtrl.skipBackward();
  }

  seek(val){
    this.audioCtrl.setCurrentTime(val);
    console.log(val);
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
    console.log(this.like_me);
  }

  repeat(){
    this.store.dispatch(_Actions.repeat({repeat: !this._repeat}));
  }

  shuffle(){
    this.store.dispatch(_Actions.shuffle({shuffle: !this._shuffle}));
  }
}
