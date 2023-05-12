const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

export const semantizeDate = (displayTime: number) => {
  const today = new Date();
  const time = new Date(displayTime);
  const dateDiff = today.getDate() - time.getDate();
  const secondDiff = Math.abs(today.getTime() - time.getTime()) / 1000;

  if (dateDiff === 0 && secondDiff <= 86400) {
    return '今天';
  } else if (dateDiff === 1 && secondDiff <= 86400 * 2) {
    return '昨天';
  } else if (dateDiff === 2 && secondDiff <= 86400 * 3) {
    return '前天';
  } else {
    return `${time.getMonth() + 1} / ${time.getDate()} (${
      weekdays[time.getDay()]
    })`;
  }
};
