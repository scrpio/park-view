<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <!-- <span class="topbar-logo">
        <img src="../../assets/images/logo.png">
      </span> -->
      <span class="topbar-logotxt">
        智能车库管理系统
      </span>
      <el-dropdown class="topbar-account" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <img src="../../assets/images/avatars/0.png" class="user-avatar">
          {{ username }}
          <i class="iconfont icon-down"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <router-link to="/user/profile">
            <el-dropdown-item>个人信息</el-dropdown-item>
          </router-link>
          <router-link to="/user/changepwd">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>

    <!--中间-->
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="{showSidebar:!collapsed}">
        <!--展开折叠开关-->
        <div class="menu-toggle" @click.prevent="collapse">
          <i class="fa fa-bars" v-show="!collapsed"/>
          <i class="fa fa-bars fa-rotate-90" v-show="collapsed"/>
        </div>
        <!--导航菜单-->
        <el-menu :default-active="defaultActiveIndex" router :collapse="collapsed" @select="handleSelect">
          <template v-for="(item, index) in menus" v-if="item.menuShow">
            <el-submenu v-if="!item.leaf" :index="index+''">
              <template slot="title">
                <i :class="item.iconCls"/>
                <span slot="title">{{ item.name }}</span>
              </template>
              <el-menu-item v-for="sub in item.children" :key="sub.path" :index="sub.path" v-if="sub.menuShow" :class="$route.path==sub.path?'is-active':''">
                <i :class="sub.iconCls"/>
                <span slot="title">{{ sub.name }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path" :class="$route.path==item.children[0].path?'is-active':''">
              <i :class="item.iconCls"/>
              <span slot="title">{{ item.children[0].name }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>

      <!--右侧内容区-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view/>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>

  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import Changepwd from '@/components/Changepwd'

export default {
  components: {
    Changepwd
  },
  computed: {
    ...mapGetters([
      'avatar',
      'username'
    ])
  },
  data() {
    return {
      defaultActiveIndex: '0',
      collapsed: false,
      menus: []
    }
  },
  methods: {
    handleSelect(index) {
      this.defaultActiveIndex = index
    },
    // 折叠导航栏
    collapse() {
      this.collapsed = !this.collapsed
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  },
  mounted() {
    this.menus = JSON.parse(window.localStorage.getItem('access-menus'))
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;

  .topbar-wrap {
    height: 50px;
    line-height: 50px;
    background: #373d41;
    padding: 0px;

    .topbar-logo {
      float: left;
      width: 59px;
      line-height: 26px;
      text-align: center;
    }
    .topbar-logotxt {
      float: left;
      font-family: STCaiyun;
      font-size: 22px;
      color: #fff;
      line-height: 50px;
      margin-left: 30px;
    }
    .topbar-logo img,
    .topbar-logotxt img {
      height: 40px;
      margin-top: 5px;
      margin-left: 2px;
    }
    .topbar-account {
      color: #fff;
      float: right;
      padding-right: 12px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
      }
    }
  }
  .main {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    position: absolute;
    top: 50px;
    bottom: 0px;
    overflow: hidden;

    aside {
      min-width: 50px;
      background: #2f4050;
      &::-webkit-scrollbar {
        display: none;
      }
      &.showSidebar {
        overflow-x: hidden;
        overflow-y: auto;
      }

      .menu-toggle {
        background: #4a5064;
        text-align: center;
        color: white;
        height: 26px;
        line-height: 30px;
      }
      .el-menu {
        height: 100%; /*写给不支持calc()的浏览器*/
        height: -moz-calc(100% - 80px);
        height: -webkit-calc(100% - 80px);
        height: calc(100% - 80px);
        border-radius: 0px;
        background-color: #2f4050;
        border-right: 0px;
      }
      .el-submenu .el-menu-item {
        min-width: 60px;
      }
      .el-menu {
        width: 180px;
      }
      .el-menu--collapse {
        width: 60px;
      }
      .el-menu .el-menu-item,
      .el-submenu .el-submenu__title {
        height: 46px;
        line-height: 46px;
      }
      .el-menu-item:hover,
      .el-submenu .el-menu-item:hover,
      .el-submenu__title:hover {
        background-color: #293846;
        color: #fff;
      }
    }
  }

  .content-container {
    background: #fff;
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    padding-bottom: 1px;

    .content-wrapper {
      background-color: #fff;
      box-sizing: border-box;
    }
  }
}
</style>
