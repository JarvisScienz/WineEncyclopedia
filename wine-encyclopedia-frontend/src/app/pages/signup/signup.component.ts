import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';
import { TranslationService } from '../../_services/translation.service';

function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
	const value: string = control.value || '';
	const hasMinLength = value.length >= 8;
	const hasNumber = /\d/.test(value);
	const hasSymbol = /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?~`]/.test(value);
	if (hasMinLength && hasNumber && hasSymbol) return null;
	return { passwordStrength: { hasMinLength, hasNumber, hasSymbol } };
}

@Component({
	selector: 'signup-cmp',
	templateUrl: 'signup.component.html',
	styleUrls: ['./signup.component.css']
	})
export class SignupComponent implements OnInit {
	registrationForm!: UntypedFormGroup;
	loading = false;
	submitted = false;
	returnUrl!: string;
	loginError = false;
	emailAlreadyRegistered = false;
	showPassword: boolean = false;
	registrationSuccess = false;

	constructor(
		private formBuilder: UntypedFormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		public translationService: TranslationService,
	) {
		if (this.authenticationService.currentUserValue) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
		this.registrationForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, passwordStrengthValidator]]
		});
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	get passwordStrength(): 'weak' | 'medium' | 'strong' {
		const value: string = this.f.password.value || '';
		const score =
			(value.length >= 8 ? 1 : 0) +
			(/\d/.test(value) ? 1 : 0) +
			(/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?~`]/.test(value) ? 1 : 0);
		if (score <= 1) return 'weak';
		if (score === 2) return 'medium';
		return 'strong';
	}

	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
	}

	toggleLanguage(): void {
		this.translationService.toggleLanguage();
	}

	// convenience getter for easy access to form fields
	get f() { return this.registrationForm.controls; }

	onSubmit() {
		this.submitted = true;
		this.loginError = false;
		this.emailAlreadyRegistered = false;

		if (this.registrationForm.invalid) {
			return;
		}

		this.loading = true;
		try {
			this.authenticationService.signup(this.f.email.value, this.f.password.value)
				.pipe(first())
				.subscribe({
					next: () => {
						this.loading = false;
						this.registrationSuccess = true;
					},
					error: (error: string) => {
						this.loading = false;
						const msg = (error || '').toLowerCase();
						if (msg.includes('already') || msg.includes('exists') ||
							msg.includes('in use') || msg.includes('conflict') ||
							msg.includes('registrata') || msg.includes('409')) {
							this.emailAlreadyRegistered = true;
						} else {
							this.loginError = true;
						}
					}
				});
		} catch (error) {
			console.error('Errore durante la creazione dell\'utente:', error);
		}
	}
}
