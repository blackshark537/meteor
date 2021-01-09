import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../models/app.state';
import { Login, CreateUser } from '../actions/user.actions';
import { GlobalHttpService } from '../services/global.http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userForm: FormGroup;

  private logInUp_toggle = true;

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalHttpService,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      username: null,//[null, [Validators.required, Validators.name]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get pswd(){
    return this.userForm.get('password');
  }

  get confirmPassword(){
    return this.userForm.get('confirmPassword');
  }

  get name(){
    return this.userForm.get('username');
  }

  get email(){
    return this.userForm.get('email');
  }

  get login_valid(){
    return this.email.valid && this.pswd.valid? true : false;
  }

  get form_valid(){
    return this.userForm.valid;
  }

  submit(){
    if(this.logInUp_toggle){
      //login
      this.store.dispatch(Login({user:{
        identifier: this.userForm.get('email').value,
        password: this.userForm.get('password').value
      }}));
      this.wait();
    }else{
      //signin
      this.store.dispatch(CreateUser({user: {
        email: this.userForm.get('email').value,
        password: this.userForm.get('password').value,
        username: this.userForm.get('username').value
      }}));
      this.wait();
      this.showMsg('Por favor inicie session...');
      this.userForm.controls['password'].setValue('');
      this.toggle();
    }
  }

  async wait(){
    await this.globalService.loading();
  }

  async showMsg(msg: string){
    await this.globalService.presentAlert({
      title: 'Atención!!!',
      msg
    });
  }

  toggle(){
    this.logInUp_toggle = !this.logInUp_toggle;
  }

}


export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}