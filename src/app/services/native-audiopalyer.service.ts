import { Injectable } from '@angular/core';
import { Media, MediaObject} from '@ionic-native/media/ngx';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import { loading, Set_TrackName, Set_CurrentTrack, set_TrackList, isPlaying } from '../actions/media.actions'
import { TrackInterface } from '../models/global.interface';
import { Observable } from 'rxjs';
import { MusicControlService } from './music-control.service';
import { MPState } from '../models/mp.state';

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
  _isPlaying = false;
  private state: MPState;
  
  constructor(
    private store: Store<AppState>,
    private media: Media,
  ) { 
    store.select('MediaState').subscribe(state =>{
      this.state = state
    });
  }

  async setTrackList(trackList: TrackInterface[], index: number){
    
    this.trackList = trackList;
    this.i = index;
    let trackName = this.trackList[this.i].ArtistName? 
    this.trackList[this.i].Name + ' - '+ this.trackList[this.i].ArtistName 
    : this.trackList[this.i].Name;
    await this.store.dispatch(isPlaying({isPlaying: false}));
    await this.store.dispatch(Set_TrackName({trackName: trackName}));
    await this.store.dispatch(Set_CurrentTrack({currentTrack: index}));
    await this.play_native(trackList[this.i]);

    this.file.onStatusUpdate.subscribe(status => {
      switch (status) {
        case 1: // 1. Starting
          break;
        case 2:   // 2: playings
        this._isPlaying = true;
        this.store.dispatch(isPlaying({isPlaying: true}));
          break;
        case 3:   // 3: pause
        this._isPlaying = false;
        this.store.dispatch(isPlaying({isPlaying: false}));
          break;
        case 4:   // 4: stop
        default:
          this._isPlaying = false;
          this.store.dispatch(isPlaying({isPlaying: false}));
          break;
      }
    });
  }

  mute(){
    this.file.setVolume(0.0);
  }

  play_native(track: TrackInterface){
    if(this._isPlaying){
      this.stop_native();
    }
    this.file = this.media.create(track.TrackUrl);
    this.getDuration_native();
  }

  setCurrentTime_native(time: number){
    this.file.seekTo(time);
  }

  pause_native(){
    this.file.pause();
  }

  resume_native(){
    this.file.play();
  }

  stop_native(){
    this.file.stop();
    this.file.release();
  }

  async getCurrentTime_native(): Promise<{position: number}>{
    return await this.file.getCurrentPosition();
  }

  getDuration_native(){
    this.file = this.media.create(this.trackList[this.i].TrackUrl);
    // On occassions, the plugin only gives duration of the file if the file is played
    // at least once
    this.file.play();
    this.mute();  // you don't want users to notice that you are playing the file
    const self = this;
    // The plugin does not give the correct duration on playback start
    // need to check for duration repeatedly
    let temp_duration = self.duration;
    this.get_duration_interval = setInterval(() => {
      if (self.duration === -1 || !self.duration) {
        self.duration = ~~(self.file.getDuration());  // make it an integer
      } else {
        if (self.duration !== temp_duration) {
          temp_duration = self.duration;
        }
        else {
          this.file.stop();
          this.file.release();
          clearInterval(self.get_duration_interval);
          console.log(self.duration);
          this.display_duration = this.toHHMMSS(self.duration);
          self.setToPlayback();
        }
      }
    }, 100);
  }

  toHHMMSS(duration){
    this.minutes = Math.floor(duration / 60);
    this.seconds = Math.trunc(duration - this.minutes * 60);
    return `${this.minutes}:${this.seconds}`;
  }

  setToPlayback(){
    this.file.setVolume(1.0);
    this.file.play();
  }

  async getCurrentTime(): Promise<number>{
    let x = await this.file.getCurrentPosition();
    console.log('pos: ', x);
    return parseFloat(x);
  }

  getDuration(): number{
    let duration = this.file.getDuration();
    console.log('duration: ', duration);
    return duration;
  }

  setCurrentTime(time: number){
    this.file.seekTo(time);
  }

  getAndSetCurrentAudioPosition() {
    const diff = 1;
    const self = this;
    this.get_position_interval = setInterval(() => {
      const last_position = self.position;
      self.file.getCurrentPosition().then((position) => {
        if (position >= 0 && position < self.duration) {
          if (Math.abs(last_position - position) >= diff) {
            // set position
            self.file.seekTo(last_position * 1000);
          } else {
            // update position for display
            self.position = position;
            this.display_position = this.toHHMMSS(self.position);
          }
        } else if (position >= self.duration) {
          self.stop_native();
          self.setToPlayback();
        }
      });
    }, 100);
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
    const time = await this.getCurrentTime();
    if( time > 2){
      this.setCurrentTime_native(0);
    }else{
      if(this.trackList && this.i > 0){
        this.i--;
        this.setTrackList(this.trackList, this.i);
      }
    }
  }

}
