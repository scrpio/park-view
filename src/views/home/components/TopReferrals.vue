<template>
  <el-card :body-style="{ padding: '0px' }">
    <div class="card-header">
      <h6>{{ title }}</h6>
    </div>
    <div class="card-body">
      <!-- Top Referrals List Group -->
      <ul class="list-referral">
        <li v-for="(item, idx) in referralData" :key="idx" :class="idx===referralData.length-1?'':'list-item'">
          <span class="text-semibold">{{ item.title }}</span>
          <span class="text-reagent-gray">{{ item.value }}</span>
        </li>
      </ul>
    </div>
    <div class="card-foot">
      <span><a>周</a></span>
      <span><a>月</a></span>
      <span><a>季度</a></span>
      <span><a>年度</a></span>
    </div>
  </el-card>
</template>

<script>
const defaultTopReferrals = [
  {
    title: 'GitHub',
    value: '19,291',
  }, {
    title: 'Stack Overflow',
    value: '11,201',
  }, {
    title: 'Hacker News',
    value: '9,291',
  }, {
    title: 'Reddit',
    value: '8,281',
  }, {
    title: 'The Next Web',
    value: '7,128',
  }, {
    title: 'Tech Crunch',
    value: '6,218',
  }, {
    title: 'YouTube',
    value: '1,218',
  }, {
    title: 'Adobe',
    value: '1,171',
  }, {
    title: 'YouTube',
    value: '1,218',
  }, {
    title: 'Adobe',
    value: '1,171',
  }
]
export default {
  name: 'ao-top-referrals',
  props: {
    //The component's title.
    title: {
      type: String,
      default: '博客Top10'
    },
    //The referral datasets.
    referralData: {
      type: Array,
      default() {
        return defaultTopReferrals
      }
    }
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
.list-referral li {
  font-size: 12px;
  padding: 10px 16px;
}
.list-item {
  border-bottom: 1px solid #e1e5eb;
}
.text-semibold {
  color: #3d5170;
  text-align: left;
}
.text-reagent-gray {
  color: #818ea3;
  margin-left: auto;
  text-align: right;
  float: right;
}
.card-foot {
  padding: 16px;
  text-align: right;
  border-top: 1px solid #e1e5eb;
}
.card-foot span {
  font-size: 15px;
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
}
.card-foot span a:hover {
  color: #66b1ff;
}
</style>
