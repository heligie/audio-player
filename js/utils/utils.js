const setTimeFormat = (duration) => {
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);
  seconds < 10 ? seconds = `0${seconds}` : false;
  return `${minutes}:${seconds}`;
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export { setTimeFormat, shuffle };