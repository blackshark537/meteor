import { TrackInterface } from './global.interface';

export interface MPState{
    trackName: string;
    loading: boolean;
    progress: number;
    duration: number;
    albumImg: string;
    trackIndex: number;
    trackList: TrackInterface[];
    playing: boolean;
    pause: boolean;
    play: boolean;
    skipF: boolean;
    skipB: boolean;
    seek: number;
}