<template>
  <el-card :body-style="{ padding: '0px' }">
    <div class="card-header">
      <h6>{{ title }}</h6>
    </div>
    <div class="card-body">
      <iframe name="weather_inc" src="http://i.tianqi.com/index.php?c=code&id=55" width="100%" height="300" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'weather',
  props: {
    title: {
      type: String,
      default: '天气预报'
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  max-height: 605px;
}
.card-header {
  font-size: 15px;
  font-weight: 500;
  padding: 16px;
  border-bottom: 1px solid #e1e5eb;
}
.card-body {
  padding: 0;
}
</style>
