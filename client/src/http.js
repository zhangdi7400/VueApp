import axios from 'axios';

import { Loading } from 'element-ui';

import { Message } from 'element-ui';

import router from './router';
let loading;
function startLoading(){
    loading = Loading.service({
        lock:true,
        text:"Loading really hard",
        background:'rgba(0,0,0,7)'
    });

}

function endLoading(){
    loading.close();

}
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    startLoading();

    if(localStorage.eleToken){
      // set request header
      config.headers.Authorization = localStorage.eleToken;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
 
// Add a response interceptor
axios.interceptors.response.use(function (response) {
    endLoading();
    return response;
  }, function (error) {
      endLoading();
      Message.error(error.response.data);

      //get the error code
      const {status} = error.response;
      if(status==401){
        Message.error('Token is expired. Please login again');
        localStorage.removeItem('eleToken');
        router.push('/login');
      }
    return Promise.reject(error);
  });
export default axios;