import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { LoginResp, LoginUser, RegisterUser, UserInterface } from '../models/global.interface';

export const Login = createAction('[user Actions] Login user', props<{user: LoginUser}>());
export const CreateUser = createAction('[user Actions] Create user', props<{user: RegisterUser}>());
export const LogInUpSuccess = createAction('[user Actions] Login user success', props<{payload: LoginResp}>());
export const GetUser = createAction('[User Actions] get user');
export const GetUserById = createAction('[User Actions] get user by id', props<{id: number}>());
export const GetUserSuccess = createAction('[User Actions] get user Success', props<{user: UserInterface}>());
export const Like = createAction('[User Actions] like track', props<{trackId: any;}>())

export const Error = createAction('[User Actions] Http Error Response', props<{error: HttpErrorResponse}>());
export const BfExit = createAction('[User Actions] Before Exit');