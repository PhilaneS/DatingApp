import { AuthService } from './../_services/auth.service';
import { Directive, OnInit, Input, ViewContainerRef, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
@Input() appHasRole: string[];
isVisible = false;

  constructor(
    private viewcontainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService) { }

    ngOnInit() {
      const userRoles = this.authService.decodedToken.Role as Array<string>;

      if (!userRoles) {
        this.viewcontainerRef.clear();
      }

      if (this.authService.roleMatch(this.appHasRole)) {
        if(!this.isVisible)
        {
          this.isVisible = true;
          this.viewcontainerRef.createEmbeddedView(this.templateRef);
        } else {
          this.isVisible  = false;
          this.viewcontainerRef.clear();
        }
      }
    }
}
