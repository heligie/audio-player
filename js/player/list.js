import { setTimeFormat } from '../utils/utils.js';
import { initPlayer } from './player.js';

const template = document.querySelector('#track').content.querySelector('.player__item');
const fragment = document.createDocumentFragment();
const container = document.querySelector('.player__list');
const openListButton = document.querySelector('.player__button--list');
const player = document.querySelector('.player');

const createTrack = (track) => {
  const newTrack = template.cloneNode(true);
  newTrack.querySelector('.player__name').textContent = track.title;
  newTrack.querySelector('.player__album').textContent = track.musician;
  newTrack.querySelector('.player__preview-cover').src = track.cover;
  const audio = newTrack.querySelector('.player__audio');
  audio.src = track.audio;

  newTrack.addEventListener('click', (evt) => {
    evt.preventDefault();
    initPlayer(track);
  });

  fragment.append(newTrack);
};

const setDuration = () => {
  const tracks = container.querySelectorAll('.player__item');
  tracks.forEach((item) => {
    const audio = item.querySelector('.player__audio');
    audio.addEventListener('loadedmetadata', () => {
      const duration = setTimeFormat(audio.duration);
      item.querySelector('.player__time').textContent = duration;
    });
  });
};

const renderTracks = (tracks) => {
  tracks.forEach((track) => createTrack(track));
  container.append(fragment);
  setDuration();
};

const initPlayerList = (tracks) => {
  openListButton.addEventListener('click', () => player.classList.toggle('list-open'));
  renderTracks(tracks);
};

export { initPlayerList };