import 'normalize.css';
import './sass/swiper.scss';
import './sass/lazy.scss';
import './sass/index.scss';

const Swiper = require('./swiper.min');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js')
  });
}