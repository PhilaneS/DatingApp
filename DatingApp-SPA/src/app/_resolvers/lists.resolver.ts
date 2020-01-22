import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { User } from './../_models/user';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ListsResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 5;
  likesParams = 'Likers';
      constructor(private userService: UserService, private alertfy: AlertifyService, private router: Router) {}
        resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
            return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likesParams ).pipe(
                catchError(error => {
                    this.alertfy.error('Problem retriving data');
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );
        }
}
