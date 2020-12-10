import { Injectable } from '@angular/core';
import { TrackInterface } from '../models/global.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import * as _Actions from '../actions/media.actions';
import { MusicControls } from '@ionic-native/music-controls';
import { Platform } from '@ionic/angular';
import { MPState } from '../models/mp.state';

@Injectable({
  providedIn: 'root'
})
export class MusicControlService {

  state: MPState;

  constructor(
    private store: Store<AppState>,
    platform: Platform
  ) { 
    if(platform.is('hybrid')){
      store.select('MediaState').subscribe(state =>{
        MusicControls.updateIsPlaying(state.isPlaying);
        this.state = state;
       /* MusicControls.updateElapsed({
         elapsed: state.currentTime, // seconds
         isPlaying: state.isPlaying
       }); */
     });
    }
  }

  create(track: TrackInterface, _Pv: boolean, _Nx: boolean) {
    MusicControls.create({
      track: track.Name,		// optional, default : ''
      artist: track.Artist,						// optional, default : ''
      album: track.Album,     // optional, default: ''
      cover: track.ImageUrl,		// optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //			 or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying: true,							// optional, default : true
      dismissable: false,							// optional, default : false

      // hide previous/next/close buttons:
      hasPrev: false,		// show previous button, optional, default: true
      hasNext: false,		// show next button, optional, default: true
      hasClose: true,		// show close button, optional, default: false

      // iOS only, optional

      duration: 300, // optional, default: 0
      elapsed: 10, // optional, default: 0
      hasSkipForward: false, //optional, default: false. true value overrides hasNext.
      hasSkipBackward: false, //optional, default: false. true value overrides hasPrev.
      skipForwardInterval: 15, //optional. default: 0.
      skipBackwardInterval: 15, //optional. default: 0.
      hasScrubbing: false, //optional. default to false. Enable scrubbing from control center progress bar 

      // Android only, optional
      // text displayed in the status bar when the notification (and the ticker) are updated
      ticker: `Now playing "${track.Name}"`,
      //All icons default to their built-in android equivalents
      //The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification'
    });

    MusicControls.subscribe().subscribe( _action =>{
      this.events(_action);
    });
    MusicControls.listen();
  }

  events(action) {
    const message = JSON.parse(action).message;
    switch (message) {
      case 'music-controls-next':
        // Do something
        if(!this.state.loading) this.store.dispatch(_Actions.skip_fwrd());
        break;
      case 'music-controls-previous':
        // Do something
        if(!this.state.loading) this.store.dispatch(_Actions.skip_bkwrd());
        break;
      case 'music-controls-pause':
        // Do something
        //if(!this.state.loading) this.store.dispatch(_Actions.pause());
        break;
      case 'music-controls-play':
        // Do something
        //if(!this.state.loading) this.store.dispatch(_Actions.resume());
        break;
      case 'music-controls-destroy':
        // Do something
        this.destroy();
        break;

      // External controls (iOS only)
      case 'music-controls-toggle-play-pause':
        // Do something
        break;
      case 'music-controls-seek-to':
        const seekToInSeconds = JSON.parse(action).position;
        MusicControls.updateElapsed({
          elapsed: seekToInSeconds,
          isPlaying: true
        });
        // Do something
        break;

      // Headset events (Android only)
      // All media button events are listed below
      case 'music-controls-media-button':
        // Do something
        if(!this.state.loading) this.store.dispatch(_Actions.skip_fwrd());
        break;
      case 'music-controls-headset-unplugged':
        // Do something
        if(!this.state.loading) this.store.dispatch(_Actions.pause());
        break;
      case 'music-controls-headset-plugged':
        // Do something
        if(!this.state.loading) this.store.dispatch(_Actions.resume());
        break;
      default:
        break;
    }
  }

  async destroy(){
    await MusicControls.destroy().then(val =>{
      //this.store.dispatch(_Actions.pause());
    });
  }
}
