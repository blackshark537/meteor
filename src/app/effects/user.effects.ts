import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, tap, exhaustMap, map, mergeMap } from 'rxjs/operators';
import * as user_Action from '../actions/user.actions';
import { ApiService } from '../services/Api.service';

@Injectable()
export class UserEffect {

    login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(user_Action.Login),
      exhaustMap(payload => this.apiService.login(payload.user).pipe(
          map(user => user_Action.LogInUpSuccess({payload: user})),
          catchError(error => of(user_Action.Error({error})))
      ))
    ));

    create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(user_Action.CreateUser),
      exhaustMap(payload => this.apiService.create_user(payload.user).pipe(
          catchError(error => of(user_Action.Error({error})))
      ))
    ), {dispatch: false});

    Me$ = createEffect(()=>
    this.actions$.pipe(
      ofType(user_Action.GetUser),
      mergeMap( () => 
        this.apiService.Me().pipe(
          map(resp => user_Action.GetUserById({id: resp.id})),
          catchError(error => of(user_Action.Error({error})))
      ))
    ));

    userById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(user_Action.GetUserById),
      exhaustMap( ({ id }) => this.apiService.getUserById(id).pipe(
        map(resp => user_Action.GetUserSuccess({user: resp})),
        catchError(error => of(user_Action.Error({error})))
      ))
    ));

    like$ = createEffect(() =>
    this.actions$.pipe(
      ofType(user_Action.Like),
      exhaustMap(payload => this.apiService.like(payload.trackId).pipe(
        map(resp => user_Action.GetUser()),
        catchError(error => of(user_Action.Error({error})))
      ))
    ));

    createPlaylist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(user_Action.CreatePlayist),
      exhaustMap(payload => this.apiService.createPlaylist(payload.nombre).pipe(
        map(resp => user_Action.GetUser()),
        catchError(error => of(user_Action.Error({error})))
      ))
    ));

    addToPlaylist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(user_Action.addToPlaylist),
      exhaustMap(({playlistId, trackId}) => this.apiService.addToPlaylist({listId:playlistId, trackId }).pipe(
        map(resp => user_Action.GetUser()),
        catchError(error => of(user_Action.Error({error})))
      ))
    ));

    deletePlaylist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(user_Action.deletePlaylist),
      exhaustMap(({id}) => this.apiService.deletePlaylist(id).pipe(
        map(resp => user_Action.GetUser()),
        catchError(error => of(user_Action.Error({error})))
      ))
    ));

    constructor(
        private actions$: Actions,
        private apiService: ApiService
    ){}
}