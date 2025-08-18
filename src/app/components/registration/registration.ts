import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserInterface } from '../../interfaces/user-interface';
import { CurrentUserService } from '../../services/current-user-service';
import { passwordConfrimValidator } from '../../custom-validation-functions/password-login-validators';
import { loginUniqueValidator } from '../../custom-validation-functions/password-login-validators';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  private router=inject(Router);
  private formBuilder = inject(FormBuilder);
  private currentUser = inject(CurrentUserService);
  private users: UserInterface[] = localStorage.getItem('Users') ? JSON.parse(localStorage.getItem('Users')!) : [];

  show=signal<boolean>(false);

  profileForm = this.formBuilder.group({

    firstName: ['',{
      validators: [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]*$/)],
    }],

    lastName: ['', {
      validators: [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]*$/)],
    }],

    login: ['', {
      validators: [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]*$/), loginUniqueValidator(this.users)],
    }],

    password: ['',{
      validators:[Validators.required, Validators.minLength(3)],
    }],

    passwordConfrim: ['',{
      validators:[Validators.required],
    },],
    
  },{validators: passwordConfrimValidator});

  createNewUser(){
    this.users.push({
      firstName: this.profileForm.controls.firstName.value!.toLowerCase(),
      lastName: this.profileForm.controls.lastName.value!.toLowerCase(),
      login: this.profileForm.controls.login.value!,
      password: this.profileForm.controls.password.value!,
      balance: Math.floor(Math.random() * 1000001),
    });
    localStorage.setItem('Users', JSON.stringify(this.users));

    this.currentUser.currentUser=this.users[this.users.length-1];

    this.profileForm.reset();

    this.router.navigate(['/']);
  }
}
