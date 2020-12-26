import { Component, OnInit } from '@angular/core';
import { userPlaylist } from '../models/global.interface';
import { ApiService } from '../services/Api.service';
import { GlobalHttpService } from '../services/global.http.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  playlists: userPlaylist[] = [];
  url: string;

  constructor(
    global: GlobalHttpService,
    private apiService: ApiService
  ) { 
    this.url = global.baseUrl;
  }

  ngOnInit() {
    this.apiService.getPlaylists().subscribe(resp =>{
      this.playlists = resp;
    });
  }

  doRefresh(event) {
    setTimeout(()=>{
      event.target.complete();
      this.ngOnInit();
    },2000);
  }
}
