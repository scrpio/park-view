<template>
  <el-row class="wrap">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>系统工具</el-breadcrumb-item>
        <el-breadcrumb-item>清除缓存</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main">
      <el-row :gutter="5">
        <el-col :sm="24" :md="24" :lg="15">
          <el-card class="demo-split-pane">
            <div>
              <div class="demo-split-pane">
                <div style="margin-bottom: 10px;">
                  <el-input v-model="searchPattern" placeholder="请输入key搜索..." class="search-input" @on-enter="searchKeys" />
                  <el-button type="primary" icon="el-icon-search" @click="searchKeys" class="search-btn">搜索</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="deleteKeys">清空keys</el-button>
                </div>
                <el-collapse v-model="activeName" accordion>
                  <el-collapse-item name="db">
                    <template slot="title">
                      数据库-0 ( {{ keysCount }} )
                    </template>
                    <ul style="min-height:160px;max-height:300px;">
                      <li v-for="item in keysList" :key="item">
                        <div class="server-key-key"  style="margin-bottom: 5px;">
                          <a href="javascript:;" @click="getValueByKey(item)" class="server-key">{{item}}</a>
                          <a href="javascript:;" @click="deleteKey(item)" class="server-clear-key"><i class="fa fa-close" /></a>
                        </div>
                      </li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </el-card>
          <el-card class="demo-split-pane no-bottom">
            <div>
              <hr class="server-value-divider"/>
              <div class="server-value-title">
                <div>
                  <strong class="server-value-key">Key:</strong>
                  <span>{{valueInfo.key}}</span>
                </div>
              </div>
              <hr class="server-value-divider"/>
              <div class="server-value-title">
                <div>
                  <strong class="server-value-key">Size:</strong>
                  <span>{{valueInfo.size}}</span>
                </div>
              </div>
              <hr class="server-value-divider"/>
              <div class="server-value-title">
                <div>
                  <strong class="server-value-key">TTL:</strong>
                  <span>{{valueInfo.expire}}{{valueInfo.expireFormat}}</span>
                </div>
              </div>
              <hr class="server-value-divider" style="margin-bottom: 0px;"/>
              <div class="server-value-value">
                <div>
                  <strong class="server-value-key">Value</strong>
                  <el-button type="text" class="fa fa-close server-clear-key"/>
                </div>
              </div>
              <hr class="server-value-divider" style="margin-top: 0px;"/>
              <div class="server-value-val">
                <el-input v-model="valueInfo.value" :autosize="{ minRows: 5, maxRows: 12}" type="textarea" style="border: none;" />
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="24" :md="24" :lg="9">
          <el-card>
            <h3 class="server-info-title server-title">Redis 服务器信息</h3>
            <div class="server-title">
              <hr class="server-left-hr" />
              <span>基本信息</span>
              <hr class="server-right-hr" />
            </div>
            <el-row class="server-info-title server-text">
              <el-col :span="12">
                <p>Redis 版本</p>
                <p>{{redisInfo.gcc_version}}</p>
                <p>已执行的命令</p>
                <p>{{redisInfo.total_commands_processed}}</p>
              </el-col>
              <el-col :span="12">
                <p>已使用的内存</p>
                <p>{{redisInfo.used_memory_rss}}</p>
                <p>正常运行时间</p>
                <p>{{redisInfo.uptime_in_days}}</p>
              </el-col>
            </el-row>
            <div class="server-title">
              <hr class="server-left-hr" />
              <span>详细信息</span>
              <hr class="server-right-hr" />
            </div>
            <div class="server-text">
              <p>arch_bits: {{redisInfo.arch_bits}}</p>
              <p>config_file: {{redisInfo.config_file}}</p>
              <p>hz: {{redisInfo.hz}}</p>
              <p>lru_clock: {{redisInfo.lru_clock}}</p>
              <p>multiplexing_api: {{redisInfo.multiplexing_api}}</p>
              <p>os: {{redisInfo.os}}</p>
              <p>process_id: {{redisInfo.process_id}}</p>
              <p>redis_build_id: {{redisInfo.redis_build_id}}</p>
              <p>redis_git_drity: {{redisInfo.redis_git_dirty}}</p>
              <p>redis_git_sha1: {{redisInfo.redis_git_sha1}}</p>
              <p>redis_mode: {{redisInfo.redis_mode}}</p>
              <p>redis_version: {{redisInfo.redis_version}}</p>
              <p>run_id: {{redisInfo.run_id}}</p>
              <p>tcp_port: {{redisInfo.tcp_port}}</p>
              <p>uptime_in_days: {{redisInfo.uptime_in_days}}</p>
              <p>uptime_in_seconds: {{redisInfo.uptime_in_seconds}}</p>
              <p>used_memory: {{redisInfo.used_memory}}</p>
              <p>used_memory_human: {{redisInfo.used_memory_human}}</p>
              <p>used_memory_rss: {{redisInfo.used_memory_rss}}</p>
              <p>used_memory_peak: {{redisInfo.used_memory_peak}}</p>
              <p>used_memory_peak_human: {{redisInfo.used_memory_peak_human}}</p>
              <p>used_memory_lua: {{redisInfo.used_memory_lua}}</p>
              <p>mem_fragmentation_ratio: {{redisInfo.mem_fragmentation_ratio}}</p>
              <p>mem_allocator: {{redisInfo.mem_allocator}}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import API from '@/api/api_sys'
