import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalHttpService {

  //public readonly baseUrl = 'https://loteria-maxwell.ddns.net'; //server
  public readonly baseUrl = 'http://192.168.0.109:1337'; //local

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  public handelErrors(error: HttpErrorResponse): Observable<any>{
    this.presentToast(error.message);
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

}
