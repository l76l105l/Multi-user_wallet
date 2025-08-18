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
  currentUser=inject(CurrentUserService);
  users: UserInterface[] = JSON.parse(localStorage.getItem('Users') ?? '[]');
  operations: OperationInterface[] = JSON.parse(localStorage.getItem('Operations') ?? '[]');
  userOperations: OperationInterface[] = this.operations.filter(operation => operation.from === this.currentUser.currentUser.login || operation.to === this.currentUser.currentUser.login);
}
