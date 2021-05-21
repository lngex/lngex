import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

/*  廖建波 */
import Department from './views/org/department.vue'
import Employee from './views/org/employee.vue'
import Shop from './views/org/shop.vue'
import User from './views/org/user.vue'
import Systemdictionarydetail from './views/system/systemdictionarydetail.vue'
import Systemdictionarytype from './views/system/systemdictionarytype.vue'
import ShopRegister from './views/shopregister.vue'
/*=============================================*/

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/shopregister',
        component: ShopRegister,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        leaf: true,
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '部门和组织机构',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/department', component: Department, name: '部门管理' },
            { path: '/employee', component: Employee, name: '员工管理' },
            { path: '/shop', component: Shop, name: '商家入驻' },
            { path: '/user', component: User, name: '用户管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/systemdictionarytype', component: Systemdictionarytype, name: '数据词典类型' },
            { path: '/systemdictionarydetail', component: Systemdictionarydetail, name: '数据字典' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },

    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;