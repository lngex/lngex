//配置axios的全局基本路径
axios.defaults.baseURL='http://127.0.0.1:8080/'
//全局属性配置，在任意组件内可以使用this.$http获取axios对象
Vue.prototype.$http = axios

Vue.config.productionTip = false

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
    if (!data.success && data.message === "noLogin") {
        localStorage.removeItem("token")
        localStorage.removeItem("loginInfo")
        router.push({path: '/login'});
    }
    return result;
}, error => {
    Promise.reject(error);
})

let url=location.href
/* 放行被判断的url */
if(url.indexOf("/login.html")==-1 && url.indexOf("/register.html")==-1 && url.indexOf("/callback.html")==-1 && url.indexOf("/binder.html")==-1){
    /* 获取本地储存用户 */
    let user = localStorage.getItem('loginInfo');
    if(!user){
        location.href="../home/login.html"
    }
}

/**
 * 解析url获取参数对象
 * @param url
 * @returns {{}}
 */
function parseUrlParams2Obj(url){
    //获取请求参数
    let paramStr = url.substring(url.indexOf("?")+1);//code=021FdXFa14mYlA016OGa1L3R4X0FdXFO&state=1
    let paramStrs = paramStr.split("&");//[code=021FdXFa14mYlA016OGa1L3R4X0FdXFO,state=1]
    let paramObj = {};
    for(let i=0;i<paramStrs.length;i++){
        let paramName = paramStrs[i].split("=")[0];//code
        let paramValue = paramStrs[i].split("=")[1];//021FdXFa14mYlA016OGa1L3R4X0FdXFO
        paramObj[paramName] = paramValue;
    }
    return paramObj;
}