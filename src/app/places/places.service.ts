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
      'In the center of everything 5280',
      'https://i2.wp.com/www.denverpost.com/wp-content/uploads/2017/04/four-seasons-4400-2-6-17-living-wide-web.jpg?sharp=10&vib=20&w=1200',
      99.99,
      new Date('2021-01-01'),
      new Date('2021-12-31')
    ),
    new Place(
      'p2',
      "A Highlands Getaway",
      'Bungalow in heart of the Highlands, Denver',
      'https://a0.muscache.com/im/pictures/b71eccfd-a7f6-4db8-a24b-09c5ccc2c610.jpg?im_w=960',
      59.99,
      new Date('2021-01-01'),
      new Date('2021-12-31')
    ),
    new Place(
      'p3',
      'Close to Campus',
      'CU soon!',
      'https://www.colorado.edu/studentaffairs/sites/default/files/styles/medium/public/article-image/off-campus_housing_2.jpg?itok=C9Hw9TRb',
      49.99,
      new Date('2021-01-01'),
      new Date('2021-12-31')
    )
  ];

  get places() {
    return [...this._places];
  }

  constructor() {}

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }
}
