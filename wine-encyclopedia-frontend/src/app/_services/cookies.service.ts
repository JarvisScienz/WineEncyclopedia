import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CookiesService {
	setCookie(cname: string, cvalue: string, exdays: number) {
		const d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		const secure = location.protocol === 'https:' ? ";Secure" : "";
		document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";expires=" + d.toUTCString() + ";path=/;SameSite=Lax" + secure;
	}

	deleteCookie(cname: string) {
		const secure = location.protocol === 'https:' ? ";Secure" : "";
		document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax" + secure;
	}

	getCookie(cname: string) {
		let name = cname + "=";
		let ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				try {
					return decodeURIComponent(c.substring(name.length, c.length));
				} catch {
					return "";
				}
			}
		}
		return "";
	}

	getCookieUser(){
		return this.getCookie("user");
	}
}
