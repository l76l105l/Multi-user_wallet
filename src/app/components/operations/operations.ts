import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserInterface } from '../../interfaces/user-interface';
import { OperationInterface } from '../../interfaces/operation-interface';
import { CurrentUserService } from '../../services/current-user-service';
import { operationValidator} from '../../custom-validation-functions/operation-validator';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-operations',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './operations.html',
  styleUrl: './operations.css'
})
export class Operations {
  currentUser=inject(CurrentUserService);
  operations: OperationInterface[] = JSON.parse(localStorage.getItem('Operations') ?? '[]');
  userOperations: OperationInterface[] = this.operations.filter(operation => operation.from === this.currentUser.currentUser.login || operation.to === this.currentUser.currentUser.login);
  private formBuilder=inject(FormBuilder);
  private users: UserInterface[] = JSON.parse(localStorage.getItem('Users') ?? '[]');

  operationForm=this.formBuilder.group({
    loginToTransfer: ['',{
      validators:[Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
    }],

    amountToTransfer: [null,{
      validators:[Validators.required],
    }],

  },{validators: [operationValidator(this.users , this.currentUser)]});

  transfer(){
    this.operations.push({
      from: this.currentUser.currentUser.login,
      to: this.operationForm.controls.loginToTransfer.value!,
      amount: Number(this.operationForm.controls.amountToTransfer.value),
      dateTime: new Date().toLocaleString(),
    });
    this.userOperations.push(this.operations[this.operations.length-1]);

    localStorage.setItem('Operations', JSON.stringify(this.operations));

    this.currentUser.currentUser={
      ...this.currentUser.currentUser,
      balance: this.currentUser.currentUser.balance-Number(this.operationForm.controls.amountToTransfer.value),
    };

    const userFrom = this.users.find(user=>user.login === this.currentUser.currentUser.login)!;
    userFrom.balance=this.currentUser.currentUser.balance;

    const userTo = this.users.find(user=>user.login === this.operationForm.controls.loginToTransfer.value)!;
    userTo.balance = userTo.balance + Number(this.operationForm.controls.amountToTransfer.value);

    this.operationForm.reset();

    localStorage.setItem('Users',JSON.stringify(this.users));
  }

  deleteOp(index: number){
    const opToDelete:OperationInterface = this.operations[index];

    this.operations=this.operations.filter(operation=>operation !== opToDelete);
    this.userOperations = this.userOperations.filter(operation => operation !== opToDelete);
    
    localStorage.setItem('Operations', JSON.stringify(this.operations));

    const fromUser:UserInterface = this.users.find(user=>user.login === opToDelete.from)!;
    fromUser.balance = fromUser.balance + opToDelete.amount;

    const toUser:UserInterface = this.users.find(user => user.login === opToDelete.to)!;
    toUser.balance = toUser.balance - opToDelete.amount;

    if(this.currentUser.currentUser.login === opToDelete.from){
      this.currentUser.currentUser = fromUser;
    }
    else if(this.currentUser.currentUser.login === opToDelete.to){
      this.currentUser.currentUser = toUser;
    }
    localStorage.setItem('Users', JSON.stringify(this.users));
  }

}

