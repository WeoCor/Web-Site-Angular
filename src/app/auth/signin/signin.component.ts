import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm!: FormGroup;

  constructor(
    private formBuilder:FormBuilder,
    private authservices: AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.initSigninForm();
  }

  initSigninForm(): void {
  this.signinForm = this.formBuilder.group({
    email: ['',[Validators.email,Validators.required]],
    password: ['',[Validators.required]]
  })
  }

  onsubmitSigninForm():void {
 this.authservices.signinUser(this.signinForm.value.email,this.signinForm.value.password)
 .then(() => {
   this.router.navigate(['/admin','dashboard'])
 }).catch(console.error);
  }

}
