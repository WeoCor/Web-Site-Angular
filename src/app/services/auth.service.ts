import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
  private auth: AngularFireAuth

  ) { }

  signupUser (email:string,password:string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(email,password)
      .then(user => {
        console.log(user);
        resolve(user);
      }).catch(reject);
    })
  }

signinUser(email:string, password:string): Promise<any>{
  return new Promise((resolve,reject) => {
    this.auth.signInWithEmailAndPassword(email, password).then(resolve).catch(reject)
  })
}



}
