import 'babel-polyfill';
import fastclick from 'fastclick';
import Vue from 'vue';
import App from './App';
import router from './router';
import vueLazyLoad from 'vue-lazyload';

import store from './store/index.js';

import './common/style/index.scss';

Vue.config.productionTip = false;

fastclick.attach(document.body);

Vue.use(vueLazyLoad,{
  loading:require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
