import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Sidebar } from 'primeng/sidebar';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { ToastService } from 'src/app/services/toast.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnChanges {
  @Input() showSidebar;
  @ViewChild('sidebarMenu') sidebarMenu: Sidebar;
  @ViewChild('sidebarContainer') sidebarContainer: ElementRef;
  sidebarVisible: any;
  userDetails: any;
  userRoles: any = [];
  capabilities: any;
  subscription: Subscription;
  private subs = new SubSink();
  iswiz = false;
  minimizeMenu = false;
  showMenu = false;
  version = projectConstantsLocal.VERSION_DESKTOP;
  featureMenuItems: any = [];
  subFeatureMenuItems: any = [];
  moreFeatureMenuItems: any = [];
  constructor(
    private subscriptionService: SubscriptionService,
    private renderer: Renderer2,
    private authService: AuthService,
    private routingService: RoutingService,
    private toastService: ToastService,
    private localStorage: LocalStorageService,
    private router: Router,

    private localStorageService: LocalStorageService
  ) {
    this.subs.sink = this.subscriptionService
      .getMessage()
      .subscribe((message) => {
        switch (message.ttype) {
          case 'showSidebar':
            this.sidebarVisible = message.value;
            break;
        }
        this.setMenuItems();
      });
  }

  closeMenu() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.renderer.removeClass(document.body, 'sidebar-open');
    }
  }

  dashboardClicked() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.renderer.removeClass(document.body, 'sidebar-open');
    }
  }

  ngOnInit() {
    this.getGlobalSettings().then(() => {
      this.setMenuItems();
    });
    this.userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (this.userDetails && this.userDetails.user) {
      this.userDetails = this.userDetails.user;
      this.userDetails.userImage = JSON.parse(this.userDetails.userImage);
    }
    console.log(this.userDetails);
  }

  setMenuItems() {
    this.subFeatureMenuItems = [
      {
        name: 'Dashboard',
        condition: true,
        routerLink: 'dashboard',
        image: 'dashboard.gif',
        thumbnail: 'home-color.png',
        showOutside: true,
      },
      {
        name: 'Employees',
        condition: true,
        routerLink: 'employees',
        image: 'employees.gif',
        thumbnail: 'employees.png',
        showOutside: true,
      },

      {
        name: 'Interviews',
        condition: true,
        routerLink: 'interviews',
        image: 'interviews.gif',
        thumbnail: 'interviews.png',
        showOutside: true,
      },
      {
        name: 'Attendance',
        condition: true,
        routerLink: 'attendance',
        image: 'attendance.gif',
        thumbnail: 'attendance.png',
        showOutside: true,
      },
      {
        name: 'Payroll',
        condition: true,
        routerLink: 'payroll',
        image: 'payroll.gif',
        thumbnail: 'payroll.png',
        showOutside: true,
      },

      {
        name: 'Leave Management',
        condition: true,
        routerLink: 'leaves',
        image: 'leaves.gif',
        thumbnail: 'leaves.png',
        showOutside: true,
      },
      {
        name: 'Holidays',
        condition: true,
        routerLink: 'holidays',
        image: 'holidays.gif',
        thumbnail: 'holidays.png',
        showOutside: true,
      },
      {
        name: 'Incentives',
        condition: true,
        routerLink: 'incentives',
        image: 'incentives.gif',
        thumbnail: 'incentives.png',
        showOutside: true,
      },
      {
        name: 'Events',
        condition: true,
        routerLink: 'events',
        image: 'events.gif',
        thumbnail: 'events.png',
        showOutside: true,
      },
      {
        name: 'Users',
        // condition: true,
        condition:
          this.userDetails?.designation == 1 ||
          this.userDetails?.designation == 4,
        routerLink: 'users',
        image: 'users.gif',
        thumbnail: 'users.png',
        // showOutside: true,
        showOutside:
          this.userDetails?.designation == 1 ||
          this.userDetails?.designation == 4,
      },
      {
        name: 'Reports',
        condition: true,
        routerLink: 'reports',
        image: 'reports.gif',
        thumbnail: 'reports.png',
        showOutside: true,
      },
      {
        name: 'Settings',
        condition: true,
        routerLink: 'settings',
        image: 'settings.gif',
        thumbnail: 'settings.png',
        showOutside: false,
      },
    ];
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getProviderSettings() {}

  getGlobalSettings() {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  minimizeSideBar() {
    this.minimizeMenu = !this.minimizeMenu;
    console.log(this.minimizeMenu);
    this.subscriptionService.sendMessage({
      ttype: 'smallMenu',
      value: this.minimizeMenu,
    });
  }

  gotoActiveHome() {
    this.routingService.setFeatureRoute(null);
    this.routingService.handleRoute('', null);
  }

  showSidebarMenu(event) {
    this.sidebarVisible = event;
  }

  ngOnChanges(changes) {
    if (changes && changes.showSidebar) {
      if (this.sidebarMenu && !this.sidebarMenu.visible) {
        this.sidebarVisible = true;
      } else {
        this.sidebarVisible = false;
      }
    }
  }

  showMenuSection() {
    this.sidebarVisible = false;
    this.showMenu = false;
    this.subscriptionService.sendMessage({
      ttype: 'showmenu',
      value: this.showMenu,
    });
  }

  enableOrDisableSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  userLogout() {
    this.authService
      .doLogout()
      .then(() => {
        this.toastService.showSuccess('Logout Successful');
        this.localStorage.clearAllFromLocalStorage();
        this.router.navigate(['user', 'login']);
      })
      .catch((error) => {
        this.toastService.showError(error);
      });
  }
  gotoAccountProfile() {}
}
