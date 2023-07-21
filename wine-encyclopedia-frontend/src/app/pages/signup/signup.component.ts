import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';

@Component({ 
	selector: 'signup-cmp',
    //moduleId: module.id,
	templateUrl: 'signup.component.html'
	})
export class SignupComponent implements OnInit {
	loginForm!: FormGroup;
	loading = false;
	submitted = false;
	returnUrl!: string;
	loginError = false;
	

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
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
		this.submitted = true;
		console.log("Signup onSubmit");
		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}

		this.loading = true;
		 try {
			this.authenticationService.signup(this.f.username.value, this.f.password.value)
				.pipe(first())
				.subscribe({				
					next: () => {
						console.log("authenticationService.login");
						this.router.navigate(["/wine-tasted"]);
						//console.log(data);
					},
					error: error => {
						console.log(error);
						this.loading = false;
						this.loginError = true;
					}
				});
		}catch (error) {
		    console.error('Errore durante la creazione dell\'utente:', error);
		    // Gestisci l'errore nella tua applicazione Angular...
	  }
	}
}