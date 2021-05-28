<template>
    <div class="app-container">
        <!-- 条件查询 -->
        <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="标题：">
                <el-input v-model.trim="query.title"></el-input>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select
                    v-model="query.status"
                    clearable
                    filterable
                    style="width: 85px"
                >
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
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
                <el-button icon="el-icon-refresh" @click="reload"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>
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
                prop="title"
                label="文章标题"
            ></el-table-column>
            <el-table-column
                align="center"
                prop="viewCount"
                label="浏览数"
            ></el-table-column>
            <el-table-column
                align="center"
                prop="thumhup"
                label="点赞数"
            ></el-table-column>
            <el-table-column align="center" prop="ispublic" label="是否公开">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 0" type="danger"
                        >不公开</el-tag
                    >
                    <el-tag v-else type="success">公开</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="审核状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 0" type="danger"
                        >已删除</el-tag
                    >
                    <el-tag v-if="scope.row.status === 1" type="warning"
                        >审核不通过</el-tag
                    >
                    <el-tag v-if="scope.row.status === 2" type="primary"
                        >未审核</el-tag
                    >
                    <el-tag v-if="scope.row.status === 3" type="success"
                        >审核通过</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="updateDate"
                label="最后更新时间"
                width="200"
            >
                <template slot-scope="scope">
                    {{ getFormat(scope.row.updateDate) }}
                </template>
            </el-table-column>
            <el-table-column align="left" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        @click="handleEdit(scope.row.id)"
                        size="mini"
                        >查看</el-button
                    >
                    <el-button
                        type="success"
                        @click="handleEdit(scope.row.id)"
                        size="mini"
                        v-if="scope.row.status === 2"
                        >审核</el-button
                    >
                    <el-button
                        type="danger"
                        @click="handleDelete(scope.row.id)"
                        size="mini"
                        v-if="scope.row.status !== 0"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.current"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="page.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import articleApi from "@/api/article";
import { dateFormat } from "@/utils/date";
let statusOptions = [
    { code: 0, name: "已删除" },
    { code: 1, name: "审核不通过" },
    { code: 2, name: "未审核" },
    { code: 3, name: "审核通过" },
];
export default {
    name: "Catergory",
    data() {
        return {
            // 列表数据
            list: [],
            // 分页信息
            page: {
                current: 1,
                size: 20,
                total: 0,
            },
            // 查询条件
            query: {},
            statusOptions,
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            articleApi
                .getList(this.query, this.page.current, this.page.size)
                .then((response) => {
                    console.log(response);
                    if (response.code === 20000) {
                        this.list = response.data.records;
                        this.page.total = response.data.total;
                    }
                })
                .catch((err) => {
                    this.$message({
                        showClose: true,
                        message: err,
                        type: "error",
                    });
                });
        },
        handleSizeChange(size) {
            this.page.size = size;
            this.fetchData();
        },
        handleCurrentChange(current) {
            this.page.current = current;
            this.fetchData();
        },
        // 调用此方法格式化日期
        getFormat(date) {
            return dateFormat(date);
        },
        // 查询条件重置
        reload() {
            this.query = {};
        },
        // 查询按钮点击事件
        queryData() {
            this.fetchData();
        },
    },
};
</script>

<style lang="scss" scoped>
</style>