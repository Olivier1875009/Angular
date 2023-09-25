import { Component, EventEmitter, OnInit, Output  } from '@angular/core';
import { ElectrolibService } from '../electrolib.service';
import { User } from '../model/User';
import { Borrow } from '../model/Borrow';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-borrows',
  templateUrl: './borrows.component.html',
  styleUrls: ['./borrows.component.css']
})
export class BorrowsComponent implements OnInit {
  visible = false;
  user: User = new User();
  borrows: Borrow[] = new Array();

  ngOnInit(): void 
  {
    this.retrieveBorrows();
  }

  @Output() openBorrowDetails = new EventEmitter<Borrow>();
  //@Output() openBorrowDetails = new EventEmitter<{selectedBorrow:Borrow, user:User}>();
  @Output() openInventory = new EventEmitter<User>();

  aboutModal:any;

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal) { }

  //Lorsqu'on appele et ouvre le component
  onBorrows(user: User) 
  {
    //TODO
    //Emit avec 2 arguments
    //2 Faire le tri,
    //3 faire pour un vrai user (les emprunts du user, les frais, les retard etc)
    //4 Aller chercher info livre de l'emprunt
    //5 Renouvellement

    //Livre perdu???
    //Livre abimé???

    this.visible = true;
    this.user = user;

    //TODO
    //Si le user a des frais, il ne peut plus emprunter jusqu'à ce qu'il paie
    //Le user peut avoir un maximum de 5 emprunts

    //TODO
    //Système de order
    //Order par default en ordre de priorité (status)

    //TODO
    //Check si membre pour bd et symfony
    //Order par default en ordre de priorité (status)
  }

  //Cherche tous les emprunts en bd
  retrieveBorrows()
  {
    this.electrolibService.getBorrows().subscribe(
      borrows => {
        this.borrows = borrows.map(x => Object.assign(new Borrow(), x));
      }
    );
  }

  //Affiche les détails de l'emprunt choisi
  borrowDetails(selectedBorrow: Borrow)
  {
    console.log("détails de l'emprunt")

    let user = this.user;
    this.openBorrowDetails.emit(selectedBorrow);
    //this.openBorrowDetails.emit({selectedBorrow, user});
    this.visible = false;
  }

  //Renouvellement d'un emprunt
  borrowRenew()
  {
    //TODO
    //DANS LE HTML
    //Le user peut renouveller jusqu'à 2e fois
    //Après la 2e fois OU si un autre user a réservé le livre: 
    //bloque et grise le bouton renouveller
    //Change le tooltip du bouton
    //Revérifier dans le symfonie pour empêcher le user de jouer avec le code source

    //ICI
    //Appele le symfonie,
    //Crée un nouvel emprunt OU update la date de retour

    console.log("Renouvellement de l'emprunt")
  }

  //Ouvrir la modal [à propos], qui explique tout ce qu'il faut savoir sur le système d'emprunts
  openAbout(content:any) 
  {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  //Retourner à la page inventaire
  returnInventory()
  {
    this.openInventory.emit(this.user);
    this.visible = false;
  }

  //Trie la table d'emprunts pour la sélection
  //à faire
  onSortChange(event:any)
  {
    console.log(event);
  }
}