<template>
    <section>
        <!-- 外层容器 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="750px">
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="filters">
                        <el-form-item>
                            <el-input placeholder="姓名" v-model="keyWord"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="queryPlus">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="handleAdd" type="primary">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>


                <!--列表-->
                <el-table :data="departments" @selection-change="selsChange" highlight-current-row
                          style="width: 100%;" v-loading="listLoading">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column label="部门名称" prop="name" sortable width="100">
                    </el-table-column>
                    <el-table-column label="部门编号" prop="sn" sortable width="100">
                    </el-table-column>
                    <el-table-column label="上级" prop="dirPath" sortable width="100">
                    </el-table-column>
                    <el-table-column :formatter="formatSex" label="启用状态" prop="state" sortable width="100">
                        <template scope="scope">
                            <span style="color: green" v-if="scope.row.state == 0">已启用</span>
                            <span style="color: red" v-else-if="scope.row.state == -1">未启用</span>
                            <span style="color: pink" v-else>什么也没有</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="管理员" prop="manager.username" sortable width="100">
                    </el-table-column>
                    <el-table-column label="上级部门" prop="parent.name" sortable>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-button @click="handleEdit(scope.$index, scope.row)" size="small">编辑</el-button>
                            <el-button @click="handleDel(scope.$index, scope.row)" size="small" type="danger">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button :disabled="this.sels.length===0" @click="batchRemove" type="danger">批量删除</el-button>
                    <el-pagination
                            :current-page="currentPage"
                            :page-size="pageSize"
                            :total="total"
                            @current-change="handleCurrentChange"
                            layout="prev, pager, next"
                            style="float:right;">
                    </el-pagination>
                </el-col>
            </el-aside>
            <el-main>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="filters">
                        <el-form-item>
                            <el-input placeholder="姓名" v-model="keyWord"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="queryPlus">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="handleAdd" type="primary">新增</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>


                <!--列表-->
                <el-table :data="departments" @selection-change="selsChange" highlight-current-row
                          style="width: 100%;" v-loading="listLoading">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" width="60">
                    </el-table-column>
                    <el-table-column label="部门名称" prop="name" sortable width="100">
                    </el-table-column>
                    <el-table-column label="部门编号" prop="sn" sortable width="100">
                    </el-table-column>
                    <el-table-column label="上级" prop="dirPath" sortable width="100">
                    </el-table-column>
                    <el-table-column :formatter="formatSex" label="启用状态" prop="state" sortable width="100">
                        <template scope="scope">
                            <span style="color: green" v-if="scope.row.state == 0">已启用</span>
                            <span style="color: red" v-else-if="scope.row.state == -1">未启用</span>
                            <span style="color: pink" v-else>什么也没有</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="管理员" prop="manager.username" sortable width="100">
                    </el-table-column>
                    <el-table-column label="上级部门" prop="parent.name" sortable>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-button @click="handleEdit(scope.$index, scope.row)" size="small">编辑</el-button>
                            <el-button @click="handleDel(scope.$index, scope.row)" size="small" type="danger">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button :disabled="this.sels.length===0" @click="batchRemove" type="danger">批量删除</el-button>
                    <el-pagination
                            :current-page="currentPage"
                            :page-size="pageSize"
                            :total="total"
                            @current-change="handleCurrentChange"
                            layout="prev, pager, next"
                            style="float:right;">
                    </el-pagination>
                </el-col>
            </el-main>
        </el-container>
        <!--编辑界面-->
        <el-dialog :close-on-click-modal="false" :visible.sync="departmentFormVisible" title="编辑">
            <el-form :model="departmentForm" :rules="departmentFormRules" label-width="80px" ref="departmentForm">
                <el-form-item label="部门名称" prop="name">
                    <el-input auto-complete="off" v-model="departmentForm.name"></el-input>
                </el-form-item>
                <el-form-item label="部门编号" prop="sn">
                    <el-input auto-complete="off" v-model="departmentForm.sn"></el-input>
                </el-form-item>
                <el-form-item label="部门状态">
                    <el-radio-group v-model="departmentForm.state">
                        <el-radio :label="0" class="radio">启用</el-radio>
                        <el-radio :label="-1" class="radio">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="管理员" prop="managerId">
                    <!-- value-key若为引用类型，value-key必选，映射:key -->
                    <el-select placeholder="请选择" v-model="departmentForm.manager" value-key="id">
                        <!-- v-for遍历集合
                            :key：作为唯一索引
                            :label：选中后的显示数据
                            :value：返回给服务器的值
                         -->
                        <el-option
                                :key="item.id"
                                :label="item.username"
                                :value="item"
                                v-for="item in emps">
                            <span style="float: left">{{ item.username }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父级部门" prop="parent">
                    <el-cascader :options="parents"
                                 :props="{ checkStrictly: true,value:'id',label:'name'}"
                                 clearable
                                 v-model="departmentForm.parent"></el-cascader>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click.native="departmentFormVisible = false">取消</el-button>
                <el-button :loading="departmentLoading" @click.native="departmentSubmit" type="primary">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {
        getDepartmentListPage,
        removeDepartment,
        batchRemoveDepartment,
        departmentDepartment,
        addDepartment
    } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    keyWord: ''
                },
                departments: [],
                total: 0,
                pageSize: 10,
                currentPage: 1,
                listLoading: false,
                keyWord: '',
                sels: [],//列表选中列
                /* 员工集合 */
                emps: [],
                /* 父部门 */
                parents: [],
                departmentFormVisible: false,//编辑界面是否显示
                departmentLoading: false,
                departmentFormRules: {
                    name: [
                        {required: true, message: '请输入部门名称', trigger: 'blur'}
                    ],
                    sn: [
                        {required: true, message: '请输入部门编号', trigger: 'blur'}
                    ]
                },
                //新增或者编辑界面数据
                departmentForm: {
                    id: null,
                    name: '',
                    sn: '',
                    state: -1,
                    manager: null,
                    parent: null,
                },

            }
        },
        methods: {
            getCasecade() {
                this.$http.get("/dept/case")
                    .then(res => {
                        this.parents = res.data
                    })
            },
            getManagerList() {
                this.$http.get("/emp")
                    .then(res => {
                        this.emps = res.data
                    })
            },
            queryPlus() {
                this.currentPage = 1;
                this.getDepartments();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getDepartments();
            },
            //获取部门列表
            getDepartments: function () {
                let para = {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    keyWord: this.keyWord
                };
                this.listLoading = true;
                //NProgress.start();
                /*getDepartmentListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.departments = res.data.departments;
                    this.listLoading = false;
                    //NProgress.done();
                });*/
                this.$http.post("/dept", para).then(res => {
                    res = res.data
                    this.total = res.total;
                    this.departments = res.rows;
                    this.listLoading = false;
                })
            },
            //删除
            handleDel: function (index, row) {

                this.$confirm('确认删除该记录吗?', '温馨提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    this.$http.delete("/dept/" + row.id, {}).then(res => {
                        this.listLoading = false;
                        //NProgress.done();
                        res = res.data
                        this.$message({
                            message: res.message,
                            type: 'success'
                        });
                        this.getDepartments();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.getCasecade()
                this.departmentFormVisible = true;
                this.departmentForm = Object.assign({}, row)
                let arr = row.dirPath.split("/")
                console.log(arr)
                if (arr.length > 2 && arr.length <= 3) {
                    this.departmentForm.parent = [parseInt(arr[1])]
                } else if (arr.length > 3) {
                    this.departmentForm.parent = [parseInt(arr[arr.length - 3]), parseInt(arr[arr.length - 2])]
                }

            },
            //显示新增界面
            handleAdd: function () {
                this.getCasecade()
                this.departmentFormVisible = true;
                this.departmentForm = {
                    id: null,
                    name: '',
                    sn: '',
                    state: -1,
                    manager: null,
                    parent: {}
                };
            },
            //编辑
            departmentSubmit: function () {
                this.$refs.departmentForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.departmentLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.departmentForm);
                            if (para.parent) {
                                para.parent = {id: para.parent[para.parent.length - 1]}
                            }
                            this.$http.put("/dept", para).then(res => {
                                res = res.data
                                this.listLoading = false;
                                if (res.success) {
                                    //NProgress.done();
                                    this.$message({
                                        message: res.message,
                                        type: 'success'
                                    });
                                    this.getDepartments();
                                } else {
                                    this.$message({
                                        message: res.message,
                                        type: 'error',
                                    });
                                }
                                this.departmentFormVisible = false;
                                this.departmentLoading = false;
                                this.$refs['departmentForm'].resetFields();
                            }).catch(erorr => {
                                this.$message({
                                    message: '系统出错',
                                    type: 'error'
                                });
                            })
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id)
                this.$confirm('确认删除选中记录吗？', '温馨提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    this.$http.patch("/dept", ids).then(res => {
                        res = res.data
                        this.listLoading = false;
                        if (res.success) {
                            //NProgress.done();
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getDepartments();
                        } else {
                            this.$message({
                                message: '删除失败',
                                type: 'error'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        message: '系统出错',
                        type: 'error'
                    });
                });
            }
        },
        mounted() {
            this.getDepartments();
            this.getManagerList();
        }
    }

</script>

<style scoped>
    .el-dropdown {
        vertical-align: top;
    }

    .el-dropdown + .el-dropdown {
        margin-left: 15px;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>