import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private url = `http://localhost:3000/expenses`;
  constructor(private http:HttpClient) { 
    
 
  }
  getExpenses():Observable<any>{
    
    return this.http.get(this.url)
  }
  addExpense(expense: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.url, expense, { headers });
  }
}
