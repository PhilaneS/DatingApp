import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from './../../_services/auth.service';
import { UserService } from './../../_services/user.service';
import { Message } from './../../_models/Message';
import { Component, OnInit, Input } from '@angular/core';
import { pipe } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  constructor(private userService: UserService,
              private authService: AuthService, private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }
loadMessages() {
  const currentUserId = +this.authService.decodedToken.nameid;
  this.userService.getMessageThred(this.authService.decodedToken.nameid, this.recipientId)
  .pipe(
    tap(messages => {

      for (const message of messages) {
        if ( message.isRead === false && message.recipientId === currentUserId) {
          this.userService.markAsRead(currentUserId, message.id);
        }
      }
    })
  )
  .subscribe(messages => {
    this.messages = messages;
  }, error => {
    this.alertifyService.error(error);
  });
}
sendMessage() {
  this.newMessage.recipientId = this.recipientId;
  this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
  .subscribe((message: Message) => {
    this.messages.unshift(message);
    this.newMessage.content = '';
  }, error => {
    this.alertifyService.error(error);
  });
}
}
