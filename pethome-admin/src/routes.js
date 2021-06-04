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
import Product from './views/product/product.vue'
import ShopRegister from './views/shopregister.vue'
import SearchMasterMsgProcessed from './views/pet/SearchMasterMsgProcessed.vue'
import SearchMasterMsgPending from './views/pet/SearchMasterMsgPending.vue'
import Pet from './views/pet/pet.vue'
import PetType from './views/pet/petType.vue'
import ProductOrder from './views/order/product.vue'
import PetOrder from './views/order/pet.vue'
import Acquisition from './views/order/acquisition.vue'
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
        name: '产品管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/product', component: Product, name: '服务管理' }
        ]
    },
{
        path: '/',
        component: Home,
        name: '宠物管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/SearchMasterMsgProcessed', component: SearchMasterMsgProcessed, name: '已处理' },
            { path: '/SearchMasterMsgPending', component: SearchMasterMsgPending, name: '未处理' },
            { path: '/Pet', component: Pet, name: '宠物管理' },
            { path: '/PetType', component: PetType, name: '宠物类型管理' }
        ]
    },
{
        path: '/',
        component: Home,
        name: '订单管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/ProductOrder', component: ProductOrder, name: '服务订单' },
            { path: '/PetOrder', component: PetOrder, name: '宠物订单' },
            { path: '/acquisition', component: Acquisition, name: '收购订单' }
        ]
    },

    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;