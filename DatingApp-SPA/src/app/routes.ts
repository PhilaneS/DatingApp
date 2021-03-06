import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { ListsResolver } from './_resolvers/lists.resolver';
import { User } from './_models/user';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { MemberDetailComponent } from './Members/member-detail/member-detail.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberListComponent } from './Members/member-list/member-list.component';
import { HomeComponent } from './Home/Home.component';
import { Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './Members/member-edit/member-edit.component';
import { PreventUnsavedChanges } from './_guards/privent-unsaved-changes-guard';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children : [
            { path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}},
            { path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}},
            {path: 'member/edit', component: MemberEditComponent,
             resolve: {user: MemberEditResolver},
            canDeactivate : [PreventUnsavedChanges]},
            { path: 'messages', component: MessagesComponent, resolve: {messages : MessagesResolver } },
            { path: 'lists', component: ListComponent, resolve: {User: ListsResolver} },
            { path: 'admin', component: AdminPanelComponent, data: { roles: ['Admin', 'Moderator'] }}
        ]
    },

    { path: '**', redirectTo: '', pathMatch: 'full' }
];
