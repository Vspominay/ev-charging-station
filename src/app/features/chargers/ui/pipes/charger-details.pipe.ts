import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TCharger } from '@features/chargers/data-access/models/charger.model';

@Pipe({
  name: 'chargerDetails',
  standalone: true
})
export class ChargerDetailsPipe implements PipeTransform {
  private datePipe = inject(DatePipe);

  transform(charger: TCharger): Array<{ label: string, value?: string | null }> {
    return [
      { label: 'charger.details.serial-number', value: charger.chargePointSerialNumber },
      { label: 'charger.details.model', value: charger.chargePointModel },
      { label: 'charger.details.vendor', value: charger.chargePointVendor },
      {
        label: 'charger.details.firmware.update-timestamp',
        value: this.datePipe.transform(charger.firmwareUpdateTimestamp)
      },
      { label: 'charger.details.firmware.version', value: charger.firmwareVersion },
      { label: 'charger.details.iccid', value: charger.iccid },
      { label: 'charger.details.imsi', value: charger.imsi },
      { label: 'charger.details.meter.serial-number', value: charger.meterSerialNumber },
      { label: 'charger.details.meter.type', value: charger.meterType },
      { label: 'charger.details.ocpp-protocol', value: charger.ocppProtocol },
    ];
  }
}
