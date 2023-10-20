import { Injectable } from '@angular/core';
import { urlServer } from './util';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Book } from './model/Book';
import { User } from './model/User';
import { Genre } from './model/Genre';
import { Author } from './model/Author';
import { Borrow } from './model/Borrow';
import { Status } from './model/Status';
import { Reservation } from './model/Reservation';
import { Evaluation } from './model/Evaluation';
import { Favorite } from './model/Favorite';

@Injectable({
  providedIn: 'root'
})
export class ElectrolibService {

  //--------------------------------
  // Initialize the component
  //--------------------------------
  constructor(private http: HttpClient) { }

  
  //--------------------------------
  // Route to get all the books
  //--------------------------------
  getBooks() {
    let url = urlServer + 'books';

    return this.http.get<Book[]>(url);
  }

  getRecommended(idUser:number) {
    let url = urlServer + 'recommandation/'+idUser;

    return this.http.get<Book[]>(url);
  }
  
  //--------------------------------
  //
  //--------------------------------
  getGenres() {
    let url = urlServer + 'genres';

    return this.http.get<Genre[]>(url);
  }

  //--------------------------------
  //
  //--------------------------------
  getAllStatus() {
    let url = urlServer + 'all-status';

    return this.http.get<Status[]>(url);
  }
  
  //--------------------------------
  // Route to get all the genre
  //--------------------------------
  getGenre(idGenre: number) {
    let url = urlServer + 'genre/' + idGenre;

    return this.http.get<Genre>(url);
  }
  
  //--------------------------------
  // Route to get all the genre
  //--------------------------------
  getAuthors() {
    let url = urlServer + 'authors';

    return this.http.get<Author[]>(url);
  }
  
  //--------------------------------
  // Route to get all the genre
  //--------------------------------
  getAuthor(idAuthor: number) {
    let url = urlServer + 'author/' + idAuthor;

    return this.http.get<Author>(url);
  }


