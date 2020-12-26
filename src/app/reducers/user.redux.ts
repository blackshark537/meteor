import { createReducer, on, Action} from '@ngrx/store';
import * as _Actions from '../actions/user.actions';
import { UserInterface } from '../models/global.interface';


const user_state: UserInterface = JSON.parse(localStorage.getItem('user')) || {
    playlists: [],
    likes: [],
    blocked: false,
    confirmed: false,
    created_at: null,
    email: null,
    id: null,
    provider: null,
    role: null,
    updated_at: null,
    username: ''
};

const userReducer = createReducer(user_state, 
    on(_Actions.LogInUpSuccess, (state, {payload}) => {
        localStorage.setItem('token', payload.jwt);
        localStorage.setItem('user', JSON.stringify(payload.user));
        window.location.href = '/#/tabs/tab3';
        return payload.user;
    }),
    on(_Actions.GetUserSuccess, (state, {user}) => ({...user})),
    on(_Actions.BfExit, state => {
        localStorage.setItem('user', JSON.stringify(state));
        return state;
    })
);

export function UserReducer(state: UserInterface, actions: Action){
    return userReducer(state, actions);
}