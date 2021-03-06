/* eslint-disable func-names, prefer-arrow-callback, no-unused-vars, no-plusplus */
/* global Vue */

Vue.http.interceptors.push((request, next) => {
  Vue.activeResources = Vue.activeResources ? Vue.activeResources + 1 : 1;

  next(function (response) {
    Vue.activeResources--;
  });
});
