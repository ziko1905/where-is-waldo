function createStrFromNum(num) {
  return num > 9 ? `${num}` : `0${num}`;
}

export default function convertMSToStr(ms) {
  const milliseconds = Math.floor((ms % 1000) / 10);
  const millisecondsStr = createStrFromNum(milliseconds);

  const equationS = ms / 1000;
  const seconds = Math.floor(equationS % 60);
  const secondsStr = createStrFromNum(seconds);

  const equationM = equationS / 60;
  const minutes = Math.floor(equationM % 60);
  const minutesStr = createStrFromNum(minutes);

  const equationH = equationM / 60;
  const hours = Math.floor(equationH);
  const hoursStr = createStrFromNum(hours);

  const convertedStr = `${hoursStr}:${minutesStr}:${secondsStr}:${millisecondsStr}`;

  return convertedStr;
}

convertMSToStr(5 * 60 * 1000);
