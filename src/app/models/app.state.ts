import { UserInterface } from './global.interface';
import { MPState } from './mp.state';

export interface AppState{
    MediaState?: MPState;
    UserState?: UserInterface
}