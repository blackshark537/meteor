import { Injectable } from '@angular/core';
import { TrackInterface } from '../models/global.interface';
import { Store } from '@ngrx/store';
import { loading, Set_TrackName, Set_CurrentTrack, Set_TrackList, isPlaying } from '../actions/media.actions'
import { AppState} from '../models/app.state';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioplayerService {

  private mediaplayer = new Audio();
  private volume = 1;
  private state$: Observable<AppState> = this.store.select('MediaState');
  private state: AppState;
  private trackList: TrackInterface[];
  private i: number;

  public TrackName: string;
  public albumImg: string;
  public playing: boolean;

  constructor(
    private store: Store<AppState>
  ) { 
  }

  async setTrackList(trackList: TrackInterface[], index: number){
    //clearInterval(this.timer);
    await this.state$.subscribe(stado => this.state = stado);
    this.trackList = trackList;
    this.i = index;
    let trackName = this.trackList[this.i].ArtistName? 
    this.trackList[this.i].Name + ' - '+ this.trackList[this.i].ArtistName 
    : this.trackList[this.i].Name;
    await this.store.dispatch(isPlaying({isPlaying: false}));
    await this.store.dispatch(Set_TrackName({trackName: trackName}));
    await this.store.dispatch(Set_CurrentTrack({currentTrack: index}));
    await this.store.dispatch(Set_TrackList({TrackList: trackList}));
    await this.play(trackList[this.i]);
  }

  getActiveTrack(): TrackInterface{
    return this.trackList[this.i];
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
          //this.mediaplayer.mediaGroup = track.Name;
          this.mediaplayer.currentTime = 0;
          this.mediaplayer.src = track.TrackUrl;
          this.mediaplayer.volume = this.volume;
          this.mediaplayer.play();
          this.mediaplayer.onloadstart = ()=>{
            this.store.dispatch(loading({loading: true}));
          }

          this.mediaplayer.onloadeddata = ()=>{
            this.store.dispatch(loading({loading: false}));
          }

          this.mediaplayer.onended = ()=> this.skipForward();

          this.mediaplayer.onplay = ev =>{
            this.store.dispatch(isPlaying({isPlaying: ev.returnValue}));
            solve(ev.returnValue);
          };
/*           this.mediaplayer.ontimeupdate = (ev)=>{  // download onprogresss 
            ev.preventDefault();
            console.log('time: ', this.mediaplayer.currentTime);
          } */

          /* 
          this.mediaplayer.onsuspend = ev => console.log(ev.type);
          this.mediaplayer.onabort = ev => console.log(ev.type);
           */
        } else {
          this.store.dispatch(isPlaying({isPlaying: false}));
          rej("Can't play audio/mpeg");
        }
      } catch(error){
        rej(error);
      }
    })
  }

  getMediaGroup(): string{
    return undefined //this.mediaplayer.mediaGroup;
  }

  setCurrentTime(time: number){
    this.mediaplayer.currentTime = time;
  }

  setVolume(volume: number){
    this.volume = volume;
    this.mediaplayer.volume = this.volume;
  }

  getVolume(): number{
    return this.volume;
  }

  pause(){
    this.mediaplayer.pause();
    this.store.dispatch(isPlaying({isPlaying: false}));
  }

  resume(){
    this.mediaplayer.play();
    this.store.dispatch(isPlaying({isPlaying: true}));
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
    if(this.getCurrentTime() > 2){
      this.setCurrentTime(0);
    }else{
      if(this.trackList && this.i > 0){
        this.i--;
        this.setTrackList(this.trackList, this.i);
      }
    }
  }

}
