import { numberAttribute } from '@angular/core';
import { TDepotListItem } from '@features/depot/data-access/models/depot.model';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const getCurrentInterval = ({ energyConsumptionSettings, energyLimit }: TDepotListItem) => {
  const todayUtc = dayjs().utc();

  const defaultInterval = {
    energyLimit: numberAttribute(energyLimit, 0),
    startTime: todayUtc.clone().startOf('day'),
    endTime: todayUtc.clone().endOf('day')
  };

  if (!energyConsumptionSettings) {
    return defaultInterval;
  }

  const { intervals } = energyConsumptionSettings;
  return intervals.find(({ startTime, endTime }) => {
    const start = dayjs(startTime);
    const end = dayjs(endTime);

    return todayUtc.isAfter(start) && todayUtc.isBefore(end);
  });
};
