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

  //Router instance used for navigating to the main page after login
  private router=inject(Router);
  //FormBuilder instance used to create form fields using FormBuilder API
  private formBuilder=inject(FormBuilder);
  //CurrentUser instance used to track who is the current user
  private currentUser=inject(CurrentUserService);
  //'users' array that contains all the users. Gets value from localStorage 'Users' elements
  private users: UserInterface[] = localStorage.getItem('Users') ? JSON.parse(localStorage.getItem('Users')!) : [];
  //variable used to change the visiability of the password (show the content of the password or no)
  show=signal<boolean>(false);

  //FormGroup and FormControls
  loginForm = this.formBuilder.group({

    login: ['', {
      validators: [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
    }],

    password: ['', {
      validators: [Validators.required],
    }],

  },{validators: [loginAndPasswordValidator(this.users)]});

  //main function, that sets the current user
  getUser():void{
    this.currentUser.currentUser=this.users.find(user=>user.login===this.loginForm.controls.login.value!)!;
    this.router.navigate(['/']);
  }
}
