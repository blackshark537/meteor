import { TrackInterface } from './global.interface';

export interface MPState{
    trackName: string;
    AlbumImg: string;
    currentTrack: number;
    loading: boolean;
    isPlaying: boolean;
    trackList: TrackInterface[];
    repeat: boolean;
    shuffle: boolean;
    MediaState?: any;
    duration?: number;
    currentTime?: number;
}