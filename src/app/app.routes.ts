import { Routes } from '@angular/router';
import { AddExpensesComponent } from './expenses/addExpenses/addExpenses.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';

export const routes: Routes = [
    {path:"",component:DashboardComponent}
];
