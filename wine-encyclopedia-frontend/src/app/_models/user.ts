export class User {
    id!: number;
    username!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
    authdata?: string;
	tokenJWT?: string;
    email?: string;
    name?: string;
    registrationDate?: string;
    level?: string;
}