import { Injectable } from '@angular/core';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  constructor() { 
    
  }
  setupSocketConnection() {
    //this.socket = io('88.99.55.247:6001');
  }
}
