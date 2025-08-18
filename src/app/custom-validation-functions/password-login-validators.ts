import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { UserInterface } from "../interfaces/user-interface";

//For Registration
export const passwordConfrimValidator = (formGroup:AbstractControl):ValidationErrors|null => {
    return formGroup.get('password')?.value==formGroup.get('passwordConfrim')?.value ? null : {passwordsDoNotMatch:true};
}

export const loginUniqueValidator = (users:UserInterface[]):ValidatorFn => {
    return (formControl: AbstractControl):ValidationErrors|null => {
        return users.find(user=>user.login===formControl.value)? {loginNotUnique:true} : null;
    }
}

//Fro Login
export const loginAndPasswordValidator =(users:UserInterface[]):ValidatorFn => {
    return (formGroup: AbstractControl):ValidationErrors|null => {
        const user=users.find(user=>user.login===formGroup.get('login')?.value);
        if(!user) return {loginNotExist: true};
        return user.password === formGroup.get('password')?.value ? null : {passwordNotMatchLogin: true};
    }
}



