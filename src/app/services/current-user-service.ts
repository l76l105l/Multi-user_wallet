import { UserInterface } from "../interfaces/user-interface";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root',
})
export class CurrentUserService{
  private router=inject(Router);
  private _currentUser:UserInterface={
    firstName:'',
    lastName:'',
    login:'ADMIN',
    balance: 0,
    password:'',
  };
  
  constructor(){
    const storedCurrentUser=localStorage.getItem('CurrentUser');
    if(storedCurrentUser) this._currentUser=JSON.parse(storedCurrentUser);
  }

  set currentUser(value:UserInterface){
    this._currentUser=value;
    localStorage.setItem('CurrentUser',JSON.stringify(this._currentUser));
  }

  get currentUser():UserInterface{
    return this._currentUser;
  }

  quitAccount():void{
    this._currentUser={
      firstName:'',
      lastName:'',
      login:'ADMIN',
      balance: 0,
      password:'',
    }

    localStorage.setItem('CurrentUser', JSON.stringify(this._currentUser));

    this.router.navigate(['/']);
  }
}