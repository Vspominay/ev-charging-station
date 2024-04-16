import { Injectable } from '@angular/core';

import { TDepot } from '../../depot/data-access/models/depot.model';

@Injectable({
  providedIn: 'root'
})
export class ChargerClientService {
  getList(depotId: TDepot['Id']) {}
}
