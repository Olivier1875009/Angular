import { Borrow } from "./Borrow";
import { Evaluation } from "./Evaluation";
import { Favorite } from "./Favorite";
import { Reservation } from "./Reservation";

export class User {
  idUser: number = 0;
  memberNumber: string = '';
  password: string = '';
  email: string = '';
  registrationDate: Date = new Date();
  firstName: string = '';
  lastName: string = '';
  profilePicture:string = '';
  address: string = '';
  phoneNumber: string = '';
  postalCode: string = '';
  roles: string = '';
  asObservable: any;
  next: any;

  constructor() {
    /*if (this.roles == '["ROLES_USER"]') {
      this.roles = '["ROLES_USER"]';
    } else {
      this.roles = '["ROLE_ADMIN"]';
    }*/
  }
  borrows: Borrow[] = new Array();
  evaluations: Evaluation[] = new Array();
  favorites: Favorite[] = new Array();
  reservations: Reservation[] = new Array();
}