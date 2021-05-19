<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input placeholder="姓名或者电话" v-model="filters.keyWord"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getEmps">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleAdd" type="primary">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="emps" @selection-change="selsChange" highlight-current-row style="width: 100%;"
                  v-loading="listLoading">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column label="姓名" prop="username" sortable width="120">
            </el-table-column>
            <el-table-column label="邮箱" prop="email" sortable width="100">
            </el-table-column>
            <el-table-column label="电话" prop="phone" sortable width="100">
            </el-table-column>
            <el-table-column label="加密参数" prop="salt" sortable width="120">
            </el-table-column>
            <el-table-column label="密码" min-width="180" prop="password" sortable>
            </el-table-column>
            <el-table-column label="年龄" min-width="180" prop="age" sortable>
            </el-table-column>
            <el-table-column label="工作状态" min-width="180" prop="state" sortable>
                <template scope="scope">
                    <span style="color: green" v-if="scope.row.state==1">正常</span>
                    <span style="color: orange" v-else-if="scope.row.state==2">请假</span>
                    <span style="color: red" v-else>离职</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button @click="handleEdit(scope.$index, scope.row)" size="small">编辑</el-button>
                    <el-button @click="handleDel(scope.$index, scope.row)" size="small" type="danger">删除</el-button>
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

        <!--编辑界面-->
        <el-dialog :close-on-click-modal="false" :visible.sync="employeeFormVisible" title="新增或编辑">
            <el-form :model="employeeForm" :rules="editFormRules" label-width="80px" ref="employeeForm">
                <el-form-item label="员工名称" prop="username">
                    <el-input auto-complete="off" v-model="employeeForm.username"></el-input>
                </el-form-item>
                <el-form-item label="员工密码" prop="password">
                    <el-input auto-complete="off" v-model="employeeForm.password"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input auto-complete="off" v-model="employeeForm.age"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input auto-complete="off" v-model="employeeForm.email"></el-input>
                </el-form-item>
                <el-form-item label="加密参数" prop="salt">
                    <el-input auto-complete="off" v-model="employeeForm.salt"></el-input>
                </el-form-item>
                <el-form-item label="员工状态">
                    <el-radio-group v-model="employeeForm.state">
                        <el-radio :label="1" class="radio">正常</el-radio>
                        <el-radio :label="0" class="radio">离职</el-radio>
                        <el-radio :label="2" class="radio">请假</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click.native="employeeFormVisible = false">取消</el-button>
                <el-button :loading="editLoading" @click.native="editSubmit" type="primary">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getUserListPage, removeUser, batchRemoveUser, editUser, addUser} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    keyWord: ''
                },
                users: [],
                total: 0,
                pageSize: 10,
                currentPage: 1,
                listLoading: false,
                sels: [],//列表选中列

                employeeFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                employeeForm: {
                    id: '',
                    username: '',
                    email: '',
                    phone: '',
                    salt: '',
                    password: '',
                    age: '',
                    state: 1
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
            }
        },
        methods: {
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getEmps();
            },
            //获取用户列表
            getEmps() {
                let para = {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    keyWord: this.filters.keyWord
                };
                this.listLoading = true;
                //NProgress.start();
                this.$http.post("/emp", para).then(res => {
                    res = res.data
                    this.total = res.total;
                    this.emps = res.rows;
                    this.listLoading = false;
                })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '温馨提示', {
                    type: 'warning'
                }).then(() => {
                    //NProgress.start();
                    let para = {id: row.id};
                    this.$http.delete("/emp/" + para.id).then(res => {
                        res = res.data
                        if (res.success) {
                            this.$message({
                                message: res.message,
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'error'
                            });
                        }
                        this.getEmps();
                    })
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.employeeFormVisible = true;
                this.employeeForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.employeeFormVisible = true;
                this.employeeForm = {
                    id: '',
                    username: '',
                    email: '',
                    phone: '',
                    salt: '',
                    password: '',
                    age: '',
                    state: 1
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.employeeForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.employeeForm);
                            this.$http.put("/emp", para).then(res => {
                                res = res.data
                                if (res.success) {
                                    this.$message({
                                        message: res.message,
                                        type: 'success'
                                    });
                                } else {
                                    this.$message({
                                        message: res.message,
                                        type: 'error'
                                    });
                                }
                                this.editLoading = false;
                                this.$refs['employeeForm'].resetFields();
                                this.employeeFormVisible = false;
                                this.getEmps();
                            }).catch(error => {
                                this.$message({
                                    message: "系统错误",
                                    type: 'error'
                                });
                                this.editLoading = false;
                                this.$refs['employeeForm'].resetFields();
                                this.employeeFormVisible = false;
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
                    this.$http.patch("/emp", ids).then(res => {
                        res = res.data
                        if (res.success) {
                            this.$message({
                                message: res.message,
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'error'
                            });
                        }
                        this.getEmps()
                    }).catch(error => {
                        this.$message({
                            message: "系统出错",
                            type: 'error'
                        });
                    })
                })
            }
        },
        mounted() {
            this.getEmps();
        }
    }

</script>

<style scoped>

</style>