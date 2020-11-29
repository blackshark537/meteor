import { Injectable } from '@angular/core';
import { TrackInterface } from '../models/global.interface';
import { Plugins } from '@capacitor/core';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import * as _Actions from '../actions/media.actions';
import { Platform } from '@ionic/angular';

const { CapacitorMusicControls } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class MusicControlService {

  constructor(
    private store: Store<AppState>
  ) { 
  }

  create(Track: TrackInterface, _hasPrev?: boolean, _hasNext?: boolean) {
    CapacitorMusicControls.create({
      track: Track.Name,        // optional, default : ''
      artist: Track.ArtistName,                       // optional, default : ''
      cover: Track.ImageUrl,      // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying: true,                         // optional, default : true
      dismissable: true,                         // optional, default : false

      // hide previous/next/close buttons:
      hasPrev: _hasPrev,    // show previous button, optional, default: true
      hasNext: _hasNext,      // show next button, optional, default: true
      hasClose: true,       // show close button, optional, default: false

      // iOS only, optional
      album: Track.AlbumName,     // optional, default: ''
      duration: 60, // optional, default: 0
      elapsed: 10, // optional, default: 0
      hasSkipForward: true,  // show skip forward button, optional, default: false
      hasSkipBackward: true, // show skip backward button, optional, default: false
      skipForwardInterval: 15, // display number for skip forward, optional, default: 0
      skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
      hasScrubbing: false, // enable scrubbing from control center and lockscreen progress bar, optional

      // Android only, optional

      // text displayed in the status bar when the notification (and the ticker) are updated, optional
      ticker: `Now playing ${Track.Name}`,
      // All icons default to their built-in android equivalents
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification'
    }, this.onSuccess(), error =>{
      console.log(error);
    });
  }

  onSuccess(){
    CapacitorMusicControls.addListener('controlsNotification', (info: any) => {
      console.log('controlsNotification was fired');
      this.handleControlsEvent(info);
  });
  }

  updatePlaying(value: boolean){
    CapacitorMusicControls.updateIsPlaying({
      isPlaying: value, // affects Android only
      //elapsed: timeElapsed // affects iOS Only
    });
  }

  handleControlsEvent(action){

    console.log("hello from handleControlsEvent")
    const message = action.message;
  
    console.log("message: " + message)
  
    switch(message) {
      case 'music-controls-next':
        // next
        this.store.dispatch(_Actions.skip_fwrd());
        break;
      case 'music-controls-previous':
        // previous
        this.store.dispatch(_Actions.skip_bkwrd());
        break;
      case 'music-controls-pause':
        // paused
        this.store.dispatch(_Actions.pause());
        break;
      case 'music-controls-play':
        // resumed
        this.store.dispatch(_Actions.resume());
        break;
      case 'music-controls-destroy':
        // controls were destroyed
        this.store.dispatch(_Actions.pause());
        break;
  
      // External controls (iOS only)
      case 'music-controls-toggle-play-pause' :
        // do something
        break;
      case 'music-controls-seek-to':
        // do something
        break;
      case 'music-controls-skip-forward':
        // Do something
        break;
      case 'music-controls-skip-backward':
        // Do something
        break;
  
      // Headset events (Android only)
      // All media button events are listed below
      case 'music-controls-media-button' :
        // Do something
        break;
      case 'music-controls-headset-unplugged':
        // Do something
        this.store.dispatch(_Actions.pause());
        break;
      case 'music-controls-headset-plugged':
        // Do something
        this.store.dispatch(_Actions.resume());
        break;
      default:
        break;
    }
  }

}
