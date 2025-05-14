import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private apiKey = environment.googleMapsApiKey;
  
  constructor() { }
  
  // Your maps service methods here
  
  getApiKey(): string {
    return this.apiKey;
  }
} 