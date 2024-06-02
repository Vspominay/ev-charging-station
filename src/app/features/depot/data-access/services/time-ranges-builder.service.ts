import { Injectable, numberAttribute } from '@angular/core';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(minMax);

export interface TTimeRange {
  startTime: dayjs.Dayjs;
  finishTime: dayjs.Dayjs;
  power: number;
}

export const logReadableIntervals = (intervals: TTimeRange[]): void => {
  const formattedIntervals = intervals.map(({ startTime, finishTime, power }) => ({
    startTime: startTime.format('MM-DD HH:mm:ss'),
    finishTime: finishTime.format('MM-DD HH:mm:ss'),
    power
  }));

  console.log(formattedIntervals);
};

@Injectable({
  providedIn: 'root'
})
export class TimeRangesBuilderService {
  processTimeRanges(
    intervals: TTimeRange[],
    depotConfig: TTimeRange
  ): TTimeRange[] {
    const isEmpty = intervals.length === 0;
    if (isEmpty) {
      return [depotConfig];
    }

    const ranges = intervals.map((range) => {
      return {
        startTime: this.updateTimeAccordingDepotConfig(range.startTime, depotConfig),
        finishTime: this.updateTimeAccordingDepotConfig(range.finishTime, depotConfig),
        power: numberAttribute(range.power, 0),
      };
    });

    const fixedOverlaps = this.fixOverlappingIntervals(ranges, depotConfig);
    const filledTimeRanges = this.fillGaps(fixedOverlaps, depotConfig);
    const mergedIntervals = this.mergeAdjacentIntervals(filledTimeRanges, depotConfig);

    return mergedIntervals;
  }

  private updateTimeAccordingDepotConfig(
    time: dayjs.Dayjs,
    depotConfig: TTimeRange
  ): dayjs.Dayjs {
    if (time.isBefore(depotConfig.startTime)) {
      return depotConfig.startTime.clone();
    } else if (time.isAfter(depotConfig.finishTime)) {
      return depotConfig.finishTime.clone();
    } else {
      return time.clone();
    }
  }

  private fixOverlappingIntervals(
    intervals: TTimeRange[],
    depotConfig: TTimeRange
  ): TTimeRange[] {
    const highestPriorityInterval = intervals[intervals.length - 1];
    const otherIntervals = intervals.slice(0, intervals.length - 1);

    const fixedIntervals: TTimeRange[] = [];

    for (const range of otherIntervals) {
      // Check if current range overlaps with the highestPriorityInterval and split if necessary
      if (
        range.startTime.isBefore(highestPriorityInterval.finishTime) &&
        isSameOrAfter(range.finishTime, highestPriorityInterval.startTime)
      ) {
        if (range.startTime.isBefore(highestPriorityInterval.startTime)) {
          fixedIntervals.push({
            startTime: range.startTime,
            finishTime: this.updateTimeAccordingDepotConfig(highestPriorityInterval.startTime.clone().subtract(1, 'seconds'), depotConfig),
            power: Number(range.power)
          });
        }

        if (range.finishTime.isAfter(highestPriorityInterval.finishTime)) {
          fixedIntervals.push({
            startTime: this.updateTimeAccordingDepotConfig(highestPriorityInterval.finishTime.clone().add(1, 'seconds'), depotConfig),
            finishTime: range.finishTime.clone(),
            power: Number(range.power)
          });
        }
      } else {
        fixedIntervals.push(range);
      }
    }

    // Add the highestPriorityInterval
    fixedIntervals.push(highestPriorityInterval);

    // Sort the intervals by startTime
    fixedIntervals.sort((a, b) => {
      if (a.startTime.isBefore(b.startTime)) {
        return -1;
      } else if (a.startTime.isAfter(b.startTime)) {
        return 1;
      } else {
        return 0;
      }
    });

    // Fix adjacent intervals where end of first interval is the start of the next interval
    for (let i = 0; i < fixedIntervals.length - 1; i++) {
      if (
        fixedIntervals[i].finishTime.isSame(
          fixedIntervals[i + 1].startTime,
          'seconds'
        )
      ) {
        fixedIntervals[i + 1].startTime = this.updateTimeAccordingDepotConfig(fixedIntervals[i + 1].startTime
                                                                                                   .clone()
                                                                                                   .add(1, 'seconds'), depotConfig);
      }
    }

    return fixedIntervals;
  }

  private fillGaps(
    intervals: TTimeRange[],
    depotConfig: TTimeRange
  ): TTimeRange[] {
    const filledTimeRanges: TTimeRange[] = [];

    const startTime = depotConfig.startTime.clone();
    const endTime = depotConfig.finishTime.clone();

    const defaultPower = depotConfig.power;
    let previousFinishTime = depotConfig.startTime.clone();

    for (const range of intervals) {
      if (range.startTime.isAfter(previousFinishTime)) {
        filledTimeRanges.push({
          startTime: previousFinishTime.isSame(startTime, 'seconds')
            ? previousFinishTime
            : this.updateTimeAccordingDepotConfig(previousFinishTime.add(1, 'seconds'), depotConfig),
          finishTime: this.updateTimeAccordingDepotConfig(range.startTime.clone().subtract(1, 'seconds'), depotConfig),
          power: defaultPower
        });
      }
      filledTimeRanges.push(range);
      previousFinishTime = range.finishTime.clone();
    }

    if (previousFinishTime.isBefore(endTime)) {
      filledTimeRanges.push({
        startTime: previousFinishTime.isSame(startTime, 'seconds')
          ? previousFinishTime
          : this.updateTimeAccordingDepotConfig(previousFinishTime.add(1, 'seconds'), depotConfig),
        finishTime: endTime,
        power: defaultPower
      });
    }

    return filledTimeRanges.filter(({ startTime, finishTime }) =>
      finishTime.isAfter(startTime)
    );
  }

  private mergeAdjacentIntervals(
    intervals: TTimeRange[],
    depotConfig: TTimeRange
  ): TTimeRange[] {
    const mergedTimeRanges: TTimeRange[] = [];
    let currentRange: TTimeRange | null = null;

    for (const range of intervals) {
      if (!currentRange) {
        currentRange = range;
        continue;
      }

      const isAdjacentAndSamePower =
        isSameOrAfter(currentRange.finishTime
                                  .clone()
                                  .add(1, 'seconds'), range.startTime, 'seconds') &&
        Number(currentRange.power) === Number(range.power);

      if (isAdjacentAndSamePower) {
        currentRange.finishTime = this.updateTimeAccordingDepotConfig(dayjs.max(
          currentRange.finishTime,
          range.finishTime
        )!, depotConfig);
      } else {
        if (
          isSameOrAfter(currentRange.finishTime, range.startTime, 'seconds') &&
          currentRange.power !== range.power
        ) {
          currentRange.finishTime = this.updateTimeAccordingDepotConfig(range.startTime.clone().subtract(1, 'seconds'), depotConfig);
        } else {
          mergedTimeRanges.push(currentRange);
        }
        currentRange = range;
      }
    }

    if (currentRange) {
      mergedTimeRanges.push(currentRange);
    }

    return mergedTimeRanges;
  }
}

export const isSameOrAfter = (a: dayjs.Dayjs, b: dayjs.Dayjs, unit?: dayjs.OpUnitType): boolean => {
  return a.isSame(b, unit) || a.isAfter(b, unit);
};
