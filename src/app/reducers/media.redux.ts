import { createReducer, on, Action, State} from '@ngrx/store';
import * as actions from '../actions/media.actions';
import { AppState } from '../models/app.state';

const initial_state: AppState = {
    AlbumImg: '',
    currentTrack: 0,
    isPlaying: false,
    trackList: [],
    trackName: '',
    loading: false,
    repeat: false,
    shuffle: false
}

const load_state: AppState = JSON.parse(localStorage.getItem('state')) || initial_state;

const mediaReducer = createReducer(load_state, 
        on(actions.Set_AlbumImg, (state, {AlbumImg}) => ({...state, AlbumImg})),
        on(actions.Set_CurrentTrack, (state, {currentTrack}) =>({...state, currentTrack})),
        on(actions.Set_TrackName, (state, {trackName})=> ({...state, trackName})),
        on(actions.isPlaying, (state, {isPlaying}) => ({...state, isPlaying})),
        on(actions.repeat, (state, {repeat}) => ({...state, repeat})),
        on(actions.shuffle, (state, {shuffle}) => ({...state, shuffle})),
        on(actions.loading, (state, {loading})=>({...state, loading})),
        on(actions.Set_TrackList, (state, {TrackList})=> ({...state, trackList: TrackList})),
        on(actions.on_Exit, state => {
            localStorage.setItem('state', JSON.stringify(({...state, isPlaying: false})));
            return state;
        })
    );

export function MediaReducer(state: AppState, actions: Action){
    return mediaReducer(state, actions);
}
