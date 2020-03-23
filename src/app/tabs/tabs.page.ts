import { Component, OnDestroy } from '@angular/core';
import { AudioplayerService } from '../services/audioplayer.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnDestroy{

  timing: Subscription;
  playing: boolean = false;
  constructor(
    audioCtrl: AudioplayerService
  ) {

  }

  ngOnDestroy(){
    this.timing.unsubscribe();
  }

}
