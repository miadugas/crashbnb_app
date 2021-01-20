import { findLast } from '@angular/compiler/src/directive_resolver';
import { Injectable } from '@angular/core';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Denver Penthouse',
      'Look at this view!!!',
      'https://i0.wp.com/www.denverpost.com/wp-content/uploads/2017/04/four-seasons-4400-2-6-17-dining-view-web.jpg?sharp=10&vib=20&w=1200',
      109.99
    ),
    new Place(
      'p2',
      "Highlands Escape",
      'A romantic bungalow in the Highlands!',
      'https://s3.amazonaws.com/lacstorage.leadsandcontacts.com/images/property/denver/2003700/2003716-1.jpeg',
      99.99
    ),
    new Place(
      'p3',
      'Close to CSU',
      'A new Rams dream',
      'https://s3.amazonaws.com/rcp-prod-uploads/property_images/webp/2019-06/Colorado-State-University-Apartment-Building-559069.jpeg',
      59.99
    )
  ];

  get places() {
    return [...this._places];
  }

  constructor() {}

  getPlace(id: string) {
    return {...this._places.find(
      p => p.id === id)};
  
    }
}
