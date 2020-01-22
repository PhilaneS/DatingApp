import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../_services/user.service';
import { AuthService } from './../_services/auth.service';
import { Pagination, PaginatedResult } from './../_models/Pagination';
import { User } from './../_models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;
  constructor(private authService: AuthService,
              private userservice: UserService,
              private route: ActivatedRoute,
              private artifyService: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['User'].result;
      this.pagination = data['User'].pagination;
    });

    this.likesParam = 'Likers';
  }
  loadUsers() {
    this.userservice.getUsers(this.pagination.currentPage,
      this.pagination.itemsPerPage,
      null,
      this.likesParam).subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.artifyService.error(error);
    });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

}