import { formatDate } from '@/utils'

export default {
  data() {
    return {
      loading: false,
      activeName: 'db',
      redisInfo: {},
      searchPattern: '*',
      searchCount: 1,
      keysList: [],
      keysCount: 0,
      valueInfo: {
        key: '',
        value: '',
        size: '',
        expire: '', // key 的过期时间，以秒计。
        expireFormat: '' // key 的过期时间格式。
      }
    }
  },
  mounted() {
    this.getRedisCacheInfo()
    this.getKeysCount()
  },
  methods: {
    // 获取Redis缓存信息
    getRedisCacheInfo() {
      var that = this
      API.redisCacheInfo().then(function(result) {
        if (result.success) {
          that.redisInfo = result.data
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    getKeysCount() {
      var that = this
      API.redisCacheKeysCount().then(function(result) {
        if (result.success) {
          that.keysCount = result.data
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    searchKeys() {
      var that = this
      var params = {
        pattern : that.searchPattern
      }
      API.redisCacheKeys(params).then(function(result) {
        if (result.success) {
          that.keysList = result.data
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    getValueByKey(key) {
      var that = this
      if (key === '') {
        that.$message.error({ showClose: true, message: 'key为空', duration: 2000 })
        return
      }
      var params = {
        key: key
      }
      API.getValueByKey(params).then(function(result) {
        if (result.success) {
          that.valueInfo = result.data
          if (that.valueInfo.expire !== -1) {
            var time = that.valueInfo.expire
            that.valueInfo.expire = time + " s"
            that.valueInfo.expireFormat = "（" + formatDate(time) + "）"
          }
          that.valueInfo.size = that.valueInfo.size + " byte"
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    JsonFormat(json) {
      if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
      }
      json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
         var cls = 'number';
          if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                cls = 'key';
              } else {
                cls = 'string';
              }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
       });
    },
    deleteKey(key) {
      var that = this
      if (key === '') {
        that.$message.error({ showClose: true, message: 'key为空', duration: 2000 })
        return
      }
      var params = {
        key: key
      }
      that.$confirm('删除缓存，谨慎操作', '提示', { type: 'warning' }).then(() => {
        API.delKey(params).then(function(result) {
          if (result.success) {
            that.$message.success({ showClose: true, message: '删除成功', duration: 2000 })
            that.searchKeys()
            that.getKeysCount()
          }
        }, function(err) {
          that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
        }).catch(function(error) {
          console.log(error)
          that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
        })
      })
    },
    deleteKeys() {
      var that = this
      if (that.keysCount <= 0 || that.keysList.length <= 0) {
        that.$message.error({ showClose: true, message: '未获取到缓存，不需要清空', duration: 2000 })
        return
      }
      that.$confirm('清空缓存，谨慎操作', '提示', { type: 'warning' }).then(() => {
        API.delKeys().then(function(result) {
          if (result.success) {
            that.$message.success({ showClose: true, message: '清除成功', duration: 2000 })
            that.searchKeys()
            that.getKeysCount()
          }
        }, function(err) {
          that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
        }).catch(function(error) {
          console.log(error)
          that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.demo-split-pane {
  margin-bottom: 5px;
}
.demo-split-pane.no-bottom {
  height: 100%;
  margin: 0;
}
.search-input {
  width: 200px;
  margin-right: 5px;
}
.search-btn {
  margin-right: 5px;
}
.server-key {
  color: #2db7f5;
}
.server-clear-key {
  display: inline-block;
  float: right;
  color: #ed4014;
  margin-right: 10px;
}
.server-info-title {
  text-align: center;
}
.server-left-hr {
  display: inline-block;
  width:38%;
  margin-right: 5px;
}
.server-right-hr {
  display: inline-block;
  width:38%;
  margin-left: 5px;
}
.server-title {
  font-size: 14px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
}
.server-title span {
  font-size: 14px;
  font-weight: bold;
}
.server-text p {
  line-height: 22px;
}
.server-value-divider {
  margin-top: 10px;
  margin-bottom: 10px;
}
.server-value-title {
  padding-left: 20px;
}
.server-value-key {
  color: #5eb95e;
}
.server-value-value {
  background: rgba(94,185,94,.115);
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
}
.server-key-key {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.el-collapse {
  padding-left: 20px;
  padding-right: 20px;
}
pre {
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
  span {
    display: block;
  }
}
.string { color: green; }
.number { color: darkorange; }
.boolean { color: blue; }
.null { color: magenta; }
.key { color: red; }
</style>
