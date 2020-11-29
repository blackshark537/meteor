import { Injectable } from '@angular/core';
import { TrackInterface } from '../models/global.interface';
import { Store } from '@ngrx/store';
import * as _Actions from '../actions/media.actions'
import { AppState} from '../models/app.state';
import { MPState } from '../models/mp.state';

@Injectable({
  providedIn: 'root'
})

export class AudioplayerService {

  private mediaplayer = new Audio();
  private volume = 0.7;
  private state: MPState;
  private trackList: TrackInterface[];
  private i: number;

  public TrackName: string;
  public albumImg: string;
  public playing: boolean;

  constructor(
    private store: Store<AppState>
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
    await this.store.dispatch(_Actions.isPlaying({isPlaying: false}));
    await this.store.dispatch(_Actions.Set_TrackName({trackName: trackName}));
    await this.store.dispatch(_Actions.Set_CurrentTrack({currentTrack: index}));
    await this.play(trackList[this.i]);
  }

  getActiveTrack(): TrackInterface{
    return this.state.trackList[this.i];
  }

  setSrc(url: string){
    this.mediaplayer.currentTime = 0;
    this.mediaplayer.src = url;
  }

  setTracks(trackList: TrackInterface[]){
    this.trackList = trackList;
    this.i = 0;
  }

  play(track: TrackInterface): Promise<boolean>{
        return new Promise((solve, rej)=>{
        try{
          if(this.mediaplayer.canPlayType('audio/mpeg')){
            this.mediaplayer.currentTime = 0;
            this.mediaplayer.src = track.TrackUrl;
            this.mediaplayer.volume = this.volume;
            this.mediaplayer.play();
            this.mediaplayer.onloadstart = ()=>{
              this.store.dispatch(_Actions.loading({loading: true}));
            }
  
            this.mediaplayer.onloadeddata = ()=>{
              this.store.dispatch(_Actions.loading({loading: false}));
            }
            
            this.mediaplayer.ontimeupdate = () =>{
              this.store.dispatch(_Actions.get_duration());
              this.store.dispatch(_Actions.get_current_time());
            }

            this.mediaplayer.onended = ()=> this.skipForward();

            this.mediaplayer.onplay = ev =>{
              this.store.dispatch(_Actions.isPlaying({isPlaying: ev.returnValue}));
              solve(ev.returnValue);
            };
          } else {
            this.store.dispatch(_Actions.isPlaying({isPlaying: false}));
            rej("Can't play audio/mpeg");
          }
        } catch(error){
          rej(error);
        }
    });
  }

  getMediaGroup(): string{
    return undefined //this.mediaplayer.mediaGroup;
  }

  setCurrentTime(time: number){
    this.mediaplayer.currentTime = time;
  }

  setVolume(volume: number){
    this.volume = volume;
    this.mediaplayer.volume = volume;
  }

  getVolume(): number{
    return this.volume;
  }

  pause(){
    this.mediaplayer.pause();
    this.store.dispatch(_Actions.isPlaying({isPlaying: false}));
  }

  resume(){
    this.mediaplayer.play();
  }

  stop(){
    this.mediaplayer.currentTime = 0;
    this.mediaplayer.pause();
  }

  getCurrentTime(): number{
    return this.mediaplayer.currentTime;
  }

  getDuration(): number{
    return this.mediaplayer.duration;
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

  skipBackward(){
    //if(this.platform.is('hybrid')) this.file.release();
    if(this.getCurrentTime() > 2){
      //if(this.platform.is('hybrid')) this.setCurrentTime_native(0);
      this.setCurrentTime(0);
    }else{
      if(this.trackList && this.i > 0){
        this.i--;
        this.setTrackList(this.trackList, this.i);
      }
    }
  }

}
