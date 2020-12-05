import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/Api.service';

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
    private apiService: ApiService
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
      this.apiService.login({
        identifier: this.userForm.get('email').value,
        password: this.userForm.get('password').value
      }).subscribe(resp =>{
        console.log('well done! ', resp);
      });
    }else{
      //signin
    }
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