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

            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="productOrders" highlight-current-row style="width: 100%;"
                  v-loading="listLoading">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column label="订单标识" prop="orderSn" sortable width="240">
            </el-table-column>
            <el-table-column label="流水" prop="price" sortable width="200">
            </el-table-column>
            <el-table-column label="最后支付时间" prop="lastPayTime" sortable width="250">
            </el-table-column>
            <el-table-column label="启用状态" prop="state" sortable width="150">
                <template scope="scope">
                    <span style="color: green" v-if="scope.row.state == 0">未支付</span>
                    <span style="color: red" v-else-if="scope.row.state == 1">已支付</span>
                    <span style="color: red" v-else-if="scope.row.state == 2">已发货</span>
                    <span style="color: pink" v-else>什么也没有</span>
                </template>
            </el-table-column>
            <el-table-column label="摘要" prop="digest" sortable>
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template scope="scope">
                    <el-button @click="handleEdit(scope.$index, scope.row)" size="small">查看详细</el-button>
                    <el-button @click="handleDel(scope.$index, scope.row)" size="small" type="danger">取消</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :total="total"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    style="float:right;">
            </el-pagination>
        </el-col>

        <!--详细-->
        <el-dialog :close-on-click-modal="false" :visible.sync="adoptOrderInfoVisible" title="订单详情">
            <el-form :model="adoptOrderInfo" label-width="120px" ref="adoptOrderInfo">
                <el-form-item label="摘要" prop="digest">
                    <el-input auto-complete="off" readonly="readonly" v-model="adoptOrderInfo.digest"></el-input>
                </el-form-item>
                <el-form-item label="订单号" prop="orderSn">
                    <el-input auto-complete="off" v-model="adoptOrderInfo.orderSn"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input auto-complete="off" v-model="adoptOrderInfo.price"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <template scope="scope">
                        <span style="color: green" v-if="adoptOrderInfo.state==0">待支付</span>
                        <span style="color: red" v-else-if="adoptOrderInfo.state==1">已支付</span>
                        <span style="color: red" v-else-if="adoptOrderInfo.state==2">待发货</span>
                        <span style="color: gray" v-else>未知</span>
                    </template>
                </el-form-item>
                <el-form-item label="最后支付时间" prop="lastPayTime">
                    <el-input auto-complete="off" v-model="adoptOrderInfo.lastPayTime"></el-input>
                </el-form-item>

                <el-form-item label="服务名称" prop="manager">
                    <el-input auto-complete="off" readonly="readonly" v-model="adoptOrderInfo.product.name"></el-input>
                </el-form-item>
                <el-form-item label="买家" prop="parent">
                    <el-input auto-complete="off" readonly="readonly" v-model="adoptOrderInfo.user.username"></el-input>
                </el-form-item>
                <el-form-item label="门店" prop="parent">
                    <el-input auto-complete="off" readonly="readonly" v-model="adoptOrderInfo.shop.name"></el-input>
                </el-form-item>
                <el-form-item label="买家地址" prop="parent">
                    <el-input auto-complete="off" readonly="readonly" v-model="adoptOrderInfo.orderAddress.fullAddress"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="close">取消</el-button>
            </div>
        </el-dialog>


    </section>
</template>

<script>

    import {quillEditor} from "vue-quill-editor"; //调用编辑器
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
                quillOption: quilConfig,
                filters: {
                    keyWord: ''
                },
                productOrders: [],
                fileList: [],
                total: 0,
                pageSize: 10,
                currentPage: 1,
                listLoading: false,
                keyWord: '',
                sels: [],//列表选中列
                adoptOrderInfoVisible: false,//编辑界面是否显示
                productOrderLoading: false,

                productOrderFormRules: {
                    name: [
                        {required: true, message: '请输入部门名称', trigger: 'blur'}
                    ],
                },
                //订单详细数据
                adoptOrderInfo: {
                    digest: '',
                    state: '',
                    price: 0,
                    orderSn: '',
                    paySn: '',
                    lastPayTime: '',
                    lastConfirmTime: '',
                    orderAddress: {},
                    user: {},
                    shop: {},
                    product:{}
                }
                ,
            }
        },
        methods: {
            close(){
                this.adoptOrderInfoVisible=false
            },
            queryPlus() {
                this.currentPage = 1;
                this.getProductOrders();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getProductOrders();
            },
            //获取宠物
            getProductOrders: function () {
                let para = {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    keyWord: this.keyWord,
                };
                this.listLoading = true;
                this.$http.post("/productOrder/admin", para).then(res => {
                    res = res.data
                    this.total = res.total;
                    this.productOrders = res.rows;
                    this.listLoading = false;
                })
            },
            //显示详细页面
            handleEdit: function (index, row) {
                this.adoptOrderInfoVisible=true
                this.$http.post("/productOrder/detail/" + row.id).then(res => {
                    res=res.data
                    if(res.success){
                        this.adoptOrderInfo=res.object
                    }else {
                        this.$message({
                            message: res.message,
                            type: 'success'
                        });
                    }
                })
            },
        },
        mounted() {
            this.getProductOrders();
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