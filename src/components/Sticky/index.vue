<template>
  <div class="header_sticky">
    <div :class="className">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sticky',
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    randomId() {
      return 'randomId_' + Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36)
    },
    targetElement_() {
      return this.$el
    }
  },
  methods: {
    sticky_(css='sticky_') {
      if (CSS.supports('position', 'sticky') || CSS.supports('position', '-webkit-sticky')) {
      } else {
        var newNodeTop
        var header = this.targetElement_
        if(document.getElementById(this.randomId)) {
          newNodeTop = document.getElementById(this.randomId)
        }else{
          newNodeTop = document.createElement('div')
          ewNodeTop.id = this.randomId
          header.parentNode.insertBefore(newNodeTop, header)
          header.classList.add(css)
        }

        setTimeout(() => {
          var height = header.offsetHeight + 1 // 高度 + 1 以防有小数点
          newNodeTop.style.height = height + 'px'
        }, 0)
      }
    }
  }
}
</script>

<style>
.header_sticky {
  width: 100%;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 100;
  transition: height 1s;
  -moz-transition: height 1s;
  -webkit-transition: height 1s;
  -o-transition: height 1s;
}

.sticky_ {
  width: 100%;
  position: fixed;
  position: -webkit-fixed;
  top: 0;
  z-index: 100;
}
</style>
