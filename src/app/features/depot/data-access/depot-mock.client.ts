import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EDepotStatus, TDepotListItem } from './models/depot.model';

@Injectable({
  providedIn: 'root'
})
export class DepotMockClientService {
  private readonly depots: Array<TDepotListItem> = [{
    'id': '1',
    'image': 'https://themesbrand.com/velzon/html/interactive/assets/images/companies/img-1.png',
    'name': 'Main Depot',
    'email': 'maindepot@gmail.mc',
    'country': 'USA',
    'city': 'New York',
    'street': 'Broadway',
    'building': '100',
    'latitude': 40.7128,
    'longitude': -74.0060,
    'timezone': 'America/New_York',
    'status': EDepotStatus.Available,
    'energyLimit': 500.0,
    'createdAt': '2023-01-01T00:00:00.000Z',
    'updatedAt': '2023-01-02T00:00:00.000Z',
    'chargerStats': {
      'online': 5,
      'offline': 1,
      'faulted': 0
    }
  },
    {
      'id': '2',
      'image': 'https://themesbrand.com/velzon/html/interactive/assets/images/companies/img-3.png',
      'name': 'Secondary Depot',
      'email': 'secondary@gmail.ua',
      'country': 'Canada',
      'city': 'Toronto',
      'street': 'King Street',
      'building': '200',
      'latitude': 43.6532,
      'longitude': -79.3832,
      'timezone': 'America/Toronto',
      'status': EDepotStatus.Available,
      'energyLimit': 300.0,
      'createdAt': '2023-02-01T00:00:00.000Z',
      'updatedAt': '2023-02-02T00:00:00.000Z',
      'chargerStats': {
        'online': 2,
        'offline': 6,
        'faulted': 0
      }
    },
    {
      'id': '3',
      'image': 'https://themesbrand.com/velzon/html/interactive/assets/images/companies/img-4.png',
      'name': 'Tertiary Depot',
      'email': 'tertiarydepot@gmail.ua',
      'country': 'UK',
      'city': 'London',
      'street': 'Baker Street',
      'building': '221B',
      'latitude': 51.5074,
      'longitude': -0.1278,
      'timezone': 'America/Toronto',
      'status': EDepotStatus.EnergyLimitReached,
      'energyLimit': 400.0,
      'createdAt': '2023-03-01T00:00:00.000Z',
      'updatedAt': '2023-03-02T00:00:00.000Z',
      'chargerStats': {
        'online': 2,
        'offline': 6,
        'faulted': 9
      }
    },
    {
      'id': '4',
      'image': 'https://themesbrand.com/velzon/html/interactive/assets/images/companies/img-5.png',
      'name': 'Quaternary Depot',
      'country': 'Australia',
      'email': 'quaternary@gmail.en',
      'city': 'Sydney',
      'street': 'George Street',
      'building': '300',
      'latitude': -33.8688,
      'longitude': 151.2093,
      'timezone': 'Europe/London',
      'status': EDepotStatus.EnergyLimitReached,
      'energyLimit': 600.0,
      'createdAt': '2023-04-01T00:00:00.000Z',
      'updatedAt': '2023-04-02T00:00:00.000Z',
      'chargerStats': {
        'online': 0,
        'offline': 0,
        'faulted': 0
      }
    },
    {
      'id': '5',
      'image': 'https://themesbrand.com/velzon/html/interactive/assets/images/companies/img-6.png',
      'name': 'Quinary Depot',
      'email': 'quaternary@gmail.en',
      'country': 'Germany',
      'city': 'Berlin',
      'street': 'Unter den Linden',
      'building': '400',
      'latitude': 52.5200,
      'longitude': 13.4050,
      'timezone': 'Europe/Berlin',
      'status': EDepotStatus.Available,
      'energyLimit': 700.0,
      'createdAt': '2023-05-01T00:00:00.000Z',
      'updatedAt': '2023-05-02T00:00:00.000Z',
      'chargerStats': {
        'online': 0,
        'offline': 0,
        'faulted': 0
      }
    }];

  loadList(searchString: string): Observable<Array<TDepotListItem>> {
    return of(this.depots);
  }

  loadById(id: string): Observable<TDepotListItem> {
    return of(this.depots.find((depot) => depot.id === id) as TDepotListItem);
  }
}
