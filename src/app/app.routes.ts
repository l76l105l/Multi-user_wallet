import { Routes } from '@angular/router';
import { MainPage } from './components/main-page/main-page';
import { Registration } from './components/registration/registration';
import { Login } from './components/login/login';
import { Operations } from './components/operations/operations';
import { Accounts } from './components/accounts/accounts';
import { Balances } from './components/balances/balances';

export const routes: Routes = [
    {
        path:'',
        component: MainPage,
        title: 'Main page'
    },
    {
        path:'registration',
        component: Registration,
        title:'Registration'
    },
    {
        path: 'login',
        component: Login,
        title: 'Login'
    },
    {
        path: 'operations',
        component: Operations,
        title: 'Operations'
    },
    {
        path: 'accounts',
        component: Accounts,
        title: 'Accounts',
    },
    {
        path: 'accounts/:login',
        component: Accounts,
        title: 'My account',
    },
    {
        path: 'balances',
        component: Balances,
        title: 'Balances',
    }

];
