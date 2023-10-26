import { Component, ElementRef, ViewChild } from '@angular/core';
import { Borrow } from '../model/Borrow';
import { ElectrolibService } from '../electrolib.service';
import { format } from 'date-fns';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Book } from '../model/Book';
import { getURLBookCover } from '../util';
import { Genre } from '../model/Genre';
import { DataService } from '../data.service';

@Component({
  selector: 'app-admin-borrows',
  templateUrl: './admin-borrows.component.html',
  styleUrls: ['./admin-borrows.component.css']
})
export class AdminBorrowsComponent {

  borrows: Borrow[] = [];
  displayedBorrows: Borrow[] = [];
  book: Book = new Book();

  searchField: string = "";
  selectedSearchBy: String = "title";
  selectedSortBy: String = "ascending";

  isChecked: Boolean = true;
  isCheckedLates: Boolean = false;

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal, private dataService: DataService) { }

  ngOnInit() {

    this.retrieveBorrows();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeCheckBoxState(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;

    this.showBorrowsCriteria();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeCheckBoxStateLates(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isCheckedLates = target.checked;

    this.showBorrowsCriteria();
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  showBorrowsCriteria() {
    this.displayedBorrows = [];

    // Afficher seulement les emprunts en cours et seulement les retards
    if (this.isChecked && this.isCheckedLates) {
      this.borrows.forEach(borrow => {
        if (borrow.returnedDate === null && this.checkIfLate(borrow) != "") {
          this.displayedBorrows.push(borrow);
        }
      });
      return;
    }

    // Afficher seulement les emprunts en cours, en retard ou non
    if (this.isChecked && !this.isCheckedLates) {
      this.borrows.forEach(borrow => {
        if (borrow.returnedDate === null) {
          this.displayedBorrows.push(borrow);
        }
      });
      return;
    }

    // Afficher tous les emprunts en retard
    if (!this.isChecked && this.isCheckedLates) {
      this.borrows.forEach(borrow => {
        if (this.checkIfLate(borrow) != "") {
          this.displayedBorrows.push(borrow);
        }
      });
      return;
    }

    // Afficher tous les emprunts en cours, en retard ou non
    if (!this.isChecked && !this.isCheckedLates) {
      this.displayedBorrows = this.borrows;
      return;
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  returnBorrow(borrow: Borrow) {
    let returnedBorrow: Borrow = borrow;

    this.electrolibService.returnBorrow(returnedBorrow).subscribe(
      (response) => {
        console.log('Book returned successfully!', response);
        this.retrieveBorrows();
        this.showBorrowsCriteria();
      },
      (error) => {
        console.error('Return failed:', error);
      }
    );
  }


  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  retrieveBorrows() {
    this.electrolibService.getBorrows().subscribe(
      borrows => {
        this.borrows = borrows;
        this.showBorrowsCriteria();
      }
    );
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
  // Tri les emprunts
  //-------------------------------------------------------
  sortBorrows() {
    if (this.selectedSortBy == "ascending") {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedBorrows.sort((a, b) => (a.book.title > b.book.title ? 1 : -1));
          break;
        case "memberNumber":
          this.displayedBorrows.sort((a, b) => (a.user.memberNumber > b.user.memberNumber ? 1 : -1));
          break;
        case "borowedDate":
          this.displayedBorrows.sort((a, b) => (a.borrowedDate > b.borrowedDate ? 1 : -1));
          break;
        case "dueDate":
          this.displayedBorrows.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
          break;
      }
    }
    else {
      switch (this.selectedSearchBy) {
        case "title":
          this.displayedBorrows.sort((a, b) => (a.book.title < b.book.title ? 1 : -1));
          break;
        case "memberNumber":
          this.displayedBorrows.sort((a, b) => (a.user.memberNumber < b.user.memberNumber ? 1 : -1));
          break;
        case "borowedDate":
          this.displayedBorrows.sort((a, b) => (a.borrowedDate < b.borrowedDate ? 1 : -1));
          break;
        case "dueDate":
          this.displayedBorrows.sort((a, b) => (a.dueDate < b.dueDate ? 1 : -1));
          break;
      }
    }
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  search() {
    if (this.searchField.trim().length > 0) {
      this.displayedBorrows = [];

      this.borrows.forEach(borrow => {
        if (this.isBorrowValid(borrow)) {
          switch (this.selectedSearchBy) {
            case "title":
              if (this.isFieldValid(borrow.book.title)) {
                this.displayedBorrows.push(borrow);
              }
              break;
            case "memberNumber":
              if (this.isFieldValid(borrow.user.memberNumber)) {
                this.displayedBorrows.push(borrow);
              }
              break;
            case "borrowedDate":
              if (this.isFieldValid(borrow.borrowedDate.toString())) {
                this.displayedBorrows.push(borrow);
              }
              break;
            case "dueDate":
              if (this.isFieldValid(borrow.dueDate.toString())) {
                this.displayedBorrows.push(borrow);
              }
              break;
          }
        }
      });
    }
    else {
      this.showBorrowsCriteria();
    }
    this.sortBorrows();
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
  isBorrowValid(borrow: Borrow) {
    if (this.isChecked && borrow.returnedDate != null) {
      return false;
    }
    return true;
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  checkIfLate(borrow: Borrow) {
    const nowDate: Date = new Date();
    const dueDate: Date = new Date(borrow.dueDate);

    if (borrow.returnedDate === null) {
      if (nowDate > dueDate) {
        return "En retard";
      }
    }
    else {
      const returnedDate: Date = new Date(borrow.returnedDate);
      if (dueDate < returnedDate) {
        return "Retourné avec retard";
      }
    }

    return "";
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  openAbout(content: any, idBook: number) {
    this.book = new Book();
    this.electrolibService.getBook(idBook).subscribe(
      book => {
        this.book = book;
      }
    );

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', animation: true });
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getBookCover(idBook: number) {
    return getURLBookCover(idBook);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  changeTab(tab: string) {
    this.dataService.changeTab(tab);
  }

}