  //--------------------------------
  // Route to get all the genre
  //--------------------------------
  getBorrows() {
    let url = urlServer + 'borrows';
    //url = "http://127.0.0.1:8000/borrows";

    return this.http.get<Borrow[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getActiveBorrows() {
    let url = urlServer + 'active-borrows';

    return this.http.get<Borrow[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  returnBorrow(borrow: Borrow) {
    let url = `${urlServer}return-borrow/${borrow.idBorrow}`;

    const formData = new FormData();
    formData.append('returnedDate', borrow.returnedDate.toDateString());
    

    return this.http.post<Borrow>(url, formData);
  }

  getBorrow(idBorrow:Number)
  {
    let url = urlServer + "borrows/borrow/" + idBorrow;
    return this.http.get<Borrow>(url);
  }

  getBorrowsFromUser(user: User)
  {
    let idUser = user.idUser;
    let url = urlServer + 'borrows/' + idUser;

    return this.http.get<Borrow[]>(url);
  }

  getBorrowsHistoryFromUser(user: User)
  {
    let idUser = user.idUser;
    let url = urlServer + "borrows/history/" + idUser;

    return this.http.get<Borrow[]>(url);
  }

  getBorrowsOrderedBy(user: User, order:any)
  {
    let idUser = user.idUser;
    let url = urlServer + "borrows/" + idUser + "/" + order;

    return this.http.get<Borrow[]>(url);
  }

  getBorrowsHistoryOrderedBy(user: User, order:any)
  {
    let idUser = user.idUser;
    let url = urlServer + "borrows/history/" + idUser + "/" + order;

    return this.http.get<Borrow[]>(url);
  }

  renewDueDate(borrow: Borrow)
  {
    let idBorrow = borrow.idBorrow;
    let url = urlServer + "renew/" + idBorrow;

    return this.http.get<any>(url);
  }

  getReservationsFromUser(user:User)
  {
    let idUser = user.idUser;
    let url = urlServer + 'reservations/'+ idUser;
    return this.http.get<Reservation[]>(url);
  }

  getReservationsOrderedBy(user: User, order:any)
  {
    let idUser = user.idUser;
    let url = urlServer + 'borrows';
    url = urlServer + "reservations/" + idUser + "/" + order;

    return this.http.get<Reservation[]>(url);
  }

  cancelReservationUser(reservation: Reservation)
  {
    let idReservation = reservation.idReservation;
    let url = urlServer + 'borrows';
    url = urlServer + "reservations/cancel/" + idReservation;

    return this.http.get<Reservation>(url);
  }

  getBorrowFromBook(idBook:Number)
  {
    let url = urlServer + 'borrows/book/'+ idBook;
    return this.http.get<Borrow>(url);
  }

  //--------------------------------
  // Route to connect a user
  //--------------------------------
  connection(user: User) {
    let url = urlServer + 'users/connection';
    
    const params = new HttpParams({
      fromObject: {
        memberNumber: user.memberNumber,
        password: user.password
      }
    });

    return this.http.post<User>(url, params);
  }
  
  //route qui va chercher un livre
  getBook(id:number){
    let url = urlServer + 'get-book/'+id;

    return this.http.get<Book>(url);
  }

  //route qui va chercher un livre
  getBookBorrowed(id:number){
    let url = urlServer + 'getBookBorrowed/'+id;

    return this.http.get<Book>(url);
  }

  //--------------------------------
  // Créer un livre
  //--------------------------------
  /*createBook(book: Book) {
    let url = urlServer + "createBook";

    const params = new HttpParams({
      fromObject: {
        title: book.title,
        description: book.description,
        isbn: book.isbn,
        publishedDate: book.publishedDate,
        originalLanguage: book.originalLanguage,
        isBorrowed: book.isBorrowed,
        cover: book.cover,
        idAuthor: book.idAuthor,
        idGenre: book.idGenre
      }
    });

    return this.http.post<Book>(url, params);
  }*/

  uploadImage(imageData: string) {
    const formData = new FormData();
    formData.append('image', imageData);

    let url = urlServer + "createBook";

    return this.http.post(url, formData);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  createBookWithImage(book: Book, imageData: Blob) {
    let url = `${urlServer}create-book`;

    // Crée FormData pour envoyer à la fois l'objet livre et l'image
    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('description', book.description);
    formData.append('isbn', book.isbn);
    formData.append('publishedDate', book.publishedDate);
    formData.append('originalLanguage', book.originalLanguage);
    formData.append('cover', imageData); // Ajoute les données d'image ici
    formData.append('idAuthor', book.idAuthor.toString());
    formData.append('idGenre', book.idGenre.toString());
    formData.append('idStatus', book.idStatus.toString());

    return this.http.post<Book>(url, formData);
  }

  createBorrow(book:Book,user:User){
    const url = `${urlServer}create-Borrow`;
    console.log(user.idUser);
    const formData = new FormData();
    formData.append('idBook',book.idBook.toString());
    formData.append('idUser',user.idUser.toString());

    return this.http.post<Borrow>(url,formData);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  updateBook(book: Book, imageData: Blob) {
    let url = `${urlServer}update-book/${book.idBook}`;

    // Crée FormData pour envoyer à la fois l'objet livre et l'image
    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('description', book.description);
    formData.append('isbn', book.isbn);
    formData.append('publishedDate', book.publishedDate);
    formData.append('originalLanguage', book.originalLanguage);
    formData.append('cover', imageData); // Ajoute les données d'image ici
    formData.append('idAuthor', book.idAuthor.toString());
    formData.append('idGenre', book.idGenre.toString());
    formData.append('idStatus', book.idStatus.toString());

    return this.http.post<Book>(url, formData);

    //NE PAS ENLEVER LE CODE EN COMMENTAIRE: JE VEUX ESSAYER DE FAIRE FONCTIONNER LE PUT PLUS TARD
    /*const updatedBook = {
      title: book.title,
      description: book.description,
      isbn: book.isbn,
      publishedDate: book.publishedDate,
      originalLanguage: book.originalLanguage,
      isBorrowed: book.isBorrowed,
      idAuthor: book.idAuthor,
      idGenre: book.idGenre,
    };
  
    const formData = new FormData();
    formData.append('cover', imageData);
  
    const requestData = {
      book: updatedBook,
      image: formData,
    };

    //PEUT-ÊTRE UNE ERREUR AVEC LE FORM QUE J'ENVOIE (À VÉRIFIER)
    return this.http.put<Book>(url, requestData);*/
  }

  //--------------------------------
  // Update the profile informations
  //--------------------------------
  updateProfilePicture(idUser: number | undefined, pictureNumber: number) {
    let url = urlServer + 'user/' + idUser;

    const params = new HttpParams({
      fromObject: {
        action: 'updateProfilePicture',
        pictureNumber: pictureNumber
      }
    });

    return this.http.post(url, params);
  }
  
  //--------------------------------
  // Update the profile informations
  //--------------------------------
  updateProfile(action: string, idUser: number | undefined, object?: any) {
    let url = urlServer + 'user/' + idUser;
    
    const params = new HttpParams({
      fromObject: {
        action: action,
        email: object?.email,
        firstName: object?.firstName,
        lastName: object?.lastName,
        address: object?.address,
        postalCode: object?.postalCode,
        phoneNumber: object?.phoneNumber,
        newPassword: object?.newPassword
      }
    });

    return this.http.post<User>(url, params);
  }
  
  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getReservations() {
    let url = urlServer + 'reservations';

    return this.http.get<Reservation[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getEvaluations() {
    let url = urlServer + 'evaluations';

    return this.http.get<Evaluation[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getFavorites() {
    let url = urlServer + 'favorites';

    return this.http.get<Favorite[]>(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  getReservationsData() {
    let url = urlServer + 'reservations-data';

    return this.http.get(url);
  }

  //-------------------------------------------------------
  //
  //-------------------------------------------------------
  cancelReservation(reservation: Reservation) {
    let url = `${urlServer}cancel-reservation/${reservation.idReservation}`;
    const formData = new FormData();

    return this.http.post<Borrow>(url, formData);
  }
}