import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../_services';

@Component({
	selector: 'app-auth-layout',
	templateUrl: './auth-layout.component.html',
	styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
	public menuItems!: any[];
	test: Date = new Date();
	closeResult!: string;
	public sidebarColor: string = "red";
	public isCollapsed = true;
	mobile_menu_visible: any = 0;
	private toggleButton: any;
	private sidebarVisible!: boolean;
	loginForm!: UntypedFormGroup;
	loading = false;
	submitted = false;
	returnUrl!: string;
	loginError = false;
	descriptionLoginError!: string;

	constructor(private formBuilder: UntypedFormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private modalService: NgbModal,
		private authenticationService: AuthenticationService,
		private SpinnerService: NgxSpinnerService) { }

	changeSidebarColor(color: any) {
		var sidebar = document.getElementsByClassName('sidebar')[0];
		var mainPanel = document.getElementsByClassName('main-panel')[0];

		this.sidebarColor = color;

		if (sidebar != undefined) {
			sidebar.setAttribute('data', color);
		}
		if (mainPanel != undefined) {
			mainPanel.setAttribute('data', color);
		}
	}
	changeDashboardColor(color: any) {
		var body = document.getElementsByTagName('body')[0];
		if (body && color === 'white-content') {
			body.classList.add(color);
		}
		else if (body.classList.contains('white-content')) {
			body.classList.remove('white-content');
		}
	}
	// function that adds color white/transparent to the navbar on resize (this is for the collapse)
	updateColor = () => {
		var navbar = document.getElementsByClassName('navbar')[0];
		if (window.innerWidth < 993 && !this.isCollapsed) {
			navbar.classList.add('bg-white');
			navbar.classList.remove('navbar-transparent');
		} else {
			navbar.classList.remove('bg-white');
			navbar.classList.add('navbar-transparent');
		}
	};
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
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/wine-tested';
	}

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
					this.SpinnerService.hide();
					this.router.navigate([this.returnUrl]);
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

	ngOnDestroy() {
	}

	collapse() {
		this.isCollapsed = !this.isCollapsed;
		const navbar = document.getElementsByTagName("nav")[0];
		if (!this.isCollapsed) {
			navbar.classList.remove("navbar-transparent");
			navbar.classList.add("bg-white");
		} else {
			navbar.classList.add("navbar-transparent");
			navbar.classList.remove("bg-white");
		}
	}

	sidebarOpen() {
		const toggleButton = this.toggleButton;
		const mainPanel = <HTMLElement>(
			document.getElementsByClassName("main-panel")[0]
		);
		const html = document.getElementsByTagName("html")[0];
		if (window.innerWidth < 991) {
			mainPanel.style.position = "fixed";
		}

		setTimeout(function() {
			toggleButton.classList.add("toggled");
		}, 500);

		html.classList.add("nav-open");

		this.sidebarVisible = true;
	}
	sidebarClose() {
		const html = document.getElementsByTagName("html")[0];
		this.toggleButton.classList.remove("toggled");
		const mainPanel = <HTMLElement>(
			document.getElementsByClassName("main-panel")[0]
		);

		if (window.innerWidth < 991) {
			setTimeout(function() {
				mainPanel.style.position = "";
			}, 500);
		}
		this.sidebarVisible = false;
		html.classList.remove("nav-open");
	}
	sidebarToggle() {
		// const toggleButton = this.toggleButton;
		// const html = document.getElementsByTagName('html')[0];
		var $toggle = document.getElementsByClassName("navbar-toggler")[0];
		var $layer = document.createElement("div");

		if (this.sidebarVisible === false) {
			this.sidebarOpen();
		} else {
			this.sidebarClose();
		}
		const html = document.getElementsByTagName("html")[0];

		if (this.mobile_menu_visible == 1) {
			// $('html').removeClass('nav-open');
			html.classList.remove("nav-open");
			if ($layer) {
				$layer.remove();
			}
			setTimeout(function() {
				$toggle.classList.remove("toggled");
			}, 400);

			this.mobile_menu_visible = 0;
		} else {
			setTimeout(function() {
				$toggle.classList.add("toggled");
			}, 430);

			var $layer = document.createElement("div");
			$layer.setAttribute("class", "close-layer");

			if (html.querySelectorAll(".main-panel")) {
				document.getElementsByClassName("main-panel")[0].appendChild($layer);
			} else if (html.classList.contains("off-canvas-sidebar")) {
				document
					.getElementsByClassName("wrapper-full-page")[0]
					.appendChild($layer);
			}

			setTimeout(function() {
				$layer.classList.add("visible");
			}, 100);

			$layer.onclick = function() {
				//asign a function
				html.classList.remove("nav-open");
				//this.mobile_menu_visible = 0;
				$layer.classList.remove("visible");
				setTimeout(function() {
					$layer.remove();
					$toggle.classList.remove("toggled");
				}, 400);
			}.bind(this);

			html.classList.add("nav-open");
			this.mobile_menu_visible = 1;
		}
	}
	
	open(content: any) {
		this.modalService.open(content, { windowClass: 'modal-search' }).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
}
