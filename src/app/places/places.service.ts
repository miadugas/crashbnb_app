import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';



interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);
    // [
    // new Place(
    //   'p1',
    //   'Denver Penthouse',
    //   'In the center of everything 5280',
    //   'https://i2.wp.com/www.denverpost.com/wp-content/uploads/2017/04/four-seasons-4400-2-6-17-living-wide-web.jpg?sharp=10&vib=20&w=1200',
    //   99.99,
    //   new Date('2021-01-01'),
    //   new Date('2021-12-31'),
    //   'abc'
    // ),
    // new Place(
    //   'p2',
    //   "A Highlands Getaway",
    //   'Bungalow in heart of the Highlands, Denver',
    //   'https://a0.muscache.com/im/pictures/b71eccfd-a7f6-4db8-a24b-09c5ccc2c610.jpg?im_w=960',
    //   59.99,
    //   new Date('2021-01-01'),
    //   new Date('2021-12-31'),
    //   'abc'
    // ),
    // new Place(
    //   'p3',
    //   'Close to Campus',
    //   'CU soon!',
    //   'https://www.colorado.edu/studentaffairs/sites/default/files/styles/medium/public/article-image/off-campus_housing_2.jpg?itok=C9Hw9TRb',
    //   49.99,
    //   new Date('2021-01-01'),
    //   new Date('2021-12-31'),
    //   'abc'
    //   )
  //  ]
  //  );

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>
      (
        'https://iloftz-default-rtdb.firebaseio.com/offered-places.json'
      )
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

   getPlace(id: string) {
     return this.http
       .get<PlaceData>(
         `https://iloftz-default-rtdb.firebaseio.com/offered-places/${id}.json`
       )
       .pipe(
         map(placeData => {
           return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
         })
       );
   }

   uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{imageUrl: string, imagePath: string}>(
      'https://us-central1-iloftz.cloudfunctions.net/storeImage',
      uploadData
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      imageUrl,
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
      location
    );
    return this.http
      .post<{ name: string }>(
        'https://iloftz-default-rtdb.firebaseio.com/offered-places.json',
        {
          ...newPlace,
          id: null
        }
      )

      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(
    //   take(1), delay(1000),
    //   tap(places => {       
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

// Updating a listing
updatePlace(placeId: string, title: string, description: string) {
  let updatedPlaces: Place[];
  return this.places.pipe(
    take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
  }),
  switchMap(places => {
    const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
    updatedPlaces = [...places];
    const oldPlace = updatedPlaces[updatedPlaceIndex];
    updatedPlaces[updatedPlaceIndex] = new Place(
      oldPlace.id,
      title,
      description,
      oldPlace.imageUrl,
      oldPlace.price,
      oldPlace.availableFrom,
      oldPlace.availableTo,
      oldPlace.userId,
      oldPlace.location
    );
return this.http.put(
`https://iloftz-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
{ ...updatedPlaces[updatedPlaceIndex], id: null }
);
  }), 
  tap(() => {
    this._places.next(updatedPlaces);
  })
  );
}
}