<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input placeholder="姓名" v-model="keyWord"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" v-on:click="queryPlus">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleAdd" type="primary">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onSalf" type="danger" :disabled="this.sels.length===0">上架</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="offSalf" type="info" :disabled="this.sels.length===0">下架</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="products" @selection-change="selsChange" highlight-current-row style="width: 100%;"
                  v-loading="listLoading">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column label="服务名称" prop="name" sortable width="240">
            </el-table-column>
            <el-table-column label="原价" prop="costprice" sortable width="150">
            </el-table-column>
            <el-table-column label="折扣价" prop="saleprice" sortable width="150">
            </el-table-column>
            <el-table-column label="上架时间" prop="onsaletime" sortable width="150">
            </el-table-column>
            <el-table-column label="下架时间" prop="offsaletime" sortable width="150">
            </el-table-column>
            <el-table-column label="启用状态" prop="state" sortable width="100">
                <template scope="scope">
                    <span style="color: green" v-if="scope.row.state == 0">下架</span>
                    <span style="color: red" v-else-if="scope.row.state == 1">上架</span>
                    <span style="color: pink" v-else>什么也没有</span>
                </template>
            </el-table-column>
            <el-table-column label="进货时间" prop="createtime" sortable width="150">
            </el-table-column>
            <el-table-column label="销量" prop="salecount" sortable>
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
        <el-dialog :close-on-click-modal="false" :visible.sync="productFormVisible" title="编辑">
            <el-form :model="productForm" :rules="productFormRules" label-width="80px" ref="productForm">
                <el-form-item label="服务名称" prop="resources">
                    <el-input auto-complete="off" v-model="productForm.name"></el-input>
                </el-form-item>
                <el-form-item label="资源" prop="resources">
                    <!--<el-input v-model="productForm.resources" auto-complete="off"></el-input>-->
                    <el-upload
                            :file-list="fileList"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            action="http://localhost:8080/dfs"
                            class="upload-demo"
                            list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="折扣价" prop="saleprice">
                    <el-input auto-complete="off" v-model="productForm.saleprice"></el-input>
                </el-form-item>
                <el-form-item label="成本价" prop="costprice">
                    <el-input auto-complete="off" v-model="productForm.costprice"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="intro">
                    <quill-editor v-model="productForm.detail.intro"
                                  :options="quillOption">
                    </quill-editor>
                </el-form-item>
                <el-form-item label="预约须知" prop="orderNotice">
                    <quill-editor v-model="productForm.detail.orderNotice"
                                  :options="quillOption">
                    </quill-editor>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click.native="productFormVisible = false">取消</el-button>
                <el-button :loading="productLoading" @click.native="productSubmit" type="primary">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>

    import { quillEditor } from "vue-quill-editor"; //调用编辑器
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import quilConfig from "../../common/js/quill-config"


    export default {
        components: {
            quillEditor
        },
        data() {
            return {
                quillOption:quilConfig,
                filters: {
                    keyWord: ''
                },
                products: [],
                fileList: [],
                total: 0,
                pageSize: 10,
                currentPage: 1,
                listLoading: false,
                keyWord: '',
                sels: [],//列表选中列
                productFormVisible: false,//编辑界面是否显示
                productLoading: false,
                productFormRules: {
                    name: [
                        {required: true, message: '请输入部门名称', trigger: 'blur'}
                    ],
                },
                //新增或者编辑界面数据
                productForm: {
                    id: null,
                    name: '',
                    resources: '',
                    saleprice: '',
                    costprice: '',
                    state:0,
                    intro: '',
                    orderNotice: '',
                    detail: {
                        id: null,
                        intro: "",
                        orderNotice: ""
                    }

                },
            }
        },
        methods: {
            onSalf(){
                var ids = this.sels.map(item => item.id);
                //获取选中的行
                if(!this.sels || this.sels.length  <1){
                    this.$message({ message: '老铁，你不选中数据，臣妾上架不了啊....',type: 'error'});
                    return;
                }
                this.$confirm('确认上架选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    this.$http.post('/product/onsalf',ids).then((res) => {
                        this.listLoading = false;

                        if(res.data.success){
                            this.$message({
                                message: '上架成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message: res.data.message,
                                type: 'error'
                            });
                        }
                        this.getProducts();
                    });
                }).catch(() => {

                });
            },
            offSalf(){

                var ids = this.sels.map(item => item.id);
                //获取选中的行
                if(!this.sels || this.sels.length  <1){
                    this.$message({ message: '老铁，你不选中数据，臣妾下架不了啊....',type: 'error'});
                    return;
                }
                this.$confirm('确认下架选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    this.$http.post('/product/offsalf',ids).then((res) => {
                        this.listLoading = false;

                        if(res.data.success){
                            this.$message({
                                message: '下架成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message: res.data.message,
                                type: 'error'
                            });
                        }
                        this.getProducts();
                    });
                }).catch(() => {

                });
            },
            getImg(row) {
                this.fileList = []
                let resources = row.resources;
                if (resources) {
                    let resourecArry = resources.split(",");
                    for (let i = 0; i < resourecArry.length; i++) {
                        this.fileList.push(
                            {
                                "url": "http://47.95.117.210:8888" + resourecArry[i],
                                "response": {"object": resourecArry[i]}
                            }
                        );
                    }
                }

            },
            handlePreview(file) {
                console.log(file);
            },
            handleSuccess(response, file, fileList) {
                let str = "";
                for (let i = 0; i < fileList.length; i++) {
                    if (i == fileList.length - 1) {
                        str += fileList[i].response.object;
                    } else {
                        str += fileList[i].response.object + ",";
                    }
                }
                this.productForm.resources = str;
            },
            handleRemove(file, fileList) {
                console.log(file.url)
                let path = file.url.substring(25)
                console.log(path)
                this.$http.delete("/dfs?path=" + path)
                    .then(res => {
                        if (res.data.success) {
                            this.$message({
                                message: '删除成功!',
                                type: 'success'
                            });
                            let str = "";
                            for (let i = 0; i < fileList.length; i++) {
                                if (i == fileList.length - 1) {
                                    str += fileList[i].response.object;
                                } else {
                                    str += fileList[i].response.object + ",";
                                }
                            }
                            this.productForm.resources = str;
                        } else {
                            this.$message({
                                message: '删除失败!',
                                type: 'error'
                            });
                        }
                    })
            },

            queryPlus() {
                this.currentPage = 1;
                this.getProducts();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getProducts();
            },
            //获取服务
            getProducts: function () {
                let para = {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    keyWord: this.keyWord,
                    state: null
                };
                this.listLoading = true;
                this.$http.post("/product", para).then(res => {
                    res = res.data
                    this.total = res.total;
                    this.products = res.rows;
                    this.listLoading = false;
                })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '温馨提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    this.$http.delete("/product/" + row.id, {}).then(res => {
                        this.listLoading = false;
                        res = res.data
                        this.$message({
                            message: res.message,
                            type: 'success'
                        });
                        this.getProducts();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.productForm = {}
                this.detail = this.getDetail(row.id)
                this.getImg(row)
                row.detail = {}
                this.productForm = Object.assign({}, row)
                this.productFormVisible = true;
            },
            //显示新增界面
            handleAdd: function () {
                this.fileList=[]
                this.productFormVisible = true;
                this.productForm = {
                    id: null,
                    name: '',
                    resources: '',
                    saleprice: '',
                    costprice: '',
                    intro: '',
                    orderNotice: '',
                    detail: {
                        id: null,
                        intro: "",
                        orderNotice: ""
                    }
                }
            },
            //编辑
            productSubmit: function () {
                this.$refs.productForm.validate((valid) => {
                    if (valid) {
                        alert(this.productForm.resources)
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.productLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.productForm);
                            this.$http.put("/product", para).then(res => {
                                res = res.data
                                this.listLoading = false;
                                if (res.success) {
                                    this.$message({
                                        message: res.message,
                                        type: 'success'
                                    });
                                    this.getProducts();
                                } else {
                                    this.$message({
                                        message: res.message,
                                        type: 'error',
                                    });
                                }
                                this.productFormVisible = false;
                                this.productLoading = false;
                                this.$refs['productForm'].resetFields();
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
                    this.$http.patch("/product", ids).then(res => {
                        res = res.data
                        this.listLoading = false;
                        if (res.success) {
                            //NProgress.done();
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getProducts();
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
            },
            getDetail(id) {
                this.$http.get("/productDetail/" + id).then(res => {
                    res = res.data
                    if (res) {
                        this.productForm.detail = res;
                    }
                }).catch(error => {
                    this.$message({
                        message: '系统出错',
                        type: 'error'
                    });
                })
            }
        },
        mounted() {
            this.getProducts();
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