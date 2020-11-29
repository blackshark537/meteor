import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/Api.service';
import { Categories } from '../models/global.interface';
import { ToastController } from '@ionic/angular';
import { GlobalHttpService } from '../services/global.http.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  url: string = '';
  categories: Categories[] = []

  sliderConfig = {
    spaceBetween: 0,
    centeredSlides: false,
    slidesPerView: 3
  };

  constructor(
    public global: GlobalHttpService,
    private ApiService: ApiService
  ) {
    this.url = global.baseUrl;
  }

  ngOnInit(){
    this.checkWindow();
    addEventListener('resize', (e)=>{
      e.preventDefault();
      this.checkWindow();
    })
    
    this.ApiService.getCategories('').subscribe(resp =>{
      this.categories = resp;
    });
  }

  checkWindow(){
    if(window.screen.width < 600){
      this.sliderConfig = {
        spaceBetween: 1,
        centeredSlides: true,
        slidesPerView: 1.6
      }
    } else if(window.screen.width < 900){
      this.sliderConfig = {
        spaceBetween: 0.5,
        centeredSlides: false,
        slidesPerView: 3
      }
    } else if(window.screen.width < 1050){
      this.sliderConfig = {
        spaceBetween: 0.5,
        centeredSlides: false,
        slidesPerView: 4
      }
    } else {
      this.sliderConfig = {
        spaceBetween: 0.5,
        centeredSlides: false,
        slidesPerView: 6
      }
    }
  }

  doRefresh(event) {
    let categories = [];
    this.ApiService.getCategories('').subscribe(resp =>{
      categories = resp;
      setTimeout(()=>{
        event.target.complete();
        this.categories = categories
      }, 2000)
    });
  }
  

}
