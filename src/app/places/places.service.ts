import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Denver Penthouse',
      'In the center of everything 5280',
      'https://i2.wp.com/www.denverpost.com/wp-content/uploads/2017/04/four-seasons-4400-2-6-17-living-wide-web.jpg?sharp=10&vib=20&w=1200',
      99.99,
      new Date('2021-01-01'),
      new Date('2021-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      "A Highlands Getaway",
      'Bungalow in heart of the Highlands, Denver',
      'https://a0.muscache.com/im/pictures/b71eccfd-a7f6-4db8-a24b-09c5ccc2c610.jpg?im_w=960',
      59.99,
      new Date('2021-01-01'),
      new Date('2021-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'Close to Campus',
      'CU soon!',
      'https://www.colorado.edu/studentaffairs/sites/default/files/styles/medium/public/article-image/off-campus_housing_2.jpg?itok=C9Hw9TRb',
      49.99,
      new Date('2021-01-01'),
      new Date('2021-12-31'),
      'abc'
      )
    ]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) {}

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map(places => {
        return { ...places.find(p => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.places.pipe(
      take(1), delay(1000),
      tap(places => {       
        this._places.next(places.concat(newPlace));
      })
    );
  }

  // Updating a listing
  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1500),
      tap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }
}

