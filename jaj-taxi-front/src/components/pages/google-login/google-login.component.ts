import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { gapi } from 'gapi-script';

@Component({
  selector: 'app-google-login',
  standalone: true,
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss'],
  imports: [CommonModule, HttpClientModule],
})
export class GoogleLoginComponent implements OnInit {
  private clientId =
    '34181254946-sftljvisrl5bbg9afi7539tg0ejvc0op.apps.googleusercontent.com'; // Replace with your Google Client ID

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadGoogleApiScript().then(() => {
      this.initializeGoogleSignIn();
    });
  }

  // Dynamically load the Google API script
  private loadGoogleApiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/platform.js';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject('Failed to load the Google API script.');
      document.body.appendChild(script);
    });
  }

  private initializeGoogleSignIn(): void {
    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init({
        client_id: this.clientId,
        cookiepolicy: 'single_host_origin',
      });
      this.attachSignin(document.getElementById('googleSignInButton')!);
    });
  }

  private attachSignin(element: HTMLElement): void {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.attachClickHandler(
      element,
      {},
      (googleUser: {
        getAuthResponse: () => { (): any; new (): any; id_token: any };
      }) => {
        const idToken = googleUser.getAuthResponse().id_token;
        this.handleGoogleLogin(idToken);
      },
      (error: any) => {
        console.error('Google Sign-In error:', error);
      },
    );
  }

  private handleGoogleLogin(idToken: string): void {
    this.http
      .post('http://localhost:5189/api/auth/google', { token: idToken })
      .subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          localStorage.setItem('token', response.token); // Store JWT token
          this.router.navigate(['/dashboard']); // Redirect to a secure page
        },
        error: (error) => {
          console.error('Google login failed:', error);
        },
      });
  }
}
