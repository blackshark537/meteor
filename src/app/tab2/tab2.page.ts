import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  percent: number = 0;
  isPlaying: boolean = false;
  timer = null;
  constructor() {}

  ngOnInit(){

  }

  play(){
    if(!this.isPlaying){
      this.timer = setInterval(()=>{
        this.percent === 100? clearInterval(this.timer) : this.percent++;
      }, 1000);
      this.isPlaying = !this.isPlaying;
    } else {
      clearInterval(this.timer)
      this.isPlaying = !this.isPlaying;
    }
  }

}
