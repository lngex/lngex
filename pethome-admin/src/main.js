import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
/*    廖建波          */
import axios from 'axios'
//配置axios的全局基本路径
axios.defaults.baseURL = 'http://127.0.0.1:8080/'
//全局属性配置，在任意组件内可以使用this.$http获取axios对象
Vue.prototype.$http = axios

 /* 配置axios前置拦截器 */
/* 将所有axios头中放入token */
axios.interceptors.request.use(config => {
    /* 获取localStorage中的token */
    let token = localStorage.getItem("token");
    if (token) {
        /* 加入请求头 */
        config.headers['token'] = token;
    }
    return config;
}, error => {
    Promise.reject(error);
});

/* 配置axios后置拦截器 */
axios.interceptors.response.use(result => {
    let data = result.data;
    if (!data.success && data.message === "noLogin")
        router.push({path: '/login'});
    return result;
}, error => {
    Promise.reject(error);
})




Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    routes
})

/* 前端登录拦截器*/
router.beforeEach((to, from, next) => {
    /* 公共资源 放行/login， /shopregister */
    if (to.path === '/login' || to.path === '/shopregister') {
        /* 清除本地储存的token和对象 */
        localStorage.removeItem('token');
        localStorage.removeItem('loginInfo');
        next();
    } else {
        /* 非公共资源 */
        let user = localStorage.getItem('loginInfo');
        /* 判断用户是否为空，空则拦截并跳转，非空则放行 */
        if (!user) {
            next({path: '/login'})
        } else {
            next()
        }
    }
})
/*router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})*/

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')

