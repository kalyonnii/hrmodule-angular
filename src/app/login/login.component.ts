import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  api_loading: any = false;
  isPasswordVisible: boolean = false;
  carousalImages: any = [
    {
      url: 'assets/images/slider/slider1',
    },
    {
      url: 'assets/images/slider/slider2.jpg',
    },
    {
      url: 'assets/images/slider/slider3.jpg',
    },
    {
      url: 'assets/images/slider/slider4.png',
    },
    {
      url: 'assets/images/slider/slider5.jpg',
    },
    {
      url: 'assets/images/slider/slider6.jpg',
    },
  ];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private router: Router
  ) {}
  ngOnInit() {
    this.createForm();
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  doForgotPassword() {}
  createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      encryptedPassword: ['', Validators.compose([Validators.required])],
    });
  }
  onSubmit(loginData) {
    let payload = {
      username: loginData.username,
      encryptedPassword: loginData.encryptedPassword,
    };
    this.api_loading = true;
    console.log(payload);
    this.authService.userLogin(payload).subscribe(
      (data: any) => {
        console.log(data);
        this.api_loading = false;
        if (data && data['accessToken']) {
          this.localStorageService.setItemOnLocalStorage(
            'accessToken',
            data['accessToken']
          );
          this.localStorageService.setItemOnLocalStorage(
            'userDetails',
            jwtDecode(data['accessToken'])
          );
          this.router.navigate(['user', 'dashboard']);
        }
      },
      (error) => {
        this.api_loading = false;
        this.toastService.showError(error);
      }
    );
  }
}
