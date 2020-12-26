import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { AudioplayerService } from '../services/audioplayer.service';
import * as playerActions from '../actions/media.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import { Platform } from '@ionic/angular';
import { NativeAudiopalyerService } from '../services/native-audiopalyer.service';
import { MusicControlService } from '../services/music-control.service';
import { ApiService } from '../services/Api.service';
import { catchError, map, exhaustMap, mergeMap, tap } from 'rxjs/operators';
//import { StorageService } from '../services/storage.service';

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
            tap(async () => {
                if(this.hybrid){
                    await this.store.dispatch(playerActions.isPlaying({isPlaying: false}));
                    await this.store.dispatch(playerActions.set_current_time({currentTime: 0}));
                    await this.nativeAudioPlayer.stop_native();
                    await this.nativeAudioPlayer.release();
                    setTimeout(_=> this.nativeAudioPlayer.skipForward(), 300);
                } else {
                    this.audioPlayer.skipForward();
                }
            })
    ), {dispatch: false});

    skip_bkwrd$ = createEffect(
        () => this.actions.pipe(
            ofType(playerActions.skip_bkwrd),
            tap(async () => {
                if(this.hybrid){
                    await this.store.dispatch(playerActions.isPlaying({isPlaying: false}));
                    await this.store.dispatch(playerActions.set_current_time({currentTime: 0}));
                    await this.nativeAudioPlayer.stop_native();
                    await this.nativeAudioPlayer.release();
                    setTimeout(_=> this.nativeAudioPlayer.skipBackward(), 300);
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

    incPlays$ = createEffect(
        () => this.actions.pipe(
            ofType(playerActions.inc_Plays),
            tap( ({id})=> {
                console.log('id from effect: ',id)
                this.apiService.incPlays(id).subscribe(resp =>{
                    console.log(resp);
                });
            })
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
                    let track = trackList[index];
                    let hasPrev = index > 0? true : false;
                    let hasNext = index < trackList.length-1? true : false;
                    this.audioControls.create(track, hasPrev, hasNext);
                    this.nativeAudioPlayer.release();
                    this.nativeAudioPlayer.setTrackList(trackList, index);
                } else {
                    this.audioPlayer.setTrackList(trackList, index);
                }
            })
    ), {dispatch: false});

    /* onExit$ = createEffect(
        ()=> this.actions.pipe(
            ofType(playerActions.on_Exit),
            tap(_=>{ 
                this.store.select('MediaState').subscribe(state =>{
                    this.Storage.setStorage('state', state);
                }).unsubscribe();
            }),
    ), {dispatch: false}); */

    constructor(
        private actions: Actions,
        private store: Store<AppState>,
        private audioPlayer: AudioplayerService,
        private nativeAudioPlayer: NativeAudiopalyerService,
        private audioControls: MusicControlService,
        private apiService: ApiService,
        //private Storage: StorageService,
        private platform: Platform
    ){ }

    get hybrid(){
        return this.platform.is('hybrid');
        //return false;
    }
}