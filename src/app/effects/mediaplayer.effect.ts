import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { AudioplayerService } from '../services/audioplayer.service';
import * as playerActions from '../actions/media.actions';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import { Platform } from '@ionic/angular';
import { NativeAudiopalyerService } from '../services/native-audiopalyer.service';

@Injectable()
export class MediaPlayerEffect {
    
    resume$ = createEffect(
        () => this.actions.pipe(
            ofType(playerActions.resume),
            tap(() =>{ 
                if(this.hybrid){
                    this.nativeAudioPlayer.resume_native();
                } else {
                    this.audioPlayer.resume();
                }
                this.store.dispatch(playerActions.isPlaying({isPlaying: true}));
            })
    ), {dispatch: false});

    pause$ = createEffect(
        () => this.actions.pipe(
            ofType(playerActions.pause),
            tap(() =>{
                if(this.hybrid){
                    this.nativeAudioPlayer.pause_native();
                } else {
                    this.audioPlayer.pause();
                }
                this.store.dispatch(playerActions.isPlaying({isPlaying: false}));
            })
    ), {dispatch: false});

    skip_fwrd$ = createEffect(
        () => this.actions.pipe(
            ofType(playerActions.skip_fwrd),
            tap(() => {
                if(this.hybrid){
                    this.nativeAudioPlayer.stop_native();
                    this.nativeAudioPlayer.skipForward();
                } else {
                    this.audioPlayer.skipForward();
                }
            })
    ), {dispatch: false});

    skip_bkwrd$ = createEffect(
        () => this.actions.pipe(
            ofType(playerActions.skip_bkwrd),
            tap(() => {
                if(this.hybrid){
                    this.nativeAudioPlayer.stop_native();
                    this.nativeAudioPlayer.skipBackward();
                } else {
                    this.audioPlayer.skipBackward();
                }
            })
    ), {dispatch: false});

    seek$ = createEffect(
        ()=> this.actions.pipe(
            ofType(playerActions.seek),
            tap(payload => {
                if(this.hybrid){
                    this.nativeAudioPlayer.setCurrentTime(payload.time)
                } else {
                    this.audioPlayer.setCurrentTime(payload.time)
                }
            }),
    ), {dispatch: false});

    Duration$ = createEffect(
        ()=> this.actions.pipe(
            ofType(playerActions.get_duration),
            tap(_=> {
                if(this.hybrid){
                    this.store.dispatch( playerActions.set_duration({duration: this.nativeAudioPlayer.getDuration()}));
                } else {
                    this.store.dispatch( playerActions.set_duration({duration: this.audioPlayer.getDuration()}));
                }
            })
    ), {dispatch: false});

    currTime$ = createEffect(
        ()=> this.actions.pipe(
            ofType(playerActions.get_duration),
            tap(async _=>{
                if(this.hybrid){
                    this.store.dispatch( playerActions.set_current_time({currentTime: await this.nativeAudioPlayer.getCurrentTime()}))
                } else {
                    this.store.dispatch( playerActions.set_current_time({currentTime: this.audioPlayer.getCurrentTime()}))
                }
            })
    ), {dispatch: false});

    setTrackList$ = createEffect(
        () => this.actions.pipe(
            ofType(playerActions.set_TrackList),
            tap(({trackList, index}) => {
                if(this.hybrid){
                    this.nativeAudioPlayer.setTrackList(trackList, index);
                } else {
                    this.audioPlayer.setTrackList(trackList, index);
                }
            })
    ), {dispatch: false});

    constructor(
        private actions: Actions,
        private store: Store<AppState>,
        private audioPlayer: AudioplayerService,
        private nativeAudioPlayer: NativeAudiopalyerService,
        private platform: Platform
    ){ }

    get hybrid(){
        return this.platform.is('hybrid');
        //return false;
    }
}