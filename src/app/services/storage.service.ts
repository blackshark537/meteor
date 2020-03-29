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

  setTrackName(Name: string){
    this.setStorage('trackName', Name);
  }

  getTrackName(): string{
    return this.getStorage('trackName');
  }

  setAlbumImg(imgUri: string){
    this.setStorage('albumImg', imgUri);
  }

  getAlbumImg(): string{
    return this.getStorage('albumImg');
  }

  setCurrentTrack(trackUri: string){
    this.setStorage('currentTrack', trackUri);
  }

  getCurrentTrack(): string{
    return this.getStorage('currentTrack');
  }

  private setStorage(key: string, value: any){
    if(this.platform.is('hybrid')){
      Storage.set({
        key,
        value
      });
    } else {
      localStorage.setItem(key, value);
    }
  }

  private getStorage(key: string): string{
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
