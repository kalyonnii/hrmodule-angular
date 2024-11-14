import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showSidebar: any = false;
  sidebarVisible: boolean = false;
  userDetails: any;
  userRoles: any = [];
  searchFilter: any = {};
  businessNameToSearch: any;
  currentTableEvent: any;
  loading: any;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = this.userDetails.user;
  }
  userLogout() {
    this.authService
      .doLogout()
      .then(() => {
        this.toastService.showSuccess('Logout Successful');
        this.localStorageService.clearAllFromLocalStorage();
        this.router.navigate(['user', 'login']);
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }

  showSidebarMenu() {
    this.showSidebar = !this.showSidebar;
    this.subscriptionService.sendMessage({
      ttype: 'showSidebar',
      value: this.showSidebar,
    });
  }
}
