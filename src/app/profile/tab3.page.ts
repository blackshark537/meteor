import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import { UserInterface } from '../models/global.interface';
import { GlobalHttpService } from '../services/global.http.service';
import { PopoverComponent } from './popover/popover.component';
import * as _userActions from '../actions/user.actions';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  user: UserInterface = null;
  url: string;
  constructor(
    private store: Store<AppState>,
    private popoverCtrl: PopoverController,
    private globalService: GlobalHttpService
  ) {
    this.url = globalService.baseUrl;
  }

  ngOnInit(){

    this.store.select('UserState').subscribe(resp =>{
      this.user = resp;
    });
  }

  async openPlaylistForm(){
    const name: string = await this.globalService.playlistForm();
    this.store.dispatch(_userActions.CreatePlayist({nombre: name}));
  }

  deletePlaylist(id){
    this.store.dispatch(_userActions.deletePlaylist({id}));
  }

  async openPopOver(ev: any){
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      animated: true,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: true,
      event: ev,
    });

    await popover.present();
  }
}
