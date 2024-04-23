import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base-crud.service';
import { TOcppTag } from '@features/ocpp-tags/data-access/models/ocpp-tag.model';

@Injectable({
  providedIn: 'root'
})
export class OcppTagClientService extends BaseCrudService<TOcppTag, any> {
  readonly domain = 'OcppTag';
}
