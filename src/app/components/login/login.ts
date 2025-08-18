import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CurrentUserService } from '../../services/current-user-service';
import { UserInterface } from '../../interfaces/user-interface';
import { loginAndPasswordValidator } from '../../custom-validation-functions/password-login-validators';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router=inject(Router);
  private formBuilder=inject(FormBuilder);
  private currentUser=inject(CurrentUserService);
  private users: UserInterface[] = localStorage.getItem('Users') ? JSON.parse(localStorage.getItem('Users')!) : [];

  show=signal<boolean>(false);

  loginForm = this.formBuilder.group({

    login: ['', {
      validators: [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
    }],

    password: ['', {
      validators: [Validators.required],
    }],

  },{validators: [loginAndPasswordValidator(this.users)]});

  getUser():void{
    this.currentUser.currentUser=this.users.find(user=>user.login===this.loginForm.controls.login.value!)!;
    this.router.navigate(['/']);
  }
}
