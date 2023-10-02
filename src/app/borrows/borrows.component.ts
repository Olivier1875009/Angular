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

  //Lorsque le user reclick sur le même tri, active desc
  //Sinon, le remet à false
  desc = false;
  sortBefore = "";

  ngOnInit(): void 
  {
    
  }

  @Output() openBorrowDetails = new EventEmitter<{selectedBorrow:Borrow, user:User}>();
  @Output() openInventory = new EventEmitter<User>();
  @Output() openHistory = new EventEmitter<User>();

  aboutModal:any;

  constructor(private electrolibService: ElectrolibService, private modalService: NgbModal) { }

  //Lorsqu'on appele et ouvre le component
  onBorrows(user: User) 
  {
    //TODO
    //1 bouton historique d'emprunts
    //2 Affiche tous les emprunts ayant une date de remise
    //3 Dans cette fenetre, vérifier si les emprunts ont une date de remise ou non
    //4 Changer le calcul de retard, remplacer par la date.now

    //TODO
    //1 Formatter la date
    //2 Renouvellement

    //Livre perdu???
    //Livre abimé???

    this.visible = true;
    this.user = user;
    this.retrieveBorrows();

    //TODO
    //Si le user a des frais, il ne peut plus emprunter jusqu'à ce qu'il paie
    //Le user peut avoir un maximum de 5 emprunts

    //TODO
    //Check si membre pour bd et symfony
  }

  //Cherche tous les emprunts en bd
  retrieveBorrows()
  {
    this.electrolibService.getBorrowsFromUser(this.user).subscribe(
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
    
    this.openBorrowDetails.emit({selectedBorrow:selectedBorrow, user:user});
    this.visible = false;
  }

  //Affiche les détails de l'emprunt choisi
  history()
  {
    console.log("historique d'emprunts")

    this.openHistory.emit(this.user);
    //this.openBorrowDetails.emit({selectedBorrow, user});
    this.visible = false;
  }

  //Renouvellement d'un emprunt
  borrowRenew(selectedBorrow: Borrow)
  {
    //TODO
    //DANS LE HTML
    //Le user peut renouveller jusqu'à 2e fois
    selectedBorrow.renew();
    console.log(selectedBorrow.renew());
    
    //Formatter la date
    
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

  //Tri par la valeur
  //Si on clique sur le selectbox plutôt que la colonne
  orderBySelect($event:any)
  {
    this.sortBy($event.target.value);
  }

  //Descendant ou Ascendant
  //Si on clique sur le selectbox plutôt que la colonne
  orderWayBySelect($event:any)
  {
    if($event.target.value == 'ASC')
    {
      if(this.desc == true)
      {
        this.desc = false;
        this.borrows = this.borrows.map(x => Object.assign(new Borrow(), x)).reverse();
      }
    }
    else
    {
      if(this.desc == false)
      {
        this.desc = true;
        this.borrows = this.borrows.map(x => Object.assign(new Borrow(), x)).reverse();
      }
    }

  }

  //Tri le tableau par la colonne selectionnée
  //Soit en cliquant sur la colonne
  //Où dans la liste
  sortBy($event:any)
  {
    if(this.sortBefore == $event)
    {
      this.desc = !this.desc;
    }
    else
    {
      this.desc = false;
    }
    this.sortBefore = $event;

    //Vérifie si on sélectionne le tri par titre
    //Qui contrairement aux autres,
    //n'est pas géré par une requête sql
    if($event == 'title')
    {
      this.sortByTitle();

      return;
    }

    //Sélection et tri pour les données de l'emprunt
    this.electrolibService.getBorrowsOrderedBy(this.user, $event).subscribe(
      borrows => {
        if(this.desc)
        {
          this.borrows = borrows.map(x => Object.assign(new Borrow(), x)).reverse();
        }
        else
        {
          this.borrows = borrows.map(x => Object.assign(new Borrow(), x));
        }
      }
    );
  }

  sortByTitle()
  {
    //Tri chaque borrow de la liste de borrow
    for(let i = 0; i < this.borrows.length; i++)
    {
      //Vérifie avec chaque autre borrow
      for(let j = 0; j < this.borrows.length; j++)
      {
        if(j != i)
        {
          //Compare la valeur de 2 string
          //1 pour valeur plus grande
          //0 pour valeur égale
          //-1 pour valeur plus grande
          let plusGrand = this.borrows[i].book.title.localeCompare(this.borrows[j].book.title);

          if(this.desc)
          {
            //Lorsqu'on choisi DESC, met les plus gros à la fin de la liste
            if(plusGrand == 1)
            {
              [this.borrows[i], this.borrows[j]] = [this.borrows[j], this.borrows[i]];
            }
          }
          else
          {
            //Lorsqu'on choisi ASC, met les plus gros au début de la liste
            if(plusGrand == -1)
            {
              [this.borrows[i], this.borrows[j]] = [this.borrows[j], this.borrows[i]];
            }
          }
        }
      }
    }
  }
}
