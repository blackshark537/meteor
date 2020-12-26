import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalHttpService {

  //public readonly baseUrl = 'https://loteria-maxwell.ddns.net'; //server
  public readonly baseUrl = 'http://192.168.0.109:1337'; //local

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController
  ) { }

  public handelErrors(error: HttpErrorResponse): Observable<any>{
    this.presentToast(error.error.message);
    console.error(error);
    return throwError(error.message);
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    await toast.present();
  }

  async presentAlert(config:{title: string, msg: string}){
    const alert = await this.alertCtrl.create({
      animated: true,
      header: config.title,
      message: config.msg,
      keyboardClose: false,
      backdropDismiss: false
    });

    await alert.present();
    await alert.onWillDismiss();
  }

  async loading(){
    const load = await this.loadCtrl.create({
      animated: true,
      backdropDismiss: false,
      duration: 2000,
      message: 'Por favor espere',
      spinner: 'lines',
      keyboardClose: false,
    });

    await load.present();
    await load.onWillDismiss();
  }

  async playlistForm(){
    const alertForm = await this.alertCtrl.create({
      animated: true,
      header: 'Nueva playlist',
      subHeader: 'nombre de la playlist',
      inputs: [{
        label: 'Nueva playlist',
        cssClass: 'dark',
        type: 'text',
        value: '',
        name: 'playlist',
        placeholder: 'Ejemplo: Rock de los 80'
      }],
      buttons: [{
        text: 'Crear',
        role: 'Cancel'
      }]
    });

    await alertForm.present();
    const {data} = await alertForm.onWillDismiss();
    return data? data.values.playlist : null;
  }
}
