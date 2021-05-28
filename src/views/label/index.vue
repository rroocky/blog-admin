<template>
    <div class="app-container">
        <!-- 条件查询 -->
        <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="标签名称：" clearable>
                <el-input v-model.trim="query.name"></el-input>
            </el-form-item>
            <el-form-item label="分类名称：">
                <el-select
                    v-model="query.catergory"
                    clearable
                    filterable
                    style="width: 85px"
                >
                    <el-option
                        v-for="item in ableCatergoryList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    icon="el-icon-search"
                    type="primary"
                    @click="queryData"
                    >查询</el-button
                >
                <el-button icon="el-icon-refresh" @click="reset"
                    >重置</el-button
                >
                <el-button
                    icon="el-icon-circle-plus-outline"
                    type="primary"
                    @click="openAdd"
                    >新增</el-button
                >
            </el-form-item>
        </el-form>
        <!-- 列表数据 -->
        <!-- stripe 带斑马纹 -->
        <el-table :data="list" stripe border style="width: 100%">
            <el-table-column
                align="center"
                type="index"
                label="序号"
                width="60"
            ></el-table-column>
            <el-table-column
                align="center"
                prop="name"
                label="标签名称"
            ></el-table-column>
            <el-table-column
                align="center"
                prop="catergory"
                label="分类"
            ></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button
                        type="success"
                        @click="handleEdit(scope.row.id)"
                        size="mini"
                        >编辑</el-button
                    >
                    <el-button
                        type="danger"
                        @click="handleDelete(scope.row.id)"
                        size="mini"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.current"
            :page-sizes="[10, 20, 50]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
        >
        </el-pagination>
        <!-- 新增和编辑的弹出框组件 -->
        <edit
            :title="edit.title"
            :visible="edit.visible"
            :formData="edit.formData"
            :ableCatergoryList="ableCatergoryList"
            :remoteClose="closeDialog"
        ></edit>
    </div>
</template>

<script>
import api from "@/api/label";
import catergotyApi from "@/api/catergory";
import Edit from "./edit";
export default {
    data() {
        return {
            // 分页数据
            page: {
                size: 0,
                current: 0,
                total: 0,
            },
            // 列表数据
            list: [],
            // 分页查询条件
            query: {},
            // 正常状态的分类列表
            ableCatergoryList: [],
            // 新增和编辑弹出框的数据
            edit: {
                title: "",
                visible: false,
                formData: {},
            },
        };
    },
    components: {
        Edit,
    },
    created() {
        this.fetchData();
        this.getAbleCatergory();
    },
    methods: {
        // 获取分页查询列表
        fetchData() {
            api.getList(this.query, this.page.current, this.page.size).then(
                (data) => {
                    if (data.code === 20000) {
                        let responese = data.data;
                        this.page.total = responese.total;
                        this.list = responese.records;
                    }
                }
            );
        },
        // 分页条数[20,50,100]点击处理
        handleSizeChange(size) {
            this.page.size = size;
        },
        // 页码跳转点击处理
        handleCurrentChange(current) {
            this.page.current = current;
        },
        // 编辑按钮处理事件
        async handleEdit(id) {
            let res = null;
            res = await api.getLabelById(id);
            if (res.code === 20000) {
                this.edit.formData = res.data;
            }
            this.edit.title = "编辑";
            this.edit.visible = true;
        },
        // 删除按钮处理事件
        async handleDelete(id) {
            this.$confirm("确认删除这条记录吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    api.delete(id).then((res) => {
                        if (res.code === 20000) {
                            this.$message({
                                message: res.message,
                                type: "success",
                            });
                        }
                    });
                })
                .catch(() => {
                    // 取消删除，不做操作
                });
        },
        // 获取正常状态的分类列表
        getAbleCatergory() {
            catergotyApi.getAbleCatergory().then((data) => {
                if (data.code === 20000) {
                    this.ableCatergoryList = data.data;
                }
            });
        },
        // 条件查询按钮处理事件
        queryData() {
            // 将页面还原到1
            this.page.current = 1;
            this.fetchData();
        },
        // 新增按钮处理事件
        openAdd() {
            this.edit.visible = true;
        },
        // 重置按钮处理事件
        reset() {
            this.query = {};
            // 重置之后要把过滤后的数据还原回去
            this.fetchData();
        },
        // 弹出框子组件edit的关闭事件会触发该事件
        closeDialog() {
            this.edit.formData = {};
            this.edit.visible = false;
        },
    },
};
</script>

<style lang="scss" scoped>
</style>