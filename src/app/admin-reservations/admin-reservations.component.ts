import { Component } from '@angular/core';
import { Reservation } from '../model/Reservation';
import { ElectrolibService } from '../electrolib.service';
import { Borrow } from '../model/Borrow';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css']
})
export class AdminReservationsComponent {

  reservations: Reservation[] = [];
  displayedReservations: Reservation[] = [];
  activeBorrows: Borrow[] = [];
  ReservationsData: any;

  searchField: string = "";
  selectedSearchBy: String = "title";
  selectedSortBy: String = "ascending";

  isChecked = true;

  constructor(private electrolibService: ElectrolibService) { }

  ngOnInit() {

    this.retrieveReservations();
    this.retrieveActiveBorrows();
    this.retrieveReservationsData();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveReservations() {
    this.electrolibService.getReservations().subscribe(
      reservations => {
        this.reservations = reservations;
        this.showReservationsCriteria();
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getBorrowMemberNumber(idReservation: number): string | null {
    if (!this.ReservationsData) {
      return null;
    }
  
    const reservation = this.ReservationsData.find(
      (res: { idReservation: number; }) => res.idReservation === idReservation
    );
    return reservation ? reservation.borrowMemberNumber : null;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getDueDate(idReservation: number): string {
    if (!this.ReservationsData) {
      return "";
    }
  
    const reservation = this.ReservationsData.find(
      (res: { idReservation: number; }) => res.idReservation === idReservation
    );
    return reservation.dueDate;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveActiveBorrows() {
    this.electrolibService.getActiveBorrows().subscribe(
      borrows => {
        this.activeBorrows = borrows;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveReservationsData() {
    this.electrolibService.getReservationsData().subscribe(
      data => {
        this.ReservationsData = data;
      }
    );
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeCheckBoxState(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;

    this.showReservationsCriteria();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  showReservationsCriteria() {
    let tempRes: Reservation[] = [];

    if (this.isChecked) {

      this.reservations.forEach(res => {
        if (res.isActive === 1) {
          tempRes.push(res);
        }
      });
      this.displayedReservations = tempRes;
    } 

    else {
      this.displayedReservations = this.reservations;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeResearchBy(type: String) {
    this.selectedSearchBy = type;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeSortBy(type: String) {
    this.selectedSortBy = type;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  search() {
    console.log(this.displayedReservations);
    if (this.searchField.trim().length > 0) {
      this.displayedReservations = [];

      this.reservations.forEach(reservation => {
        if (this.isReservationValid(reservation)) {
          switch (this.selectedSearchBy) {
            case "title":
              if (this.isFieldValid(reservation.book.title)) {
                this.displayedReservations.push(reservation);
              }
              break;
            case "memberNumber":
              if (this.isFieldValid(reservation.user.memberNumber)) {
                this.displayedReservations.push(reservation);
              }
              break;
            case "reservationDate":
              if (this.isFieldValid(reservation.reservationDate.toString())) {
                this.displayedReservations.push(reservation);
              }
              break;
          }
        }
      });
    }
    else {
      this.showReservationsCriteria();
    }
    this.sortReservations();
  }

  //-------------------------------------------------------
  // Tri les réservations
  //-------------------------------------------------------
  sortReservations() {
    if (this.selectedSortBy == "ascending") {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedReservations.sort((a, b) => (a.book.title > b.book.title ? 1 : -1));
          break;
        case "memberNumber":
          this.displayedReservations.sort((a, b) => (a.user.memberNumber > b.user.memberNumber ? 1 : -1));
          break;
        case "reservationDate":
          this.displayedReservations.sort((a, b) => (a.reservationDate > b.reservationDate ? 1 : -1));
          break;
      }
    } 
    else {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedReservations.sort((a, b) => (a.book.title < b.book.title ? 1 : -1));
          break;
        case "memberNumber":
          this.displayedReservations.sort((a, b) => (a.user.memberNumber < b.user.memberNumber ? 1 : -1));
          break;
        case "reservationDate":
          this.displayedReservations.sort((a, b) => (a.reservationDate < b.reservationDate ? 1 : -1));
          break;
      }
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  isFieldValid(value: string) {
    return value.toUpperCase().includes(this.searchField.toUpperCase());
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  isReservationValid(reservation: Reservation) {
    if (this.isChecked && reservation.isActive === 0) {
      return false;
    }
    return true;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  checkIfLate(idReservation: number) {

    const nowDate: Date = new Date();
    const dueDate: Date = new Date(this.getDueDate(idReservation));
    

    if (nowDate >= dueDate) {
      return "En retard";
    }

    return "";
  }

}
