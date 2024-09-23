import { tracks } from './data/data.js';
import { initPlayer } from './player/player.js';
import { initPlayerList } from './player/list.js';

initPlayer();
initPlayerList(tracks);