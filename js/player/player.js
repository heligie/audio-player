import { setTimeFormat, shuffle } from '../utils/utils.js';
import { tracks } from '../data/data.js';

const player = document.querySelector('.player');
const song = document.querySelector('#song');
const cover = document.querySelector('.player__image');
const title = document.querySelector('.player__title');
const musician = document.querySelector('.player__musician');
const duration = document.querySelector('.duration-time');
const time = document.querySelector('.current-time');
const range = document.querySelector('.player__range');
const input = document.querySelector('.player__input');
const startButton = document.querySelector('.control--main');
const backButton = document.querySelector('.custom-mark--left');
const nextButton = document.querySelector('.custom-mark--right');
const soundButton = document.querySelector('.player__button--sound');
const repeatButton = document.querySelector('.button--repeat');
const shuffleButton = document.querySelector('.button--shuffle');

const songs = [...tracks];
let shuffledSongs = [];

let isPlay = false;
let isSoundOff = false;
let isRepeat = false;
let isShuffle = false;
let currentIndex = 0;

const shuffleSongs = () => {
  shuffledSongs = shuffle([...tracks]);
};

const playAudio = () => {
  song.play();
  isPlay = true;
  player.classList.add('stop');
};

const pauseAudio = () => {
  song.pause();
  isPlay = false;
  player.classList.remove('stop');
};

const checkDuplicatedSong = (index) => {
  const notFirstIndex = index !== 0;
  const firstIndex = index === 0;
  const notLastIndex = index !== songs.length - 1;
  const lastIndex = index === songs.length - 1;
  const currentIndex = index < songs.length - 1;

  const firstCondition = lastIndex && songs[index].title === shuffledSongs[0].title;
  const secondCondition = firstIndex && songs[index].title === shuffledSongs[songs.length - 1].title;
  const thirdCondition = !isShuffle && currentIndex && notLastIndex && songs[index].title === shuffledSongs[index + 1].title;
  const fourthCondition = !isShuffle && currentIndex && notFirstIndex && songs[index].title === shuffledSongs[index - 1].title;
  const fifthCondition = isShuffle && currentIndex && notLastIndex && shuffledSongs[index].title === songs[index + 1].title;
  const sixthCondition = isShuffle && currentIndex && notFirstIndex && shuffledSongs[index].title === songs[index - 1].title;

  if (firstCondition) shuffleSongs();
  if (secondCondition) shuffleSongs();
  if (thirdCondition) shuffleSongs();
  if (fourthCondition) shuffleSongs();
  if (fifthCondition) shuffleSongs();
  if (sixthCondition) shuffleSongs();
};

const fillTrackInfo = (track) => {
  song.src = track.audio;
  cover.src = track.cover;
  title.textContent = track.title;
  musician.textContent = track.musician;

  song.addEventListener('loadedmetadata', () => {
    input.max = song.duration;
    duration.textContent = setTimeFormat(song.duration);
  });
};

const updateTrackInfo = (updateIndex, fromList = false) => {
  checkDuplicatedSong(updateIndex);

  let array;

  if (fromList) {
    array = songs;
  } else {
    array = isShuffle ? shuffledSongs : songs;
  }

  fillTrackInfo(array[updateIndex]);
  playAudio();
};

const onSongSuspend = () => {
  range.style.setProperty('--progress-width', `${0}%`);
};

const onSongTimeupdate = () => {
  let currentTime = Math.floor(song.currentTime);
  input.value = currentTime;
  let progressWidth = currentTime / song.duration * 100;
  range.style.setProperty('--progress-width', `${progressWidth}%`);

  time.textContent = setTimeFormat(song.currentTime);
};

const onSongEnded = () => {
  if (isRepeat) {
    return;
  }

  currentIndex < songs.length - 1 ? currentIndex++ : currentIndex = 0;
  updateTrackInfo(currentIndex);
};

const inputInputHandler = (evt) => {
  song.currentTime = evt.target.value;
  pauseAudio();
};

const inputChangeHandler = () => playAudio();

const inputTouchstartHandler = () => pauseAudio();

const inputTouchmoveHandler = (evt) => song.currentTime = evt.target.value;

const inputTouchendHandler = () => playAudio();

const repeatButtonClickHandler = () => {
  repeatButton.classList.toggle('active');
  isRepeat ? isRepeat = false : isRepeat = true;
  isRepeat ? song.setAttribute('loop', true) : song.removeAttribute('loop');
};

const shuffleButtonClickHandler = () => {
  shuffleButton.classList.toggle('active');
  isShuffle ? isShuffle = false : isShuffle = true;
};

const startButtonClickHandler = () => {
  if (isPlay) {
    pauseAudio();
    return;
  }

  playAudio();
};

const backButtonClickHandler = () => {
  while (currentIndex > 0) {
    currentIndex--;
    updateTrackInfo(currentIndex);
    return;
  }

  if (currentIndex === 0) {
    currentIndex = songs.length - 1;
    updateTrackInfo(currentIndex);
  }
};

const nextButtonClickHandler = () => {
  while (currentIndex >= 0 && currentIndex < songs.length - 1) {
    currentIndex++;
    updateTrackInfo(currentIndex);
    return;
  }

  if (currentIndex === songs.length - 1) {
    currentIndex = 0;
    updateTrackInfo(currentIndex);
  }
};

const soundButtonClickHandler = () => {
  player.classList.toggle('sound-off');

  if (isSoundOff) {
    isSoundOff = false;
    song.muted = false;
  } else {
    isSoundOff = true;
    song.muted = true;
  }
};

const setEventHandlers = () => {
  song.addEventListener('suspend', onSongSuspend);
  song.addEventListener('timeupdate', onSongTimeupdate);
  song.addEventListener('ended', onSongEnded);
  input.addEventListener('input', inputInputHandler);
  input.addEventListener('change', inputChangeHandler);
  input.addEventListener('touchstart', inputTouchstartHandler);
  input.addEventListener('touchmove', inputTouchmoveHandler);
  input.addEventListener('touchend', inputTouchendHandler);
  repeatButton.addEventListener('click', repeatButtonClickHandler);
  shuffleButton.addEventListener('click', shuffleButtonClickHandler);
  startButton.addEventListener('click', startButtonClickHandler);
  backButton.addEventListener('click', backButtonClickHandler);
  nextButton.addEventListener('click', nextButtonClickHandler);
  soundButton.addEventListener('click', soundButtonClickHandler);
};

const initPlayer = (track) => {
  shuffleSongs();
  fillTrackInfo(songs[currentIndex]);
  setEventHandlers();

  if (track) {
    songs.filter((item, index) => {
      if (item.title === track.title) return currentIndex = index;
    });

    updateTrackInfo(currentIndex, true);
  }
};

export { initPlayer };