import { semantizeDate } from './timeDisplay';

describe('semantizeDate', () => {
  test('should return "今天" if the date difference is 0 and within 24 hours', () => {
    const displayTime = new Date().getTime() - 3600000;
    const result = semantizeDate(displayTime);
    expect(result).toEqual('今天');
  });

  test('should return "昨天" if the date difference is 1 and within 48 hours', () => {
    const displayTime = new Date().getTime() - 86400000 - 3600000;
    const result = semantizeDate(displayTime);
    expect(result).toEqual('昨天');
  });

  test('should return "前天" if the date difference is 2 and within 72 hours', () => {
    const displayTime = new Date().getTime() - 172800000 - 3600000;
    const result = semantizeDate(displayTime);
    expect(result).toEqual('前天');
  });

  test('should return the correct date and weekday if the date difference is more than 2 days', () => {
    const displayTime = new Date('2022-01-01T12:00:00Z').getTime();
    const result = semantizeDate(displayTime);
    expect(result).toEqual('1 / 1 (六)');
  });
});
