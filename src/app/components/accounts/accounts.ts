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
  currentUser=inject(CurrentUserService);
  operations: OperationInterface[] = JSON.parse(localStorage.getItem('Operations') ?? '[]');
  users: UserInterface[] = JSON.parse(localStorage.getItem('Users') ?? '[]');

  deleteAcc(userToDeleteIndex: number) {

    const userToDelete:UserInterface = this.users[userToDeleteIndex];

    const userToDeleteOperations:OperationInterface[] = this.operations.filter(operation => operation.from === userToDelete.login || operation.to === userToDelete.login);

    for(let i=0; i<userToDeleteOperations.length; i++){
      const from:UserInterface = this.users.find(user => user.login === userToDeleteOperations[i].from)!;
      const to:UserInterface = this.users.find(user => user.login === userToDeleteOperations[i].to)!;
      if(from.login === userToDelete.login){
        to.balance = to.balance - userToDeleteOperations[i].amount;
      }
      else{
        from.balance = from.balance + userToDeleteOperations[i].amount;
      }
    }


    this.users = this.users.filter(user => user !== userToDelete);
    localStorage.setItem('Users', JSON.stringify(this.users));

    this.operations=this.operations.filter(operation => operation.from !== userToDelete.login && operation.to !== userToDelete.login);
    localStorage.setItem("Operations", JSON.stringify(this.operations));
  }
}
