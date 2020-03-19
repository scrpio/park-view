<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
        <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="showAddDialog(0,0)">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>
    <!--菜单表格-->
    <el-col :span="24" class="warp-main">
      <tree-table :data="menudata" :columns="columns" highlight-current-row border size="mini" style="width: 100%;">
        <el-table-column prop="object.perms" label="权限" min-width="160"/>
        <el-table-column prop="object.url" label="路径" min-width="120"/>
        <el-table-column prop="object.icon" label="图标" min-width="140"/>
        <el-table-column prop="object.sort" label="排序" min-width="50" align="center"/>
        <el-table-column label="类型" min-width="60" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.object.type==0?'success':scope.row.object.type==1?'warning':'danger'">
              {{ scope.row.object.type==0?"目录":scope.row.object.type==1?"菜单":"按钮" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="object.id" label="ID" v-if="false"/>
        <el-table-column prop="object.parentId" label="父节点" v-if="false"/>
        <el-table-column label="叶节点" min-width="60" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.object.leaf?'success':'danger'">{{ scope.row.object.leaf ? "是" : "否" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="菜单显示" min-width="70" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.object.menuShow?'success':'danger'">{{ scope.row.object.menuShow ? "是" : "否" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="showAddDialog(scope.row.id,scope.row.object.type)">新增</el-button>
            <el-button size="mini" type="primary" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="remove(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </tree-table>
      <!-- 添加界面 -->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form ref="addForm" :model="addForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="addForm.type">
              <el-radio :label="0">目录</el-radio>
              <el-radio :label="1">菜单</el-radio>
              <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="路径" prop="url">
            <el-input v-model="addForm.url" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="权限" prop="perms">
            <el-input v-model="addForm.perms" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="addForm.icon" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="父节点" prop="parentId">
            <el-input v-model="addForm.parentId" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="addForm.sort" controls-position="right" :min="1" :max="100"/>
          </el-form-item>
          <el-form-item label="叶子节点" prop="leaf">
            <el-switch v-model="addForm.leaf" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-form-item>
          <el-form-item label="菜单显示" prop="menuShow">
            <el-switch v-model="addForm.menuShow" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" :loading="addLoading" @click.native="addSubmit">提交</el-button>
        </div>
      </el-dialog>
      <!-- 编辑界面 -->
      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="editForm.type">
              <el-radio :label="0">目录</el-radio>
              <el-radio :label="1">菜单</el-radio>
              <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="路径" prop="url">
            <el-input v-model="editForm.url" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="权限" prop="perms">
            <el-input v-model="editForm.perms" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="editForm.icon" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="父节点" prop="parentId">
            <el-input v-model="editForm.parentId" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="editForm.sort" controls-position="right" :min="1" :max="100"/>
          </el-form-item>
          <el-form-item label="叶子节点" prop="leaf">
            <el-switch v-model="editForm.leaf" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-form-item>
          <el-form-item label="菜单显示" prop="menuShow">
            <el-switch v-model="editForm.menuShow" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import treeTable from '@/components/TreeTable'
import API from '@/api/api_menu'

export default {
  components: { treeTable },
  data() {
    return {
      loading: false,
      addLoading: false,
      permsItems: [
        { key: 'get', value: 'get' },
        { key: 'post', value: 'post' },
        { key: 'put', value: 'put' },
        { key: 'delete', value: 'delete' }
      ],
      columns: [
        {
          text: '名称',
          value: 'text',
          width: 150
        }
      ],
      menudata: [],
      editFormVisible: false,
      editForm: {
        name: '',
        perms: '',
        url: '',
        icon: '',
        sort: '',
        type: '',
        parentId: ''
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请输入父节点', trigger: 'blur' }
        ]
      },
      addFormVisible: false,
      addForm: {
        name: '',
        perms: '',
        url: '',
        icon: '',
        sort: '',
        type: 0,
        parentId: 0
      }
    }
  },
  methods: {
    search() {
      var that = this
      that.loading = true
      API.menus().then(
        function(result) {
          that.loading = false
          if (result.code === 200) {
            that.menudata = result.data
          }
        },
        function(err) {
          that.loading = false
          that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
        }
      ).catch(function(error) {
        that.loading = false
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    // 新增界面
    showAddDialog(parentId, type) {
      this.addForm.type = type
      this.addForm.parentId = parentId
      this.addFormVisible = true
    },
    // 编辑界面
    showEditDialog(index, row) {
      this.editForm.type = row.type
      this.editForm.parentId = row.parentId
      this.editForm = Object.assign({}, row.object)
      this.editFormVisible = true
    },
    // 编辑提交
    editSubmit() {
      var that = this
      this.$refs.editForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, that.editForm)
          API.edit(params).then(
            function(result) {
              that.loading = false
              if (result.code === 200) {
                that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
                that.$refs['editForm'].resetFields()
                that.editFormVisible = false
                that.search()
              }
            },
            function(err) {
              that.loading = false
              that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
            }
          ).catch(function(error) {
            that.loading = false
            console.log(error)
            that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
          })
        }
      })
    },
    // 新增提交
    addSubmit() {
      var that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          API.add(params).then(
            function(result) {
              that.loading = false
              if (result.code === 200) {
                that.$message.success({ showClose: true, message: '新增成功', duration: 2000 })
                that.$refs['addForm'].resetFields()
                that.addFormVisible = false
                that.search()
              }
            },
            function(err) {
              that.loading = false
              that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
            }
          ).catch(function(error) {
            that.loading = false
            console.log(error)
            that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
          })
        }
      })
    },
    remove(index, row) {
      var that = this
      this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
        that.loading = true
        API.remove({ id: row.id }).then(
          function(result) {
            that.loading = false
            if (result.code === 200) {
              that.$message.success({ showClose: true, message: '删除成功', duration: 1500 })
              that.search()
            }
          },
          function(err) {
            that.loading = false;
            that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
          }
        ).catch(function(error) {
          that.loading = false
          console.log(error)
          that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
        })
      })
    }
  },
  mounted() {
    this.search()
  }
}
</script>
