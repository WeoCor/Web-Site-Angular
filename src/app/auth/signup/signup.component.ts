import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.iniTSignupForm();
    }

  iniTSignupForm():void{
    this.signupForm = this.formBuilder.group({
      email: ['',[Validators.email, Validators.required]],
      password: ['',[Validators.required, Validators.minLength(8)]],
      passwordConfirm:['',[Validators.required]],
      cguCheck:[false,[Validators.requiredTrue]]
    })
  }

  onsubmitSignupForm():void{
    this.authService.signupUser(this.signupForm.value.email,this.signupForm.value.password)
    .then(user =>{
      this.router.navigate(['/admin','dashboard']);
    }).catch(console.error);
  }

}
