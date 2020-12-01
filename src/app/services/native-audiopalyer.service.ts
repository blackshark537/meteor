import { Injectable } from '@angular/core';
import { Media, MediaObject} from '@ionic-native/media/ngx';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import * as _Actions from '../actions/media.actions'
import { TrackInterface } from '../models/global.interface';
import { MPState } from '../models/mp.state';
import { MusicControlService } from './music-control.service';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NativeAudiopalyerService {

  public file: MediaObject = null;
  private trackList: TrackInterface[];
  private i: number;
  seconds: number = 0;
  minutes: number = 0;

  public TrackName: string;
  public albumImg: string;
  public playing: boolean;
  get_duration_interval;
  get_position_interval
  duration;
  position;
  display_duration;
  display_position;
  timer: Subscription;

  private state: MPState;
  
  constructor(
    private store: Store<AppState>,
    private media: Media,
    private audioControls: MusicControlService
  ) { 
    store.select('MediaState').subscribe(state =>{
      this.state = state;
      console.log(`Duration: ${state.duration} | curr_time: ${state.currentTime}`);
    });
  }

  async setTrackList(trackList: TrackInterface[], index: number){
    
    this.trackList = trackList;
    this.i = index;
    let trackName = this.trackList[this.i].ArtistName? 
    this.trackList[this.i].Name + ' - '+ this.trackList[this.i].ArtistName 
    : this.trackList[this.i].Name;
    await this.store.dispatch(_Actions.isPlaying({isPlaying: false}));
    await this.store.dispatch(_Actions.Set_TrackName({trackName: trackName}));
    await this.store.dispatch(_Actions.Set_CurrentTrack({currentTrack: index}));
    if(this.file) await this.stop_native();
    setTimeout( async _=>{
      let track = trackList[this.i];
      let hasPrev = this.i > 0? true : false;
      let hasNext = this.i < trackList.length-1? true : false;
      this.audioControls.create(track, hasPrev, hasNext);
      await this.play_native(trackList[this.i]);

      console.log(`track ${this.i}, name: ${trackName}`);

      this.file.onStatusUpdate.subscribe(status => {
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
            if(this.state.currentTime > 10 && Math.floor(this.state.currentTime) > Math.floor(this.state.duration)-5) {
              this.file.release();
              this.skipForward();
            }
            break;
        }
      });
    },500);
  }

  mute(){
    this.file.setVolume(0.0);
  }

  play_native(track: TrackInterface){
    this.file = this.media.create(track.TrackUrl);
    this.file.play();
    this.timer = interval(300).subscribe(_=>{
      this.store.dispatch(_Actions.get_duration());
      this.store.dispatch(_Actions.get_current_time());
    });
  }

  setCurrentTime(milis: number){
    console.log(`Seek pos: ${milis}`);
    this.file.seekTo(milis);
  }

  pause_native(){
    this.file.pause();
  }

  resume_native(){
    this.file.play();
  }

  async stop_native(){
    await this.file.stop();
    await this.file.release();
  }

  setToPlayback(){
    this.file.setVolume(1.0);
    this.file.play();
  }

  async getCurrentTime(): Promise<number>{
    let x = await this.file.getCurrentPosition();
    return parseFloat(x);
  }

  getDuration(): number{
    let duration = this.file.getDuration();
    return duration;
  }

  controlSeconds(action) {
    const step = 5;
    const numberRange = this.position;
    switch (action) {
      case 'back':
        this.position = numberRange < step ? 0.001 : numberRange - step;
        break;
      case 'forward':
        this.position = numberRange + step < this.duration ? numberRange + step : this.duration;
        break;
      default:
        break;
    }
  }

  skipForward(){
    if(this.state.repeat){
      this.setTrackList(this.trackList, this.i);
    } else if(this.state.shuffle){
      this.i = Math.floor(Math.random() * this.trackList.length-1);
      this.setTrackList(this.trackList, this.i);
    } else if(this.trackList && this.i < this.trackList.length-1){
      this.i++;
      this.setTrackList(this.trackList, this.i);
    }
  }

  async skipBackward(){
      if(this.trackList && this.i > 0){
        this.i--;
        this.setTrackList(this.trackList, this.i);
      }
  }





}
