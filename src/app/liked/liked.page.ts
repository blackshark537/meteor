import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import { Track, TrackInterface } from '../models/global.interface';
import { GlobalHttpService } from '../services/global.http.service';
import * as _Actions from '../actions/media.actions';
import { MediaPlayerPage } from '../media-player/media-player.page';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-liked',
  templateUrl: './liked.page.html',
  styleUrls: ['./liked.page.scss'],
})
export class LikedPage implements OnInit {

  TrackList: Track[] = [];

  constructor(
    private store:Store<AppState>
  ) { 
  }

  ngOnInit() {
    this.store.select('UserState').pipe(
      map(resp => resp['likes'])
    ).subscribe(resp =>{
      this.TrackList = resp;
    });
  }

}
