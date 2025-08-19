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

    //contains all the operations connected with this user
    const userToDeleteOperations:OperationInterface[] = this.operations.filter(operation => operation.from === userToDelete.login || operation.to === userToDelete.login);

    //goes through of each userToDeleteOpearations ot change the balance of the sender or receiver
    for(let i=0; i<userToDeleteOperations.length; i++){
      //'from' stores the reference to the user who initiated the transition
      const from:UserInterface = this.users.find(user => user.login === userToDeleteOperations[i].from)!;
      //'to' stores the reference to the user who received the transition
      const to:UserInterface = this.users.find(user => user.login === userToDeleteOperations[i].to)!;
      //if the operation was from the user we need to delete
      if(from.login === userToDelete.login){
        //we take the reciever and decrease its balance back
        to.balance = to.balance - userToDeleteOperations[i].amount;
      }
      //if the operation was to the user we want to delete
      else if(to.login === userToDelete.login){
        //we take the sender and increase its balance back
        from.balance = from.balance + userToDeleteOperations[i].amount;
      }
    }


    //removing the user we need to delete from 'users' array by filtering
    this.users = this.users.filter(user => user !== userToDelete);
    //after modifying the 'users' array and its elements we update the 'Users' element in localStorage
    localStorage.setItem('Users', JSON.stringify(this.users));

    //removing all operations connected with the deleted user from the 'operations' array by filtering
    this.operations=this.operations.filter(operation => operation.from !== userToDelete.login && operation.to !== userToDelete.login);
    //after modifying the 'operations' array we update the 'Operations' element in localStorage
    localStorage.setItem("Operations", JSON.stringify(this.operations));
  }
}
