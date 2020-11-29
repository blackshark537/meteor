import { createAction, props } from '@ngrx/store';
import { TrackInterface } from '../models/global.interface';

export const play_pause_toggle = createAction('[Media Player] play-pause toggle')
export const resume = createAction('[Media Player] resume')
export const pause = createAction('[Media Player] pause')
export const skip_fwrd = createAction('[Media Player] skip forward')
export const skip_bkwrd = createAction('[Media Player] skip backward')
export const seek = createAction('[Media Player] seek', props<{time: number}>())
export const set_TrackList = createAction('[Media Player] set TrackList', props<{trackList: TrackInterface[], index: number}>())

export const OK = createAction('[Media Player] ok');

export const get_duration = createAction('[Media Player] get Duration');
export const get_current_time = createAction('[Media Player] get Current Time');
export const set_duration = createAction('[Media Player] set Duration', props<{duration: number}>());
export const set_current_time = createAction('[Media Player] set Current Time', props<{currentTime: number}>());

export const Set_TrackName = createAction('[Media Player] Track Name', props<{trackName: string}>());
export const Set_AlbumImg = createAction('[Media Player] Album Img', props<{AlbumImg: string}>());
export const Set_CurrentTrack = createAction('[Media Player] Current Track', props<{currentTrack: number}>());
export const isPlaying = createAction('[Media Player] is Playing', props<{isPlaying: boolean}>());
export const loading = createAction('[Media Player] Track Loading', props<{loading: boolean}>());
export const repeat = createAction('[Media Player] Track Repeat', props<{repeat: boolean}>());
export const shuffle = createAction('[Media Player] Track Shuffle', props<{shuffle: boolean}>());
export const on_Exit = createAction('[Media Player] Closing App');