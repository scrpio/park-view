<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col class="wrap-main">
      <el-row :gutter="10">
        <el-col :sm="6" :md="6" :lg="6" v-for="(stats, idx) in smallStats" :key="idx">
          <small-stats :class-name="`small-stats-${idx}`" variation="1" :chart-data="stats.datasets" :label="stats.label" :value="stats.value" :percentage="stats.percentage" :increase="stats.increase" :decrease="stats.decrease" />
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :sm="24" :md="24" :lg="16">
          <line-chart />
        </el-col>
        <el-col :sm="24" :md="24" :lg="8">
          <pie-chart />
        </el-col>
      </el-row>
      
      <el-row :gutter="10">
        <el-col :sm="24" :md="24" :lg="7">
          <weather />
        </el-col>
        <el-col :sm="24" :md="24" :lg="10">
          <discussions @approve="handleApprove" @reject="handleReject" @edit="handleEdit" @view-all-comments="handleViewAllComments" />
        </el-col>
        <el-col :sm="24" :md="24" :lg="7">
          <top-referrals />
        </el-col>
      </el-row>
      
    </el-col>
  </el-row>
</template>

<script>
import SmallStats from './components/SmallStats'
import TopReferrals from './components/TopReferrals'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import Weather from './components/Weather'
import Discussions from './components/Discussions'

export default {
  components: {
    SmallStats,
    LineChart,
    PieChart,
    Weather,
    Discussions,
    TopReferrals,
  },
  data() {
    return {
      dateRange: {
        from: null,
        to: null,
      },
    };
  },
  methods: {
    handleApprove(id) {
      alert(`Approving discussion id: ${id}`); // eslint-disable-line no-alert
    },
    handleReject(id) {
      alert(`Rejecting discussion id: ${id}`); // eslint-disable-line no-alert
    },
    handleEdit(id) {
      alert(`Editing discussion id: ${id}`); // eslint-disable-line no-alert
    },
    handleViewAllComments() {
      alert('Viewing all comments!'); // eslint-disable-line no-alert
    },
  },
  computed: {
    smallStats() {
      return [{
        label: 'Posts',
        value: '2,390',
        percentage: '4.7%',
        increase: true,
        decrease: false,
        labels: ['Label', 'Label', 'Label', 'Label', 'Label', 'Label'],
        datasets: [{
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(0, 184, 216, 0.1)',
          borderColor: 'rgb(0, 184, 216)',
          data: [1, 2, 1, 3, 5, 4, 7],
        }],
      }, {
        label: 'Pages',
        value: '182',
        percentage: '12.4',
        increase: true,
        decrease: false,
        labels: ['Label', 'Label', 'Label', 'Label', 'Label', 'Label'],
        datasets: [{
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(23,198,113,0.1)',
          borderColor: 'rgb(23,198,113)',
          data: [1, 2, 3, 3, 3, 4, 4],
        }],
      }, {
        label: 'Comments',
        value: '8,147',
        percentage: '3.8%',
        increase: false,
        decrease: true,
        labels: ['Label', 'Label', 'Label', 'Label', 'Label', 'Label'],
        datasets: [{
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(255,180,0,0.1)',
          borderColor: 'rgb(255,180,0)',
          data: [2, 3, 3, 3, 4, 3, 3],
        }],
      }, {
        label: 'New Customers',
        value: '29',
        percentage: '2.71%',
        increase: false,
        decrease: true,
        labels: ['Label', 'Label', 'Label', 'Label', 'Label', 'Label'],
        datasets: [{
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(255,65,105,0.1)',
          borderColor: 'rgb(255,65,105)',
          data: [1, 7, 1, 3, 1, 4, 8],
        }],
      }];
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-col {
	margin-bottom: 10px;
}
</style>
