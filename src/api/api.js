import axios from 'axios'
import Vue from 'vue'


Vue.prototype.$axios = axios.create({
  baseURL: 'http://157.245.188.57:8081/api', 
  headers: {
    'Accept':' application/json',
    'Content-Type': 'application/json'
  }
})
// export default axios.create({
//   baseURL: 'localhost:8082/',
//     headers: {
//       'Accept':' application/json',
//       'Content-Type': 'application/json'
//     }
//   })

Vue.config.productionTip = false;
Vue.prototype.$http = axios; 
axios.defaults.timeout = 10000;
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.common["Authorization"] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 400:
         
         //do something
          break;
      
        case 401:
          alert("session expired");
          break;
        case 403:
          alert("session expired");
           break;
        case 404:
          alert('page not exist');
          break;
        case 502:
          alert("SERVER ERROR");
          break;
      }
      return Promise.reject(error.response);
    }
  }
);