import { AuthService } from './../_services/auth.service';
import { Message } from './../_models/Message';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 5;
  messageContainer = 'Unread';
      constructor(private userService: UserService, private authService: AuthService,
                  private alertfy: AlertifyService, private router: Router) {}
        resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
            return this.userService.getMessages(this.authService.decodedToken.nameid,
              this.pageNumber, this.pageSize, this.messageContainer).pipe(
                catchError(error => {
                    this.alertfy.error('Problem retriving messages');
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );
        }
}
