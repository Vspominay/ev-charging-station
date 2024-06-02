import dayjs from 'dayjs';
import { TimeRangesBuilderService, TTimeRange } from './time-ranges-builder.service';

describe('TimeRangesBuilderService', () => {
  let service: TimeRangesBuilderService;
  const readableFormat = 'YYYY-MM-DD HH:mm:ss';

  const buildTimeRange = (startTime: string, finishTime: string, power: number) => ({
    startTime: dayjs(startTime, readableFormat),
    finishTime: dayjs(finishTime, readableFormat),
    power
  });

  const expectTimeRange = (actual: TTimeRange, expected: TTimeRange) => {
    expect(actual.startTime.format()).toBe(expected.startTime.format());
    expect(actual.finishTime.format()).toBe(expected.finishTime.format());
    expect(actual.power).toBe(expected.power);
  };

  const expectIntervals = (actual: Array<TTimeRange>, expected: Array<TTimeRange>) => {
    expect(actual.length).toBe(expected.length);

    expected.forEach((expected, index) => {
      expectTimeRange(actual[index], expected);
    });
  };

  const defaultPower = 100;
  const depotRestrictions = buildTimeRange('2024-01-01 00:00:00', '2024-01-10 23:59:59', defaultPower);

  beforeEach(() => {
    service = new TimeRangesBuilderService();
  });

  it('creates successfully', () => {
    expect(service).toBeTruthy();
  });

  it('returns depot restrictions when no time ranges', () => {
    const result = service.processTimeRanges([], depotRestrictions);

    expectIntervals(result, [depotRestrictions]);
  });

  it('process inserting time range at the middle', () => {
    const existingRange = { ...depotRestrictions };
    const newRange = buildTimeRange('2024-01-02 00:00:00', '2024-01-03 00:00:00', 50);

    const result = service.processTimeRanges([existingRange, newRange], depotRestrictions);
    const expectedRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-01 23:59:59', defaultPower),
      buildTimeRange('2024-01-02 00:00:00', '2024-01-03 00:00:00', 50),
      buildTimeRange('2024-01-03 00:00:01', '2024-01-10 23:59:59', defaultPower),
    ];

    expectIntervals(result, expectedRanges);
  });

  it('process inserting time range at the end', () => {
    const existingRange = { ...depotRestrictions };
    const newRange = buildTimeRange('2024-01-10 00:00:00', '2024-01-11 00:00:00', 50);

    const result = service.processTimeRanges([existingRange, newRange], depotRestrictions);
    const expectedRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-09 23:59:59', defaultPower),
      buildTimeRange('2024-01-10 00:00:00', '2024-01-10 23:59:59', 50),
    ];

    expectIntervals(result, expectedRanges);
  });

  it('process inserting time range at the start', () => {
    const existingRange = { ...depotRestrictions };
    const newRange = buildTimeRange('2023-12-31 00:00:00', '2024-01-02 00:00:00', 50);

    const result = service.processTimeRanges([existingRange, newRange], depotRestrictions);
    const expectedRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-02 00:00:00', 50),
      buildTimeRange('2024-01-02 00:00:01', '2024-01-10 23:59:59', defaultPower),
    ];

    expectIntervals(result, expectedRanges);
  });

  it('process inserting time range at the middle with full 1 interval overlapping', () => {
    const timeRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-02 00:00:00', 50),
      buildTimeRange('2024-01-02 00:00:01', '2024-01-03 00:00:00', 75),
      buildTimeRange('2024-01-03 00:00:01', '2024-01-10 23:59:59', 0),
    ];
    const newRange = buildTimeRange('2024-01-01 14:00:00', '2024-01-04 14:00:00', 66);

    const result = service.processTimeRanges([...timeRanges, newRange], depotRestrictions);
    const expectedRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-01 13:59:59', 50),
      buildTimeRange('2024-01-01 14:00:00', '2024-01-04 14:00:00', 66),
      buildTimeRange('2024-01-04 14:00:01', '2024-01-10 23:59:59', 0),
    ];

    expectIntervals(result, expectedRanges);
  });

  it('process inserting time range at the middle with full partial overlapping', () => {
    const timeRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-02 00:00:00', 50),
      buildTimeRange('2024-01-02 00:00:01', '2024-01-03 00:00:00', 75),
      buildTimeRange('2024-01-03 00:00:01', '2024-01-10 23:59:59', 0),
    ];
    const newRange = buildTimeRange('2024-01-01 14:00:00', '2024-01-02 14:00:00', 66);

    const result = service.processTimeRanges([...timeRanges, newRange], depotRestrictions);
    const expectedRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-01 13:59:59', 50),
      buildTimeRange('2024-01-01 14:00:00', '2024-01-02 14:00:00', 66),
      buildTimeRange('2024-01-02 14:00:01', '2024-01-03 00:00:00', 75),
      buildTimeRange('2024-01-03 00:00:01', '2024-01-10 23:59:59', 0),
    ];

    expectIntervals(result, expectedRanges);
  });

  it('process inserting time range at the middle fully overlapping 2 intervals', () => {
    const timeRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-02 00:00:00', 50), // partial overlap
      buildTimeRange('2024-01-02 00:00:01', '2024-01-03 00:00:00', 75), // full overlap
      buildTimeRange('2024-01-03 00:00:01', '2024-01-03 15:00:00', 0), // full overlap
      buildTimeRange('2024-01-03 15:00:01', '2024-01-04 23:59:59', 10), // partial overlap
      buildTimeRange('2024-01-05 00:00:00', '2024-01-10 23:59:59', 0),
    ];
    const newRange = buildTimeRange('2024-01-01 14:00:00', '2024-01-04 14:00:00', 66);

    const result = service.processTimeRanges([...timeRanges, newRange], depotRestrictions);
    const expectedRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-01 13:59:59', 50),
      buildTimeRange('2024-01-01 14:00:00', '2024-01-04 14:00:00', 66),
      buildTimeRange('2024-01-04 14:00:01', '2024-01-04 23:59:59', 10),
      buildTimeRange('2024-01-05 00:00:00', '2024-01-10 23:59:59', 0),
    ];

    expectIntervals(result, expectedRanges);
  });

  it('process inserting splitting the 1st time range', () => {
    const timeRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-02 00:00:00', 50), // partial
      buildTimeRange('2024-01-02 00:00:01', '2024-01-03 00:00:00', 75),
      buildTimeRange('2024-01-03 00:00:01', '2024-01-10 23:59:59', 0),
    ];
    const newRange = buildTimeRange('2024-01-01 14:00:00', '2024-01-01 20:00:00', 66);

    const result = service.processTimeRanges([...timeRanges, newRange], depotRestrictions);
    const expectedRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-01 13:59:59', 50), // 1st part
      buildTimeRange('2024-01-01 14:00:00', '2024-01-01 20:00:00', 66), // new interval
      buildTimeRange('2024-01-01 20:00:01', '2024-01-02 00:00:00', 50), // 2nd part
      buildTimeRange('2024-01-02 00:00:01', '2024-01-03 00:00:00', 75),
      buildTimeRange('2024-01-03 00:00:01', '2024-01-10 23:59:59', 0),
    ];

    expectIntervals(result, expectedRanges);
  });

  it('process inserting splitting the last time range', () => {
    const timeRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-02 00:00:00', 50),
      buildTimeRange('2024-01-02 00:00:01', '2024-01-03 00:00:00', 75),
      buildTimeRange('2024-01-03 00:00:01', '2024-01-10 23:59:59', 0), // partial
    ];
    const newRange = buildTimeRange('2024-01-03 14:00:00', '2024-01-04 20:00:00', 66);

    const result = service.processTimeRanges([...timeRanges, newRange], depotRestrictions);
    const expectedRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-02 00:00:00', 50),
      buildTimeRange('2024-01-02 00:00:01', '2024-01-03 00:00:00', 75),
      buildTimeRange('2024-01-03 00:00:01', '2024-01-03 13:59:59', 0), // 1st part
      buildTimeRange('2024-01-03 14:00:00', '2024-01-04 20:00:00', 66), // new interval
      buildTimeRange('2024-01-04 20:00:01', '2024-01-10 23:59:59', 0), // 2nd part
    ];

    expectIntervals(result, expectedRanges);
  });

  it('process inserting at the middle with the start value as the previous interval finish value', () => {
    const timeRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-02 00:00:00', 50), // overlap finish
      buildTimeRange('2024-01-02 00:00:01', '2024-01-03 00:00:00', 75), // overlap start
      buildTimeRange('2024-01-03 00:00:01', '2024-01-10 23:59:59', 0),
      buildTimeRange('2024-01-03 00:00:00', '2024-01-04 00:00:00', 100),
    ];
    const newRange = buildTimeRange('2024-01-02 00:00:00', '2024-01-02 14:00:00', 66);

    const result = service.processTimeRanges([...timeRanges, newRange], depotRestrictions);
    const expectedRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-01 23:59:59', 50), // cut 1s finish
      buildTimeRange('2024-01-02 00:00:00', '2024-01-02 14:00:00', 66), // new interval
      buildTimeRange('2024-01-02 14:00:01', '2024-01-03 00:00:00', 75), // cut 2s start
      buildTimeRange('2024-01-03 00:00:01', '2024-01-10 23:59:59', 0),
    ];

    expectIntervals(result, expectedRanges);
  });

  it('process inserting at the middle with the finish value as the next interval start value', () => {
    const timeRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-02 00:00:00', 50),
      buildTimeRange('2024-01-02 00:00:01', '2024-01-03 00:00:00', 75), // partial overlap
      buildTimeRange('2024-01-03 00:00:01', '2024-01-05 23:59:59', 10), // partial overlap
      buildTimeRange('2024-01-06 00:00:00', '2024-01-10 23:59:59', 0),
    ];
    const newRange = buildTimeRange('2024-01-02 14:00:00', '2024-01-03 00:00:01', 66);

    const result = service.processTimeRanges([...timeRanges, newRange], depotRestrictions);
    const expectedRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-02 00:00:00', 50),
      buildTimeRange('2024-01-02 00:00:01', '2024-01-02 13:59:59', 75), // 1st part
      buildTimeRange('2024-01-02 14:00:00', '2024-01-03 00:00:01', 66),
      buildTimeRange('2024-01-03 00:00:02', '2024-01-05 23:59:59', 10), // 2nd part
      buildTimeRange('2024-01-06 00:00:00', '2024-01-10 23:59:59', 0),
    ];

    expectIntervals(result, expectedRanges);
  });

  it('process same power merging', () => {
    const timeRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-02 00:00:00', 50),
      buildTimeRange('2024-01-02 00:00:01', '2024-01-03 00:00:00', 10),
      buildTimeRange('2024-01-03 00:00:01', '2024-01-10 23:59:59', 50),
    ];
    const newRange = buildTimeRange('2024-01-00 14:00:00', '2024-01-05 00:00:01', 50);

    const result = service.processTimeRanges([...timeRanges, newRange], depotRestrictions);
    const expectedRanges = [
      buildTimeRange('2024-01-01 00:00:00', '2024-01-10 23:59:59', 50),
    ];

    expectIntervals(result, expectedRanges);
  });
});
