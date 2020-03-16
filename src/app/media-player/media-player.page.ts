import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AudioplayerService } from 'src/app/audioplayer.service';
import { interval, Subscription } from 'rxjs';
import { StorageService } from '../storage.service';
import { ActionSheetController } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.page.html',
  styleUrls: ['./media-player.page.scss'],
})
export class MediaPlayerPage implements OnInit, OnDestroy {
  
  @Input('fromSongs') fromSongs: boolean = false;
  //@ViewChild('range', { static: false}) range: IonRange;

  TrackName: string;
  AlbumImg: string;
  percent: number = 0;
  limit: number = 10;
  duration: number;
  seconds: number = 0;
  minutes: number = 0;
  secondsTotal: number = 0;
  minutesTotal: number = 0;
  isPlaying: boolean = false;
  lastTime: number = 0;
  timer: Subscription;
  trackUrl: string;
  like_me: boolean;

  constructor(
    private modalCtrl: ModalController,
    public audioCtrl: AudioplayerService,
    private storage: StorageService,
    private actionSheetCtrl: ActionSheetController
  ) {
  }

  ngOnInit(){
    this.like_me = false;
    this.isPlaying = this.audioCtrl.playing;
    this.timer = interval(500).subscribe(()=>{
      //modified, using storageService instead of localstorage
      if(!this.AlbumImg || this.AlbumImg != this.storage.getAlbumImg()){
        this.AlbumImg = this.storage.getAlbumImg();
      }
      //modified, using storageService instead of localstorage
      if(!this.TrackName || this.TrackName != this.storage.getTrackName()){
        this.TrackName = this.storage.getTrackName();
        window.document.title = this.TrackName;
      }

      if(!this.duration || this.duration != this.audioCtrl.getDuration()){
        this.duration = this.audioCtrl.getDuration();
        this.minutesTotal = Math.floor(this.duration / 60);
        this.secondsTotal = Math.trunc(this.duration - this.minutesTotal * 60);
      }

      this.percent = this.audioCtrl.getCurrentTime();
      this.minutes = Math.floor(this.percent / 60);
      this.seconds = Math.trunc(this.percent - this.minutes * 60);
      
    });

    //bug here not play when is fromSongs
    if(!this.isPlaying && !this.fromSongs){
      this.trackUrl = this.storage.getCurrentTrack();
      this.audioCtrl.setSrc(this.trackUrl);
    }
  }

  ngOnDestroy(){
    this.timer.unsubscribe();
  }

  togglePlayer(){
    if(this.isPlaying){
      this.audioCtrl.pause();
      this.isPlaying = false;
    } else {
      this.audioCtrl.resume();
      this.isPlaying = true;
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
    })

    await (await actionSheet).present();
  }

  likeMe(){
    this.like_me = !this.like_me;
    console.log(this.like_me);
  }
}
