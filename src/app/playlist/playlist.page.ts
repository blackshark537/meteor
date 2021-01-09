import { Component, OnInit } from '@angular/core';
import { Track } from '../models/global.interface';
import { GlobalHttpService } from '../services/global.http.service';
import { ApiService } from '../services/Api.service';
import { ActivatedRoute} from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage implements OnInit {

  TrackList: Track[] = [];
  url: string;
  name: string = '';
  listId;
  fromProfile$: Subject<boolean> = new BehaviorSubject(false);

  constructor(
    private global: GlobalHttpService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    
  ) { 
    this.url = this.global.baseUrl;
  }

  ngOnInit() {
    this.listId = this.activatedRoute.snapshot.paramMap.get('id');
    
    const Profile = this.activatedRoute.snapshot.paramMap.get('profile') == 'true'? true : false;
    this.fromProfile$.next(Profile);

    this.apiService.getPlaylist(this.listId).subscribe(resp =>{
      this.name = resp.nombre;
      this.TrackList = resp.canciones;
    });
  }

}
