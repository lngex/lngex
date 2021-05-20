<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="keyWord" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="queryPlus">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="shops" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="商家名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="tel" label="商家电话" width="120" sortable>
			</el-table-column>
			<el-table-column prop="registerTime" label="入驻时间" width="120" sortable>
			</el-table-column>
			<el-table-column prop="state" label="商家状态" width="120" :formatter="formatSex" sortable>
				<template scope="scope">
					<span v-if="scope.row.state == 0" style="color: green">待审核</span>
					<span v-else-if="scope.row.state == 1" style="color: green">开业</span>
					<span v-else-if="scope.row.state == 2" style="color: green">歇业</span>
					<span v-else-if="scope.row.state == -1" style="color: red">未通过</span>
					<span v-else style="color: pink">什么也没有</span>
				</template>
			</el-table-column>
			<el-table-column prop="admin.username" label="管理员" width="240" sortable>
			</el-table-column>
			<el-table-column prop="address" label="地址"sortable>
			</el-table-column>
			<el-table-column prop="logo" label="logo"sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination
					layout="prev, pager, next"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:page-size="pageSize"
					:total="total"
					style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="shopFormVisible" :close-on-click-modal="false">
			<el-form :model="shopForm" label-width="80px" :rules="shopFormRules" ref="shopForm">
				<el-form-item label="商家名称" prop="name">
					<el-input v-model="shopForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商家电话" prop="tel">
					<el-input v-model="shopForm.tel" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="商家状态">
					<el-radio-group v-model="shopForm.state">
						<el-radio class="radio" :label="0">待审核</el-radio>
						<el-radio class="radio" :label="1">营业</el-radio>
						<el-radio class="radio" :label="2">歇业</el-radio>
						<el-radio class="radio" :label="-1">拒绝通过</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="管理员" prop="managerId">
					<!-- value-key若为引用类型，value-key必选，映射:key -->
					<el-select v-model="shopForm.admin" value-key="id" placeholder="请选择">
						<!-- v-for遍历集合
							:key：作为唯一索引
							:label：选中后的显示数据
							:value：返回给服务器的值
						 -->
						<el-option
								v-for="item in emps"
								:key="item.id"
								:label="item.username"
								:value="item">
							<span style="float: left">{{ item.username }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地址" prop="address">
					<el-input v-model="shopForm.address" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="shopFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="shopSubmit" :loading="shopLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getShopListPage, removeShop, batchRemoveShop, shopShop, addShop } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					keyWord: ''
				},
				shops: [],
				total: 0,
				pageSize: 10,
				currentPage:1,
				listLoading: false,
				keyWord:'',
				sels: [],//列表选中列
				/* 员工集合 */
				emps:[],
				/* 父部门 */
				parents:[],
				shopFormVisible: false,//编辑界面是否显示
				shopLoading: false,
				shopFormRules: {
					name: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					sn: [
						{ required: true, message: '请输入部门编号', trigger: 'blur' }
					]
				},
				//新增或者编辑界面数据
				shopForm: {
					id: null,
					name: '',
					tel: '',
					state: -1,
					admin: null,
					logo: null,
					address: null,
					registerTime:null
				},

			}
		},
		methods: {
			getManagerList(){
				this.$http.get("/emp")
				.then(res=>{
					this.emps=res.data
				})
			},
			queryPlus(){
				this.currentPage=1;
				this.getShops();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getShops();
			},
			//获取部门列表
			getShops: function () {
				let para = {
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					keyWord:this.keyWord
				};
				this.listLoading = true;
				//NProgress.start();
				/*getShopListPage(para).then((res) => {
					this.total = res.data.total;
					this.shops = res.data.shops;
					this.listLoading = false;
					//NProgress.done();
				});*/
				this.$http.post("/shop", para).then(res => {
					res=res.data
					this.total = res.total;
					this.shops = res.rows;
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
					this.$http.delete("/shop/"+row.id,{}).then(res => {
						this.listLoading = false;
						//NProgress.done();
						res = res.data
						this.$message({
							message: res.message,
							type: 'success'
						});
						this.getShops();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.shopFormVisible = true;
				this.shopForm = Object.assign({}, row)

			},
			//显示新增界面
			handleAdd: function () {
				this.getCasecade()
				this.shopFormVisible = true;
				this.shopForm = {
					id: null,
					name: '',
					sn: '',
					state: -1,
					manager: null,
					parent: {}
				};
			},
			//编辑
			shopSubmit: function () {
				this.$refs.shopForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.shopLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.shopForm);
							if(para.parent) {
								para.parent = {id: para.parent[para.parent.length - 1]}
							}
							this.$http.put("/shop",para).then(res => {
								res=res.data
								this.listLoading = false;
								if(res.success){
									//NProgress.done();
									this.$message({
										message: res.message,
										type: 'success'
									});
									this.getShops();
								}else {
									this.$message({
										message: res.message,
										type: 'error',
									});
								}
								this.shopFormVisible = false;
								this.shopLoading = false;
								this.$refs['shopForm'].resetFields();
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
					let para = { ids: ids };
					this.$http.patch("/shop",ids).then(res=>{
						res=res.data
						this.listLoading = false;
						if(res.success){
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
							this.getShops();
						}else {
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
			this.getShops();
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