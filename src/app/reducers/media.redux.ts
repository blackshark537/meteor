import { createReducer, on, Action} from '@ngrx/store';
import * as actions from '../actions/media.actions';
import { MPState } from '../models/mp.state';

const initial_state: MPState  = {
    AlbumImg: '',
    currentTrack: 0,
    isPlaying: false,
    trackList: [],
    trackName: '',
    loading: false,
    repeat: false,
    shuffle: false,
    duration: 0,
    currentTime: 0
};

const load_state: MPState = JSON.parse(localStorage.getItem('state')) || initial_state;

const mediaReducer = createReducer(load_state, 
        on(actions.Set_AlbumImg, (state, {AlbumImg}) => ({...state, AlbumImg})),
        on(actions.Set_CurrentTrack, (state, {currentTrack}) =>({...state, currentTrack})),
        on(actions.Set_TrackName, (state, {trackName})=> ({...state, trackName})),
        on(actions.isPlaying, (state, {isPlaying}) => {
            let new_state = {...state};
            new_state.loading = false;
            new_state.isPlaying = isPlaying;
            console.log('playing...', isPlaying);
            return new_state;
        }),
        on(actions.repeat, (state, {repeat}) => ({...state, repeat})),
        on(actions.shuffle, (state, {shuffle}) => ({...state, shuffle})),
        on(actions.loading, (state, {loading})=>({...state, loading})),
        on(actions.set_TrackList, (state, {trackList, index})=> {
            let new_state = {...state};
            new_state.trackList = [...trackList];
            new_state.currentTrack = index;
            return new_state;
        }),
        on(actions.on_Exit, state => {
            localStorage.setItem('state', JSON.stringify(({...state, isPlaying: false})));
            return state;
        }),
        on(actions.set_duration, (state, {duration})=> {
            let new_state = {...state}
            new_state.duration = duration;
            return new_state;
        }),
        on(actions.set_current_time, (state, {currentTime})=> {
            let new_state = {...state}
            if(currentTime >= 1){
                new_state.currentTime = currentTime;
            }
            return new_state;
        }),
        on(actions.OK, state => state)
    );

export function MediaReducer(state: MPState, actions: Action){
    return mediaReducer(state, actions);
}
