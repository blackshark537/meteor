import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { Storage } = Plugins

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private platform: Platform
  ) { }

  setStorage(key: string, value: any){
    if(this.platform.is('hybrid')){
      Storage.set({
        key,
        value
      });
    } else {
      localStorage.setItem(key, value);
    }
  }

  getStorage(key: string): string{
    let val: string;
    if(this.platform.is('hybrid')){
      Storage.get({ key}).then(result => {
        val = result.value;
      });
    } else {
        val = localStorage.getItem(key)
    }
    return val
  }

}
