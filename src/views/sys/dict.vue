<template>
  <div class="app-container">
    <el-row class="warp">
      <el-col :span="24" v-loading="loading" element-loading-text="拼命加载中" class="warp-main">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-input v-model="filters.condition" placeholder="关键词" style="min-width: 240px;" @keyup.enter.native="handleSearch" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="dicts" border stripe highlight-current-row size="mini" style="width: 100%;" @selection-change="selsChange">
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column prop="id" label="ID" width="80" align="center" sortable />
          <el-table-column prop="dict" label="词典名称" min-width="100" sortable />
          <el-table-column prop="code" label="词典编码" min-width="100" sortable />
          <el-table-column prop="description" label="详细内容" min-width="200" sortable />
          <el-table-column prop="type" label="类型" min-width="80" align="center" :filters="[{ text: '停用词库', value: 0 }, { text: '扩展词库', value: 1 }]" :filter-method="filterTag" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag :type="scope.row.type==1?'success':'danger'">
                {{ scope.row.type == 0 ? "停用词库" : "扩展词库" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button circle size="mini" type="primary" @click="showEditDialog(scope.row)">编辑</el-button>
              <el-button circle size="mini" type="danger" @click="remove(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleCurrentChange" />
        </el-col>
        <!-- 添加界面 -->
        <el-dialog :visible.sync="addFormVisible" :close-on-click-modal="false" title="新增">
          <el-form ref="addForm" :model="addForm" :rules="formRules" label-width="80px">
            <el-form-item label="词典名称" prop="dict">
              <el-input v-model="addForm.dict" auto-complete="off" />
            </el-form-item>
            <el-form-item label="词典编码" prop="code">
              <el-input v-model="addForm.code" auto-complete="off" />
            </el-form-item>
            <el-form-item label="详细内容" prop="description">
              <el-input v-model="addForm.description" auto-complete="off" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="addForm.type">
                <el-option key="0" value="0" label="停用词库">停用词库</el-option>
                <el-option key="1" value="1" label="扩展词库">扩展词库</el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit">提交</el-button>
          </div>
        </el-dialog>
        <!-- 编辑界面 -->
        <el-dialog :close-on-click-modal="false" :visible.sync="editFormVisible" title="编辑">
          <el-form ref="editForm" :model="editForm" :rules="formRules" label-width="80px">
            <el-form-item label="词典名称" prop="dict">
              <el-input v-model="editForm.dict" auto-complete="off" />
            </el-form-item>
            <el-form-item label="词典编码" prop="code">
              <el-input v-model="editForm.code" auto-complete="off" />
            </el-form-item>
            <el-form-item label="详细内容" prop="description">
              <el-input v-model="editForm.description" auto-complete="off" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="editForm.type">
                <el-option key="0" value="0" label="停用词库">停用词库</el-option>
                <el-option key="1" value="1" label="扩展词库">扩展词库</el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit">提交</el-button>
          </div>
        </el-dialog>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import API from '@/api/api_sys'

export default {
  data() {
    return {
      dicts: [],
      ids: [],
      total: 0,
      page: 1,
      limit: 15,
      loading: false,
      editFormVisible: false,
      addFormVisible: false,
      filters: {
        name: ''
      },
      formRules: {
        dict: [{ required: true, message: '请输入词典名称', trigger: 'blur' }]
      },
      editForm: {
        dict: '',
        code: '',
        description: '',
        type: ''
      },
      addForm: {
        dict: '',
        code: '',
        description: '',
        type: ''
      }
    }
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.search()
    },
    handleSearch() {
      this.total = 0
      this.page = 1
      this.search()
    },
    filterTag(value, row) {
      return row.type === value
    },
    selsChange: function(sels) {
      this.ids = sels.map(row => row.id).toString()
    },
    search: function() {
      var that = this
      var params = {
        page: that.page,
        limit: 15
      }
      that.loading = true
      API.findList(params).then(function(result) {
        that.loading = false
        if (result.success) {
          that.total = result.data.total
          that.dicts = result.data.list
        }
      }, function(err) {
        that.loading = false
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        that.loading = false
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    showAddDialog: function() {
      this.addFormVisible = true
    },
    showEditDialog: function(row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    addSubmit: function() {
      var that = this
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          API.add(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '添加成功', duration: 2000 })
              that.$refs['addForm'].resetFields()
              that.addFormVisible = false
              that.search()
            } else {
              that.$message.error({ showClose: true, message: '添加失败', duration: 2000 })
            }
          }, function(err) {
            that.loading = false
            that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
          }).catch(function(error) {
            that.loading = false
            console.log(error)
            that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
          })
        }
      })
    },
    editSubmit: function() {
      var that = this
      this.$refs.editForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, that.editForm)
          API.edit(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
              that.$refs['editForm'].resetFields()
              that.editFormVisible = false
              that.search()
            } else {
              that.$message.error({ showClose: true, message: '修改失败', duration: 2000 })
            }
          }, function(err) {
            that.loading = false
            that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
          }).catch(function(error) {
            that.loading = false
            console.log(error)
            that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
          })
        }
      })
    },
    remove: function(ids) {
      var that = this
      this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
        that.loading = true
        API.remove({ ids: ids }).then(function(result) {
          that.loading = false
          if (result.success) {
            that.$message.success({ showClose: true, message: '删除成功', duration: 2000 })
            that.search()
          }
        }, function(err) {
          that.loading = false
          that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
        }).catch(function(error) {
          that.loading = false
          console.log(error)
          that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
        })
      }).catch(() => {})
    }
  }
}
</script>
