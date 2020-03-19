import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import VueParticles from 'vue-particles'
import VueQuillEditor from 'vue-quill-editor'
import VueI18n from 'vue-i18n'

import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import '@/assets/iconfont.css'
import '@/assets/styles/main.scss'
import '@/assets/styles/reset.css'
import '@/assets/css/font-awesome.min.css'

import '@/permission'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueParticles) // 粒子特效
Vue.use(VueQuillEditor) // 富文本插件
Vue.use(VueI18n) // 语言插件

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

// 权限指令
Vue.directive('has', {
  bind: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})

// 权限检查方法
Vue.prototype.$_has = function(value) {
  var isExist = false
  var buttonpermsStr = localStorage.getItem('access-perms')
  if(buttonpermsStr === undefined || buttonpermsStr === null){
    return false
  }
  var buttonperms = JSON.parse(buttonpermsStr)
  for(var i = 0; i < buttonperms.length; i++){
    if(buttonperms[i].indexOf(value) > -1){
      isExist = true
      break
    }
  }
  return isExist
}

