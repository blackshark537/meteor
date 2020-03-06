import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Api.service';
import { CategoryInteface } from '../global.interface';
import { GlobalHttpService } from '../global.http.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  url: string = '';
  categories: CategoryInteface[] = []

  sliderConfig = {
    spaceBetween: 0,
    centeredSlides: false,
    slidesPerView: 2.3
  };

  constructor(
    private ApiService: ApiService,
    private toastController: ToastController,
    public httpConfg: GlobalHttpService,
  ) {
    
  }

  ngOnInit(){
    /* this.checkWindow();
    addEventListener('resize', (e)=>{
      e.preventDefault();
      this.checkWindow();
    }) */
    
    this.ApiService.getCategories('').subscribe(resp =>{
      this.categories = resp.docs;
    }, error => this.presentToast(error));  
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
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
      categories = resp.docs;
      setTimeout(()=>{
        event.target.complete();
        this.categories = categories
      }, 2000)
    }, error => this.presentToast(error));
  }
  

}
