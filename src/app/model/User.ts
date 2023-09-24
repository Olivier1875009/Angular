export class User {
  idUser: number = 0;
  email: string = '';
  registrationDate:string = '';
  firstName: string = '';
  lastName: string = '';
  profilePicture:string = '';
  address: string = '';
  phoneNumber: string = '';
  postalCode: string = '';
  roles: string = '';
  password: string = '';

  constructor() {
    if (this.roles == '["ROLES_USER"]') {
      this.roles = 'Membre';
    } else {
      this.roles = 'Administrateur';
    }
  }
}