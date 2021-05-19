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

			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="systemDictionaryTypes" highlight-current-row v-loading="listLoading" @row-dblclick="showSddTable" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name"
							 label="词典类型"
							 width="240" sortable>
			</el-table-column>
			<el-table-column prop="sn" label="词典类型编号"sortable>
			</el-table-column>
			<el-table-column label="操作" width="240px">
				<template slot="header" slot-scope="scope">
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="danger" size="small" @click="handleAdd">新增</el-button>
				</template>
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
		<el-dialog title="编辑" :visible.sync="systemDictionaryTypeFormVisible" :close-on-click-modal="false">
			<el-form :model="systemDictionaryTypeForm" label-width="80px" :rules="systemDictionaryTypeFormRules" ref="systemDictionaryTypeForm">
				<el-form-item label="词典类型" prop="name">
					<el-input v-model="systemDictionaryTypeForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型编号" prop="sn">
					<el-input v-model="systemDictionaryTypeForm.sn" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="systemDictionaryTypeFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="systemDictionaryTypeSubmit" :loading="systemDictionaryType">提交</el-button>
			</div>
		</el-dialog>


		<el-drawer
				title="用户字典详细"
				:visible.sync="drawer"
				size="70%">
			<div>
				<template>
					<Systemdictionarydetail ref="Systemdictionarydetail">
						<!-- 3.在template中就可以直接使用了 -->
						<Systemdictionarydetail></Systemdictionarydetail>
					</Systemdictionarydetail>
				</template>
			</div>
		</el-drawer>
	</section>
</template>
	//1.先使用import导入你要在该组件中使用的子组件


<script scoped>

	import Systemdictionarydetail from './systemdictionarydetail.vue'
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getSystemDictionaryTypeListPage, removeSystemDictionaryType, batchRemoveSystemDictionaryType, systemDictionaryTypeSystemDictionaryType, addSystemDictionaryType } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					keyWord: ''
				},
				systemDictionaryTypes: [],
				total: 0,
				pageSize: 10,
				currentPage:1,
				listLoading: false,
				keyWord:'',
				/* 用于批量删除 */
				sels: [],//列表选中列
				/* 类型集合 */
				emps:[],
				/* 父部门 */
				parents:[],
				/* 详细页面开关 */
				drawer:false,
				/* 子表单 */
				innerDrawer:false,
				/* 子字典 */
				sdds: {
					id:null,
					s:[]
				},
				systemDictionaryTypeFormVisible: false,//编辑界面是否显示
				systemDictionaryType: false,
				systemDictionaryTypeFormRules: {
					name: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					sn: [
						{ required: true, message: '请输入部门编号', trigger: 'blur' }
					]
				},
				//新增或者编辑界面数据
				systemDictionaryTypeForm: {
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
			sddhandleDelete:function (index, row){
				this.$confirm('确认删除该记录吗?', '温馨提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					this.$http.delete("/sdd/"+row.id,{}).then(res => {
						this.listLoading = false;
						//NProgress.done();
						res = res.data
						this.$message({
							message: res.message,
							type: 'success'
						});
						this.getSystemDictionaryTypes();
					});
				}).catch(() => {
					this.$message({
						message: "操作失败",
						type: 'error'
					});
				});
			},
			showSddTable(row, column, event){
				this.$nextTick(()=>{
					this.$refs.Systemdictionarydetail.getTypeId(row.id)
				})
				this.drawer = true;
				this.sdds ={
					id:row.id,
					s:row.children
				}

			},
			queryPlus(){
				this.currentPage=1;
				this.getSystemDictionaryTypes();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getSystemDictionaryTypes();
			},
			//获取部门列表
			getSystemDictionaryTypes: function () {
				let para = {
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					keyWord:this.keyWord
				};
				this.listLoading = true;
				//NProgress.start();
				/*getSystemDictionaryTypeListPage(para).then((res) => {
					this.total = res.data.total;
					this.systemDictionaryTypes = res.data.systemDictionaryTypes;
					this.listLoading = false;
					//NProgress.done();
				});*/
				this.$http.post("/sdt", para).then(res => {
					res=res.data
					this.total = res.total;
					this.systemDictionaryTypes = res.rows;
					this.listLoading = false;
					/* 判断Id */
					for (let i=0;i<this.systemDictionaryTypes.length;i++){
						if(this.systemDictionaryTypes[i].id == this.sdds.id){
							this.sdds.s=this.systemDictionaryTypes[i].children
						}
					}
				})
			},
			//删除
			handleDel: function (index, row) {

				this.$confirm('确认删除该记录吗?', '温馨提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					this.$http.delete("/sdt/"+row.id,{}).then(res => {
						this.listLoading = false;
						//NProgress.done();
						res = res.data
						this.$message({
							message: res.message,
							type: 'success'
						});
						this.getSystemDictionaryTypes();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.systemDictionaryTypeFormVisible = true;
				this.systemDictionaryTypeForm = Object.assign({}, row)
				let arr = row.dirPath.split("/")
				console.log(arr)
			  if(arr.length>2&&arr.length<=3){
					this.systemDictionaryTypeForm.parent = [parseInt(arr[1])]
				}else if(arr.length>3) {
					this.systemDictionaryTypeForm.parent = [parseInt(arr[arr.length - 3]), parseInt(arr[arr.length - 2])]
				}

			},
			//显示新增界面
			handleAdd: function () {
				this.systemDictionaryTypeFormVisible = true;
				this.systemDictionaryTypeForm = {
					id: null,
					name: '',
					sn: '',
					state: -1,
					manager: null,
					parent: {}
				};
			},
			//显示新增界面
			sddhandleAdd: function () {
				this.systemDictionaryTypeFormVisible = true;
				this.systemDictionaryTypeForm = {
					id: null,
					name: '',
					sn: '',
					state: -1,
					manager: null,
					parent: {}
				};
			},
			//编辑
			systemDictionaryTypeSubmit: function () {
				this.$refs.systemDictionaryTypeForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.systemDictionaryType = true;
							//NProgress.start();
							let para = Object.assign({}, this.systemDictionaryTypeForm);
							if(para.parent) {
								para.parent = {id: para.parent[para.parent.length - 1]}
							}
							this.$http.put("/sdt",para).then(res => {
								res=res.data
								this.listLoading = false;
								if(res.success){
									//NProgress.done();
									this.$message({
										message: res.message,
										type: 'success'
									});
									this.getSystemDictionaryTypes();
								}else {
									this.$message({
										message: res.message,
										type: 'error',
									});
								}
								this.systemDictionaryTypeFormVisible = false;
								this.systemDictionaryType = false;
								this.$refs['systemDictionaryTypeForm'].resetFields();
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
					this.$http.patch("/sdt",ids).then(res=>{
						res=res.data
						this.listLoading = false;
						if(res.success){
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
							this.getSystemDictionaryTypes();
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
			this.getSystemDictionaryTypes();
		},
		components: {Systemdictionarydetail}
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