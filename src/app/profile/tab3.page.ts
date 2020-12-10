import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import { UserInterface } from '../models/global.interface';
import { GlobalHttpService } from '../services/global.http.service';
import { PopoverComponent } from './popover/popover.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  user: UserInterface = null;

  constructor(
    private store: Store<AppState>,
    private popoverCtrl: PopoverController,
    private globalService: GlobalHttpService
  ) {}

  ngOnInit(){

    this.store.select('UserState').subscribe(resp =>{
      console.log(resp);
      this.user = resp;
    });
  }

  async openPlaylistForm(){
    const name = await this.globalService.playlistForm();
    console.log(name);
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
