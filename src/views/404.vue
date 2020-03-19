<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-main">
      <h1 class="header">页面不存在</h1>
      <div class="content">
        <img src="../assets/images/owl.gif" alt="owl" class="owl"/>
        <h2 class="main-title">404</h2>
      </div>
      <p class="footer">无法找到您正在寻找的页面。</p>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'error'
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.warp {
  text-align: center;
}
.warp-main {
  padding: 10% 0;
}
.header {
  font-size: 50px;
  margin: 50px auto 100px;
}
.main-title {
  display: inline-block;
  line-height: 222px;
  font-weight: 700;
  font-size: 230px;
  font-family: 'Poiret One', cursive;
}
.footer {
  margin: 50px auto;
  font-size: 16px;
  color: #f15f22;
}
</style>
