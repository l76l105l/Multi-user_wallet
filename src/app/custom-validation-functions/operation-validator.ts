import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { UserInterface } from "../interfaces/user-interface";
import { CurrentUserService } from "../services/current-user-service";

export const operationValidator = (users:UserInterface[], currentUser: CurrentUserService):ValidatorFn => {
    return (formGroup: AbstractControl): ValidationErrors|null => {
        const loginToTransfer:string|undefined = users.find(user=>user.login===formGroup.get('loginToTransfer')?.value)?.login;
        const amountToTransfer:number = formGroup.get('amountToTransfer')?.value
        if(!loginToTransfer) return {loginToTransferNotExist: true};
        if(loginToTransfer===currentUser.currentUser.login) return {loginToTransferMatchCurrentLogin: true};
        if(amountToTransfer>currentUser.currentUser.balance) return {notSufficientBalace: true};
        if(amountToTransfer===0) return {amountIsZero:true};
        return null;
    }
}