import { Component, inject } from '@angular/core';
import { CurrentUserService } from '../../services/current-user-service';
import { RouterLink } from '@angular/router';
import { UserInterface } from '../../interfaces/user-interface';
import { OperationInterface } from '../../interfaces/operation-interface';

@Component({
  selector: 'app-balances',
  imports: [RouterLink],
  templateUrl: './balances.html',
  styleUrl: './balances.css'
})
export class Balances {

  //CurrentUserService instance to track who is the current user
  currentUser=inject(CurrentUserService);
  //'users' array with all the users. Gets a value from localStorage 'Users' element
  users: UserInterface[] = JSON.parse(localStorage.getItem('Users') ?? '[]');
  //'operations' array with all the operations. Gets a value from localStoage 'Operations' element
  operations: OperationInterface[] = JSON.parse(localStorage.getItem('Operations') ?? '[]');
  //'userOperations' array with all the operations connected with the current user
  userOperations: OperationInterface[] = this.operations.filter(operation => operation.from === this.currentUser.currentUser.login || operation.to === this.currentUser.currentUser.login);
}
