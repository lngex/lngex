//配置axios的全局基本路径
axios.defaults.baseURL='http://127.0.0.1:8080/'
//全局属性配置，在任意组件内可以使用this.$http获取axios对象
Vue.prototype.$http = axios

Vue.config.productionTip = false

