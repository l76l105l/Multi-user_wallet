import { Component, inject } from '@angular/core';
import { CurrentUserService } from '../../services/current-user-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [RouterLink],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {
  //CurrentUserService instance used to track who is the current user
  currentUser=inject(CurrentUserService);
}
