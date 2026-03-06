import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, HostListener, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from 'rxjs/operators';
import { TranslationService } from '../../_services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

import { AuthenticationService } from '../../_services';

@Component({ 
	selector: 'login-cmp',
    //moduleId: module.id,	
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		TranslatePipe
	],
	templateUrl: 'login.component.html',
	styleUrls: ['./login.component.css']
	})
export class LoginComponent implements OnInit {
	loginForm!: FormGroup;
	showPassword: boolean = false;
	loading = false;
	submitted = false;
	returnUrl!: string;
	loginError = false;
	descriptionLoginError!: string;
	wrongCredential = false;
	emailNotVerified = false;
	resendLoading = false;
	resendSuccess = false;
	resendError = false;
	
	// Signals for reactive state
	isScrolled = signal(false);
	isMobileMenuOpen = signal(false);

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private SpinnerService: NgxSpinnerService,
		public translationService: TranslationService
	) {
		// redirect to home if already logged in
		if (this.authenticationService.currentUserValue) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(4)]],
			rememberMe: [false]
		});
		
		/*this.loginForm = new FormGroup({          
              'email':new FormControl(null), //note, can have up to 3 Constructor Params: default value, validators, AsyncValidators
               'password':new FormControl(null,Validators.email)

          })*/

		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
		this.checkScroll();
	}

	@HostListener('window:scroll')
	checkScroll(): void {
	  this.isScrolled.set(window.scrollY > 50);
	}
  
	/**
	 * Toggle language between Italian and English
	 */
	toggleLanguage(): void {
	  this.translationService.toggleLanguage();
	}
  
	/**
	 * Toggle mobile menu visibility
	 */
	toggleMobileMenu(): void {
	  this.isMobileMenuOpen.update(v => !v);
	}
  
	/**
	 * Close mobile menu
	 */
	closeMobileMenu(): void {
	  this.isMobileMenuOpen.set(false);
	}

	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
	  }

	// convenience getter for easy access to form fields
	get f() { return this.loginForm.controls; }

	onSubmit() {
		this.SpinnerService.show();
		this.submitted = true;
		this.emailNotVerified = false;
		this.wrongCredential = false;
		this.loginError = false;
		this.resendSuccess = false;
		this.resendError = false;

		// stop here if form is invalid
		if (this.loginForm.invalid) {
			this.SpinnerService.hide();
			return;
		}
		this.loading = true;
		this.authenticationService.login(this.f.email.value, this.f.password.value, this.f.rememberMe.value)
			.pipe(first())
			.subscribe(
				data => {
					console.log("Connesso: " + data);
					this.SpinnerService.hide();
					this.router.navigate(["/wine-tasted"]);
				},
				error => {
					if (error === 'email_not_verified') {
						this.emailNotVerified = true;
					} else if (error === 'Forbidden') {
						this.descriptionLoginError = "Errore login. Utente non abilitato!";
						this.wrongCredential = true;
					} else {
						this.descriptionLoginError = "Errore login. Riprova!";
						this.wrongCredential = true;
					}
					this.SpinnerService.hide();
					this.loading = false;
					this.loginError = !this.emailNotVerified;
				});
	}

	resendVerification() {
		this.resendLoading = true;
		this.resendSuccess = false;
		this.resendError = false;
		this.authenticationService.resendVerificationEmail(this.f.email.value, this.f.password.value)
			.pipe(first())
			.subscribe({
				next: () => {
					this.resendLoading = false;
					this.resendSuccess = true;
				},
				error: () => {
					this.resendLoading = false;
					this.resendError = true;
				}
			});
	}
}