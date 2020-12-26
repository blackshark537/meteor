import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(
    private popoverCtrl: PopoverController,
    private router: Router
  ) { }

  ngOnInit() {}

  async exit(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    await this.popoverCtrl.dismiss();
    this.router.navigate(['login']);
  }
}
