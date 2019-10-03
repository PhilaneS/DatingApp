import { User } from './../_models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({
    authorization: 'Bearer ' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

getUsers(): Observable<User[]> {
  return this.http.get<User[]>(this.baseUrl + 'user', httpOptions);
}
getUser(id: number): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'user/' + id, httpOptions);
}
}