import { Component } from '@angular/core';
import { User } from './modele/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isConnected = false;

  //-------------------------------------------------------
  // Function to connect a user
  //-------------------------------------------------------
  onConnect(user: User) {
    this.isConnected = true;
  }

  //-------------------------------------------------------
  // Function to disconnect the current user
  //-------------------------------------------------------
  onDisconnect(user: User) {
    this.isConnected = false;
  }
}