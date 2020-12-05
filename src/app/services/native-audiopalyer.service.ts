import { Injectable } from '@angular/core';
import { Media, MediaObject} from '@ionic-native/media/ngx';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import * as _Actions from '../actions/media.actions'
import { TrackInterface } from '../models/global.interface';
import { MPState } from '../models/mp.state';
//import { CronJob } from 'cron';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { interval } from 'rxjs';

const { App } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NativeAudiopalyerService {

  public file: MediaObject = null;
  private i: number;
  private timer = interval(1000); //timer to update audio progress bar
  private appIsActive: boolean = true;
  //cronjob: CronJob;

  private state: MPState;
  
  constructor(
    private store: Store<AppState>,
    private media: Media,
    platform: Platform
  ) { 
    if(platform.is('hybrid')){
      store.select('MediaState').subscribe(state =>{
        this.state = state;
      });
      App.addListener('appStateChange', appState =>{
        this.appIsActive = appState.isActive;
      });
    }
  }

  async setTrackList(trackList: TrackInterface[], index: number){
    
    this.i = index;
    let trackName = this.state.trackList[this.i].ArtistName? 
    this.state.trackList[this.i].Name + ' - '+ this.state.trackList[this.i].ArtistName 
    : this.state.trackList[this.i].Name;
    await this.store.dispatch(_Actions.isPlaying({isPlaying: false}));
    await this.store.dispatch(_Actions.Set_TrackName({trackName}));
    await this.store.dispatch(_Actions.Set_CurrentTrack({currentTrack: index}));

    setTimeout( async _=>{
      await this.play_native(trackList[this.i]);
      this.file.onStatusUpdate.subscribe(status => {
        console.log(`Status Updated: ${status}`);
        switch (status) {
          case 1: // 1. Starting
            console.log('starting...')
            this.store.dispatch(_Actions.loading({loading: true}));
            break;
          case 2:   // 2: playing
            console.log('playing...')
            this.store.dispatch(_Actions.isPlaying({isPlaying: true}));
            break;
          case 3:   // 3: pause
            console.log('pause...')
            this.store.dispatch(_Actions.isPlaying({isPlaying: false}));
            break;
          case 4:   // 4: stop
          default:
            console.log('stop...')
            this.store.dispatch(_Actions.isPlaying({isPlaying: false}));
            if(this.appIsActive){
              if(this.state.currentTime > Math.floor(this.state.duration) -10) this.skipForward();
            } else {
              this.skipForward();
            }
            break;
        }
      });
    },500);
  }

  async mute(){
    await this.file.setVolume(0.0);
  }

  async play_native(track: TrackInterface){
    this.file = await this.media.create(track.TrackUrl);
    await this.file.play();
    this.timer.subscribe(async _=>{
      if(this.appIsActive){
        await this.store.dispatch(_Actions.get_duration());
        await this.store.dispatch(_Actions.get_current_time());
      }
    });
/*     this.cronjob = new CronJob('* * * * * *', ()=> {
      //iT will trigger this every second 
      try {
        this.store.dispatch(_Actions.get_duration());
        this.store.dispatch(_Actions.get_current_time());
      } catch (error) {
        console.error(error);
      }
    }, null, true, 'America/Santo_Domingo');

    this.cronjob.start(); */
  }

  async setCurrentTime(milis: number){
    await this.file.seekTo(milis*1000);
  }

  async pause_native(){
    await this.file.pause();
  }

  async resume_native(){
    await this.file.play();
  }

  async stop_native(){
    await this.file.stop();
    await this.file.release();
  }

  async getCurrentTime(): Promise<number>{
    let x = await this.file.getCurrentPosition();
    return parseFloat(x);
  }

  getDuration(): number{
    let duration = this.file.getDuration();
    return duration;
  }

  async skipForward(){
    if(this.state.repeat){
      await this.setCurrentTime(0);
      await this.file.play();
    } else if(this.state.shuffle){
      this.i = Math.floor(Math.random() * this.state.trackList.length-1);
      await this.store.dispatch(_Actions.set_TrackList({trackList:this.state.trackList, index: this.i}));
    } else if(this.state.trackList && this.i < this.state.trackList.length-1){
      ++this.i;
      await this.store.dispatch(_Actions.set_TrackList({trackList:this.state.trackList, index: this.i}));
    }
  }

  async skipBackward(){
      if(this.state.trackList && this.i > 0){
        --this.i;
        await this.store.dispatch(_Actions.set_TrackList({trackList:this.state.trackList, index: this.i}));
      }
  }





}
