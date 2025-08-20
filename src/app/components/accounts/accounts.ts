import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrentUserService } from '../../services/current-user-service';
import { UserInterface } from '../../interfaces/user-interface';
import { OperationInterface } from '../../interfaces/operation-interface';

@Component({
  selector: 'app-accounts',
  imports: [RouterLink],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class Accounts {
  //instance of CurrentUserService
  currentUser=inject(CurrentUserService);
  //'operations' array that stores all the operations
  operations: OperationInterface[] = JSON.parse(localStorage.getItem('Operations') ?? '[]');
  //'users' array that stores all the users
  users: UserInterface[] = JSON.parse(localStorage.getItem('Users') ?? '[]');

  //function to delete an account by index
  deleteAcc(userToDeleteIndex: number) {

    //contains the reference to the user we need to delete from the'users' array 
    const userToDelete:UserInterface = this.users[userToDeleteIndex];

    //contains filtered list of operations  (without operations connected with 'userToDelete')
    const filteredOperations: OperationInterface[] = [];

    //contains all the operations connected with 'userToDelete'
    const userToDeleteOperations:OperationInterface[] = [];

    for(const operation of this.operations) {
      if(operation.from === userToDelete.login || operation.to === userToDelete.login){
         userToDeleteOperations.push(operation);
      }
      else{
        filteredOperations.push(operation);
      }
    };
    this.operations = filteredOperations;
    localStorage.setItem("Operations", JSON.stringify(this.operations));


      for(const userToDeleteOperation of userToDeleteOperations){
        let from: UserInterface|undefined;
        let to: UserInterface|undefined;
        for(const user of this.users){          
          if(user.login === userToDeleteOperation.from) from = user;
          else if(user.login === userToDeleteOperation.to) to = user;
          if(from && to) break;
        }
  
        if(!from || !to) continue;
  
        //if the operation was from the user we need to delete
        if(from.login === userToDelete.login){
          //we take the reciever and decrease its balance back
          to.balance = to.balance - userToDeleteOperation.amount;
        }
        //if the operation was to the user we want to delete
        else if(to.login === userToDelete.login){
          //we take the sender and increase its balance back
          from.balance = from.balance + userToDeleteOperation.amount;
        }
    }

    this.users = this.users.filter(user=>user !== userToDelete);
    localStorage.setItem('Users', JSON.stringify(this.users));
  }
}
