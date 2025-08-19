import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { UserInterface } from '../../interfaces/user-interface';
import { OperationInterface } from '../../interfaces/operation-interface';
import { CurrentUserService } from '../../services/current-user-service';
import { operationValidator} from '../../custom-validation-functions/operation-validator';
import { RouterLink } from '@angular/router';
import { FilteredOperations } from './filteredOperations';


@Component({
  selector: 'app-operations',
  imports: [ReactiveFormsModule, RouterLink, FormsModule, FilteredOperations],
  templateUrl: './operations.html',
  styleUrl: './operations.css'
})
export class Operations {
  //CurrentUserService instance used to track who is the current user
  currentUser=inject(CurrentUserService);
  //'operations' array used to stored all the operations
  operations: OperationInterface[] = JSON.parse(localStorage.getItem('Operations') ?? '[]');
  //'userOperations' used to store all the operations connected with the current user
  userOperations: OperationInterface[] = this.operations.filter(operation => operation.from === this.currentUser.currentUser.login || operation.to === this.currentUser.currentUser.login);
  //'filteredOperations' used to store operations that we need to find
  filteredOperations: OperationInterface[] = [...this.operations];
  //FromBuilder insctance used to create the form inputs
  private formBuilder=inject(FormBuilder);
  //FormBuilder instance used to create form fields using FormBuilder API
  private users: UserInterface[] = JSON.parse(localStorage.getItem('Users') ?? '[]');

  //FormGroup and FormControls
  operationForm=this.formBuilder.group({
    loginToTransfer: ['',{
      validators:[Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
    }],

    amountToTransfer: [null,{
      validators:[Validators.required],
    }],

  },{validators: [operationValidator(this.users , this.currentUser)]});

  loginSearch:string='';
  fromSearch:number|null=null;
  toSearch:number|null=null;

  //method to transfer some amount to another user
  transfer(){
    //pushes the new operation to the 'operations' arrya
    this.operations.push({
      from: this.currentUser.currentUser.login,
      to: this.operationForm.controls.loginToTransfer.value!,
      amount: Number(this.operationForm.controls.amountToTransfer.value),
      dateTime: new Date().toLocaleString(),
    });
    //pushes the last operation in 'operations' array to the 'userOperations' array
    this.userOperations.push(this.operations[this.operations.length-1]);

    //updates 'Operations' in localStorage
    localStorage.setItem('Operations', JSON.stringify(this.operations));

    //updates the value of the current user (user who initiated the operation)
    this.currentUser.currentUser={
      ...this.currentUser.currentUser,
      balance: this.currentUser.currentUser.balance-Number(this.operationForm.controls.amountToTransfer.value),
    };

    //updates the balance of the user who initiated the operatons in 'users' array
    const userFrom = this.users.find(user=>user.login === this.currentUser.currentUser.login)!;
    userFrom.balance=this.currentUser.currentUser.balance;

    //updates the balance of the receiver in 'users' array
    const userTo = this.users.find(user=>user.login === this.operationForm.controls.loginToTransfer.value)!;
    userTo.balance = userTo.balance + Number(this.operationForm.controls.amountToTransfer.value);

    //clears all the fields in the form input
    this.operationForm.reset();

    //updates the 'Users' element value in localStorage
    localStorage.setItem('Users',JSON.stringify(this.users));
  }

  //method to delete operation by its index
  deleteOp(index: number){
    //opToDelete contains the reference in the 'operations' array to the operation we need to delete 
    const opToDelete:OperationInterface = this.operations[index];

    //updating the value of the 'operations' array by filteing it. Removing the operation we need to delete 
    this.operations=this.operations.filter(operation=>operation !== opToDelete);
    //updating the value of the 'userOperations' array by filtering it. Removing the operation we need to delete.
    this.userOperations = this.userOperations.filter(operation => operation !== opToDelete);

    //updating the value of the 'Operations' element in the localStorage
    localStorage.setItem('Operations', JSON.stringify(this.operations));

    //fromUser contains the reference to the user who initiated the opeartion
    const fromUser:UserInterface = this.users.find(user=>user.login === opToDelete.from)!;
    //changing the balance of the fromUser. Increasing its balance
    fromUser.balance = fromUser.balance + opToDelete.amount;

    //toUser contains the reference to the user-receiver
    const toUser:UserInterface = this.users.find(user => user.login === opToDelete.to)!;
    //changing the balance of the toUser. Decreasing its balance
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

