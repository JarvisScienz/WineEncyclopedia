import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { User } from 'src/app/_models/user';
import { CookiesService } from 'src/app/_services/cookies.service';
import { UserService } from 'src/app/_services/user.service';
import { WineTastedService } from 'src/app/_services/wineTasted.service';
import { levels, getLevel } from 'src/app/config/levels';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = {
    id: 0,
    username: '',
    password: '',
    firstName: '',
    lastName: ''
  };
  userUid: string  = "";
  totalTasted: number = 0;
  yearlyTastings = { };
  levelInfo: any = {};
  userLevel: any;
  nextLevel: any = undefined;
  levelCalculated = false;
  progressPercentage: number = 0;
  winesNeededForNextLevel: number = 0;

  // Profile save state
  isSavingProfile = false;
  profileSaveSuccess = false;
  profileSaveError = false;

  // Password change state
  oldPassword = '';
  newPassword = '';
  showOldPassword = false;
  showNewPassword = false;
  isChangingPassword = false;
  passwordChangeSuccess = false;
  passwordChangeError = false;
  passwordChangeErrorMsg = '';

  constructor(private userService: UserService,
    private wineTastedService: WineTastedService,
    private cookiesService: CookiesService
  ) {
    this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
    this.user.email = JSON.parse(this.cookiesService.getCookieUser()).email;
  }

  ngOnInit() {
    this.getWineTastedInYears();
    this.getUserInformation();
  }

  loadChart() {
    const ctx = document.getElementById('tastingChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.yearlyTastings),
        datasets: [{
          label: 'Vini degustati',
          data: Object.values(this.yearlyTastings),
          backgroundColor: '#6b3e26',
          borderColor: '#4a2d1f',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  getWineTastedInYears(){
    this.wineTastedService.getWineTastedInYears(this.userUid).subscribe(((count: null) => {
      if (count == null)
        this.yearlyTastings = {};
      else
        this.yearlyTastings = count;
      this.totalTasted = parseInt(Object.values(this.yearlyTastings).reduce((acc: any, val: any) => acc + val, 0) as string);
      this.calculateLevelProgress();
      this.loadChart();
    }));
  }

  getUserInformation(){
    this.userService.getUserInformation(this.userUid).subscribe(((user: null) => {
      if (user != null){
        this.user = user;
        this.levelInfo = getLevel(this.totalTasted);
        this.calculateLevelProgress();
      }
    }));
  }

  calculateLevelProgress(): void {
    this.userLevel = getLevel(this.totalTasted);
    this.levelInfo = this.userLevel;

    const currentLevelIndex = levels.findIndex(
      (level) => level.name === this.userLevel?.name
    );
    if (currentLevelIndex >= 0 && currentLevelIndex < levels.length - 1) {
      this.nextLevel = levels[currentLevelIndex + 1];
    } else {
      this.nextLevel = null;
    }

    if (this.userLevel && this.nextLevel) {
      const winesInCurrentLevel = this.userLevel.maxWines - this.userLevel.minWines;
      const winesDegustedInLevel = this.totalTasted - this.userLevel.minWines;
      this.progressPercentage = (winesDegustedInLevel / winesInCurrentLevel) * 100;
      this.winesNeededForNextLevel = this.nextLevel.minWines - this.totalTasted;
    } else {
      this.progressPercentage = 100;
      this.winesNeededForNextLevel = 0;
    }
    this.levelCalculated = true;
  }

  // ── Profile update ────────────────────────────────────────────────────────

  saveUserInfo(): void {
    this.profileSaveSuccess = false;
    this.profileSaveError = false;
    this.isSavingProfile = true;

    this.userService.updateUserInformation(this.userUid, this.user.name ?? '', this.user.email ?? '').subscribe({
      next: () => {
        this.isSavingProfile = false;
        this.profileSaveSuccess = true;
        setTimeout(() => this.profileSaveSuccess = false, 3000);
      },
      error: () => {
        this.isSavingProfile = false;
        this.profileSaveError = true;
        setTimeout(() => this.profileSaveError = false, 4000);
      }
    });
  }

  // ── Password change ───────────────────────────────────────────────────────

  get newPasswordStrength(): 'weak' | 'medium' | 'strong' {
    const v = this.newPassword;
    const score =
      (v.length >= 8 ? 1 : 0) +
      (/\d/.test(v) ? 1 : 0) +
      (/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?~`]/.test(v) ? 1 : 0);
    if (score <= 1) return 'weak';
    if (score === 2) return 'medium';
    return 'strong';
  }

  get newPasswordValid(): boolean {
    const v = this.newPassword;
    return v.length >= 8 && /\d/.test(v) && /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?~`]/.test(v);
  }

  updatePassword(): void {
    if (!this.oldPassword || !this.newPasswordValid) return;
    this.passwordChangeSuccess = false;
    this.passwordChangeError = false;
    this.isChangingPassword = true;

    this.userService.changePassword(this.userUid, this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordChangeSuccess = true;
        this.oldPassword = '';
        this.newPassword = '';
        setTimeout(() => this.passwordChangeSuccess = false, 3000);
      },
      error: (err: string) => {
        this.isChangingPassword = false;
        this.passwordChangeError = true;
        const msg = (err || '').toLowerCase();
        if (msg.includes('wrong') || msg.includes('incorrect') || msg.includes('errata') ||
            msg.includes('invalid') || msg.includes('credential')) {
          this.passwordChangeErrorMsg = 'La vecchia password non è corretta.';
        } else {
          this.passwordChangeErrorMsg = 'Errore durante il cambio password. Riprova.';
        }
        setTimeout(() => this.passwordChangeError = false, 4000);
      }
    });
  }
}
