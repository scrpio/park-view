import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout'
import Home from '@/views/Dashboard/home'
import RoleList from '@/views/role/list'
import DeptList from '@/views/dept/list'
import UserList from '@/views/user/list'
import UserChangePwd from '@/views/user/changepwd'
import UserProfile from '@/views/user/profile'
import MenuList from '@/views/menu/list'
import LogList from '@/views/log/list'
import RedisLogs from '@/views/log/redisList'
import ClearCache from '@/views/sys/clearCache'
import Dict from '@/views/sys/dict'
import Register from '@/views/Register'
import ErrorPage from '@/views/404'
import MemberList from '@/views/member/list'
import RechargeList from '@/views/member/recharge'
import GarageList from '@/views/garage/list'
import CarList from '@/views/garage/car'
import RepairList from '@/views/garage/repair'
import OrderList from '@/views/order/list'

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/views/Login'], resolve)

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', component: Login, menuShow: true },
  { path: '/register', component: Register, menuShow: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    leaf: false, // 只有一个节点
    menuShow: true,
    iconCls: 'fa fa-tachometer', // 图标样式class
    children: [
      { path: '/dashboard', component: Home, name: '首页', menuShow: true }
    ]
  },
  {
    path: '/',
    component: Layout,
    menuShow: true,
    leaf: false,
    iconCls: 'fa fa-user',
    children: [
      { path: '/admin/user', component: UserList, name: '用户列表', menuShow: true },
      { path: '/admin/menu', component: MenuList, name: '菜单列表', menuShow: true },
      { path: '/admin/role', component: RoleList, name: '角色管理', menuShow: true },
      { path: '/admin/dept', component: DeptList, name: '部门管理', menuShow: true }
    ]
  },
  {
    path: '/',
    component: Layout,
    menuShow: true,
    leaf: false,
    iconCls: 'fa fa-list-alt',
    children: [
      { path: '/member/list', component: MemberList, name: '会员列表', menuShow: true },
      { path: '/member/recharge', component: RechargeList, name: '充值记录', menuShow: true }
    ]
  },
  {
    path: '/',
    component: Layout,
    menuShow: true,
    leaf: false,
    iconCls: 'fa fa-list-alt',
    children: [
      { path: '/garage/list', component: GarageList, name: '车库列表', menuShow: true },
      { path: '/garage/car', component: CarList, name: '车位管理', menuShow: true },
      { path: '/garage/repair', component: RepairList, name: '维修记录', menuShow: true }
    ]
  },
  {
    path: '/',
    component: Layout,
    menuShow: true,
    leaf: false,
    iconCls: 'fa fa-list-alt',
    children: [
      { path: '/order/list', component: OrderList, name: '订单列表', menuShow: true }
    ]
  },
  {
    path: '/',
    component: Layout,
    menuShow: true,
    leaf: true,
    iconCls: 'fa fa-pencil-square-o',
    children: [
      { path: '/monitor/log', component: LogList, name: '日志管理', menuShow: true },
      { path: '/monitor/redis', component: RedisLogs, name: 'Redis日志', menuShow: true }
    ]
  },
  {
    path: '/',
    component: Layout,
    menuShow: true,
    iconCls: 'fa fa-setting',
    children: [
      { path: '/user/profile', component: UserProfile, name: '个人信息', menuShow: true },
      { path: '/user/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true }
    ]
  },
  {
    path: '/',
    component: Layout,
    menuShow: true,
    iconCls: 'fa fa-wrench',
    children: [
      { path: '/tool/dictionary', component: Dict, name: '数据字典', menuShow: true },
      { path: '/tool/clearCache', component: ClearCache, name: '清除缓存', menuShow: true }
    ]
  },
  {
    path: '/',
    component: Layout,
    menuShow: true,
    iconCls: 'fa fa-wrench',
    children: [
      { path: '/base/register', component: Register, name: '服务注册', menuShow: true }
    ]
  },
  {
    path: '/',
    component: Layout,
    menuShow: false,
    children: [
      { path: '/404', component: ErrorPage, name: '页面不存在', menuShow: false }
    ]
  },
  { path: '*', redirect: '/404', menuShow: false }
]

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
