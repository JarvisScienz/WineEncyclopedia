import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';

@Component({ 
	selector: 'login-cmp',
    //moduleId: module.id,
	templateUrl: 'login.component.html'
	})
export class LoginComponent implements OnInit {
	loginForm!: FormGroup;
	loading = false;
	submitted = false;
	returnUrl!: string;
	loginError = false;
	descriptionLoginError!: string;
	

	constructor(
		private formBuilder: FormBuilder,
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
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
		
		/*this.loginForm = new FormGroup({          
              'username':new FormControl(null), //note, can have up to 3 Constructor Params: default value, validators, AsyncValidators
               'password':new FormControl(null,Validators.email)

          })*/

		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
		this.authenticationService.login(this.f.username.value, this.f.password.value)
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
					this.SpinnerService.hide();
					this.loading = false;
					this.loginError = true;
					
				});
	}
}