import { Injectable } from '@angular/core';
import { TrackInterface } from './global.interface';
import { StorageService } from './storage.service';
//import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioplayerService {

  private mediaplayer;
  private volume = 1;
  private trackList: TrackInterface[];
  private i: number;
  private timer;

  public TrackName: string;
  public albumImg: string;
  public playing: boolean;
  //public _playing = new Subject<boolean>();

  constructor(
    private storage: StorageService
  ) { 
    this.mediaplayer = new Audio();
  }

  private setTitle(){
    this.trackList[this.i].ArtistName? 
    window.document.title = this.trackList[this.i].Name + ' - '+ this.trackList[this.i].ArtistName 
    : window.document.title = this.trackList[this.i].Name ;
  }

  setTrackList(trackList: TrackInterface[], index: number){
    clearInterval(this.timer);
    this.trackList = trackList;
    this.i = index;
    this.play(trackList[this.i]).then(playing=>{
      this.playing = playing;
      //modified, using storageService instead of localstorage
      this.trackList[this.i].ArtistName? 
      this.storage.setTrackName(this.trackList[this.i].Name + ' - '+ this.trackList[this.i].ArtistName)
      : this.storage.setTrackName(this.trackList[this.i].Name);

      this.storage.setCurrentTrack(this.trackList[this.i].TrackUrl);
      this.setTitle();
    });
    this.timer = setInterval(()=>{
      if(this.mediaplayer.ended){
        this.skipForward();
      }
    }, 500);
  }

  getActiveTrack(): TrackInterface{
    return this.trackList[this.i];
  }

  setSrc(url: string){
    this.mediaplayer.currentTime = 0;
    this.mediaplayer.src = url;
  }

  play(track: TrackInterface): Promise<boolean>{
    return new Promise((solve, rej)=>{
      try{
        if(this.mediaplayer.canPlayType('audio/mpeg')){
          this.mediaplayer.mediaGroup = track.Name;
          this.mediaplayer.currentTime = 0;
          this.mediaplayer.src = track.TrackUrl;
          this.mediaplayer.volume = this.volume;
          this.mediaplayer.play();
          solve(true);
        } else {
          rej("Can't play audio/mpeg");
        }
      } catch(error){
        rej(error);
      }
    })
  }

  getMediaGroup(): string{
    return this.mediaplayer.mediaGroup;
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
    if(this.trackList && this.i < this.trackList.length-1){
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
