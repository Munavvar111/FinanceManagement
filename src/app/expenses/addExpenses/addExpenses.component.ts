import { AsyncPipe } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ApiServiceService } from '../../api-service.service';


@Component({
  selector: 'app-addExpenses',
  standalone:true,
  providers: [provideNativeDateAdapter()],
  imports: [RouterOutlet,MatInputModule,MatFormFieldModule,MatDatepickerModule,MatAutocompleteModule,ReactiveFormsModule,AsyncPipe,CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './addExpenses.component.html',
  styleUrls: ['./addExpenses.component.css']
})
export class AddExpensesComponent implements OnInit {
  expenseForm: FormGroup;
    myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  constructor(private fb: FormBuilder,private apiService:ApiServiceService) {
    this.expenseForm = this.fb.group({
      date: [''],
      account: [''],
      expenses: this.fb.array([]),
      totalAmount: [{value: 0, disabled: true}]
    });
    this.myControl = this.expenseForm.get('account') as FormControl;
  }
  

  expenses():FormArray{
    return this.expenseForm.get('expenses') as FormArray;
  }

  newExpense():FormGroup{
    return this.fb.group({
      category:['',Validators.required],
      amount:['',Validators.required]
    });
  }
  addExpense(){
    this.expenses().push(this.newExpense())
  }

  removeExpense(i: number) {
      this.expenses().removeAt(i);
     }
     

  ngOnInit() {
   
    this.addExpense();
    this.expenseForm.get("expenses").valueChanges.subscribe(()=>{
      this.updateTotalAmount();
    })
    this.apiService.getExpenses().subscribe({
      next:(data:any)=>{
        console.log(data)
      }
    })
  }

  onSubmit() {
    const formattedData = {
      date: new Date(this.expenseForm.get('date').value).toISOString(),
      account: this.expenseForm.get('account').value,
      expenses: this.expenseForm.get('expenses').value.map((expense: any) => ({
        category: expense.category,
        amount: Number(expense.amount)
      }))
    };

    this.apiService.addExpense(formattedData).subscribe({
      next: (response: any) => {
        console.log('Expense added:', response);
      },
      error: (error: any) => {
        console.error('Error adding expense:', error);
      }
    });  }
  updateTotalAmount() {
    const expensesArray = this.expenseForm.get('expenses') as FormArray;
    console.log(expensesArray.controls)
    const total = expensesArray.controls.reduce((acc, control) => acc + control.get('amount').value, 0);
    this.expenseForm.get('totalAmount').setValue(total);
  }
}
