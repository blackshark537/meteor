import { createAction, props } from '@ngrx/store';
import { TrackInterface } from '../models/global.interface';


export const Set_TrackName = createAction('[Media Player] Track Name', props<{trackName: string}>());
export const Set_AlbumImg = createAction('[Media Player] Album Img', props<{AlbumImg: string}>());
export const Set_CurrentTrack = createAction('[Media Player] Current Track', props<{currentTrack: number}>());
export const isPlaying = createAction('[Media Player] is Playing', props<{isPlaying: boolean}>());
export const loading = createAction('[Media Player] Track Loading', props<{loading: boolean}>());
export const repeat = createAction('[Media Player] Track Repeat', props<{repeat: boolean}>());
export const shuffle = createAction('[Media Player] Track Shuffle', props<{shuffle: boolean}>());
export const Set_TrackList = createAction('[Media Player] Track List', props<{TrackList: TrackInterface[]}>());
export const on_Exit = createAction('[Media Player] Closing App');