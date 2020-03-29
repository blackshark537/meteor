import { TrackInterface } from './global.interface';

export interface AppState{
    trackName: string;
    AlbumImg: string;
    currentTrack: number;
    loading: boolean;
    isPlaying: boolean;
    trackList: TrackInterface[];
    repeat: boolean;
    shuffle: boolean;
    MediaState?: any;
}