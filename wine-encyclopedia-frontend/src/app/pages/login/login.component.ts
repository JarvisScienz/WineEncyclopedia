import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';

@Component({ 
	selector: 'login-cmp',
    //moduleId: module.id,	
	templateUrl: 'login.component.html',
	styleUrls: ['./login.component.css']
	})
export class LoginComponent implements OnInit {
	loginForm!: UntypedFormGroup;
	showPassword: boolean = false;
	loading = false;
	submitted = false;
	returnUrl!: string;
	loginError = false;
	descriptionLoginError!: string;
	wrongCredential = false;
	

	constructor(
		private formBuilder: UntypedFormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private SpinnerService: NgxSpinnerService
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
	}

	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
	  }

	// convenience getter for easy access to form fields
	get f() { return this.loginForm.controls; }

	onSubmit() {
		this.SpinnerService.show();
		this.submitted = true;

		// stop here if form is invalid
		if (this.loginForm.invalid) {
			this.SpinnerService.hide();
			return;
		}
		this.loading = true;
		this.authenticationService.login(this.f.email.value, this.f.password.value)
			.pipe(first())
			.subscribe(
				data => {
					console.log("Connesso: " + data);
					this.SpinnerService.hide();
					this.router.navigate(["/wine-tasted"]);
				},
				error => {
					if (error == "Forbidden"){
						this.descriptionLoginError = "Errore login. Utente non abilitato!";
					}else{
						this.descriptionLoginError = "Errore login. Riprova!";	
					}
					this.wrongCredential = true;
					this.SpinnerService.hide();
					this.loading = false;
					this.loginError = true;
					
				});
	}
}