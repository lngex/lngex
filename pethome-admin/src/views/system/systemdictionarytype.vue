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
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="systemDictionaryDetailFormVisible" :close-on-click-modal="false">
			<el-form :model="systemDictionaryDetailForm" label-width="80px" :rules="systemDictionaryDetailFormRules" ref="systemDictionaryDetailForm">
				<el-form-item label="词典名称" prop="name">
					<el-input v-model="systemDictionaryDetailForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="词典类型" prop="managerId">
					<!-- value-key若为引用类型，value-key必选，映射:key -->
					<el-select v-model="systemDictionaryDetailForm.types" value-key="id" placeholder="请选择">
						<!-- v-for遍历集合
                            :key：作为唯一索引
                            :label：选中后的显示数据
                            :value：返回给服务器的值
                         -->
						<el-option
								v-for="item in systemDictionaryTypes"
								:key="item.id"
								:label="item.name"
								:value="item">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="systemDictionaryDetailFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="systemDictionaryDetailSubmit" :loading="systemDictionaryDetailLoading">提交</el-button>
			</div>
		</el-dialog>

		<el-drawer
				title="用户字典详细"
				:visible.sync="drawer"
				size="40%">
			<div>
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
				<el-table :data="systemDictionaryDetails" highlight-current-row v-loading="listLoading" @selection-change="sselsChange" style="width: 100%;">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column type="index" width="60">
					</el-table-column>
					<el-table-column prop="name" label="词典名称" width="240" sortable>
					</el-table-column>
					<el-table-column prop="types.name" label="词典类型" sortable>
					</el-table-column>
					<el-table-column label="操作" width="240px">
						<template slot="header" slot-scope="scope">
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="danger" size="small" @click="shandleAdd">新增</el-button>
						</template>
						<template scope="scope">
							<el-button size="small" @click="shandleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button type="danger" size="small" @click="shandleDel(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-button type="danger" @click="sbatchRemove" :disabled="this.ssels.length===0">批量删除批量删除</el-button>
					<el-pagination
							layout="prev, pager, next"
							@current-change="shandleCurrentChange"
							:current-page="scurrentPage"
							:page-size="spageSize"
							:total="stotal"
							style="float:right;">
					</el-pagination>
				</el-col>
			</div>
		</el-drawer>
	</section>
</template>
	//1.先使用import导入你要在该组件中使用的子组件


<script scoped>

	//import NProgress from 'nprogress'

	export default {
		data() {
			return {
				sfilters: {
					skeyWord: ''
				},
				systemDictionaryDetails: [],
				stotal: 0,
				spageSize: 10,
				scurrentPage:1,
				slistLoading: false,
				skeyWord:'',
				ssels: [],//列表选中列
				sid:null,
				/* 员工集合 */
				ssystemDictionaryTypes:[],
				systemDictionaryDetailFormVisible: false,//编辑界面是否显示
				systemDictionaryDetailLoading: false,
				systemDictionaryDetailFormRules: {
					name: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					sn: [
						{ required: true, message: '请输入部门编号', trigger: 'blur' }
					]
				},
				//新增或者编辑界面数据
				systemDictionaryDetailForm: {
					id: null,
					name: '',
					types: null,
				},

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

			getSystemDictionaryTypeList(){
				this.$http.get("/sdt")
						.then(res=>{
							this.ssystemDictionaryTypes=res.data
						})
			},
			squeryPlus(){
				this.scurrentPage=1;
				this.getSystemDictionaryDetails();
			},
			shandleCurrentChange(val) {
				this.scurrentPage = val;
				this.getSystemDictionaryDetails();
			},
			//获取部门列表
			getSystemDictionaryDetails: function () {
				let para = {
					currentPage: this.scurrentPage,
					pageSize: this.spageSize,
					keyWord:this.skeyWord,
					id:this.sid
				};
				this.slistLoading = true;
				//NProgress.start();
				/*getSystemDictionaryDetailListPage(para).then((res) => {
					this.stotal = res.data.stotal;
					this.systemDictionaryDetails = res.data.systemDictionaryDetails;
					this.slistLoading = false;
					//NProgress.done();
				});*/
				this.$http.post("/sdd", para).then(res => {
					res=res.data
					this.stotal = res.total;
					this.systemDictionaryDetails = res.rows;
					this.slistLoading = false;
				})
			},
			//删除
			shandleDel: function (index, row) {

				this.$confirm('确认删除该记录吗?', '温馨提示', {
					type: 'warning'
				}).then(() => {
					this.slistLoading = true;
					//NProgress.start();
					this.$http.delete("/sdd/"+row.id,{}).then(res => {
						this.slistLoading = false;
						//NProgress.done();
						res = res.data
						this.$message({
							message: res.message,
							type: 'success'
						});
						this.getSystemDictionaryDetails();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			shandleEdit: function (index, row) {
				this.systemDictionaryDetailFormVisible = true;
				this.systemDictionaryDetailForm = Object.assign({}, row)
			},
			//显示新增界面
			shandleAdd: function () {
				this.systemDictionaryDetailFormVisible = true;
				this.systemDictionaryDetailForm = {
					id: null,
					name: '',
					types: null,
				};
			},
			//编辑
			systemDictionaryDetailSubmit: function () {
				this.$refs.systemDictionaryDetailForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.systemDictionaryDetailLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.systemDictionaryDetailForm);
							if(para.parent) {
								para.parent = {id: para.parent[para.parent.length - 1]}
							}
							this.$http.put("/sdd",para).then(res => {
								res=res.data
								this.slistLoading = false;
								if(res.success){
									//NProgress.done();
									this.$message({
										message: res.message,
										type: 'success'
									});
									this.getSystemDictionaryDetails();
								}else {
									this.$message({
										message: res.message,
										type: 'error',
									});
								}
								this.systemDictionaryDetailFormVisible = false;
								this.systemDictionaryDetailLoading = false;
								this.$refs['systemDictionaryDetailForm'].resetFields();
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
			sselsChange: function (ssels) {
				this.ssels = ssels;
			},
			//批量删除
			sbatchRemove: function () {
				var ids = this.ssels.map(item => item.id)
				this.$confirm('确认删除选中记录吗？', '温馨提示', {
					type: 'warning'
				}).then(() => {
					this.slistLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					this.$http.patch("/sdd",ids).then(res=>{
						res=res.data
						this.slistLoading = false;
						if(res.success){
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getSystemDictionaryDetails();
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
			},
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
				this.sid=row.id
				this.drawer = true;
				this.getSystemDictionaryDetails();

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
			this.getSystemDictionaryDetails();
			this.getSystemDictionaryTypeList();
		},
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