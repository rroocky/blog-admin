<template>
    <div class="app-container">
        <el-form
            :inline="true"
            :model="query"
            class="demo-form-inline"
            size="mini"
            ref="searchForm"
        >
            <el-form-item label="分类名称" prop="name">
                <el-input
                    v-model="query.name"
                    placeholder="分类名称"
                ></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="query.status" placeholder="分类状态">
                    <el-option label="正常" value="0"></el-option>
                    <el-option label="禁用" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm('searchForm')" prefix-icon="reset"
                    >重置</el-button
                >
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addCatergory('dialogForm')"
                    >新增</el-button
                >
            </el-form-item>
        </el-form>
        <el-table :data="list" border style="width: 100%" height="450" stripe>
            <el-table-column
                type="index"
                width="100"
                label="索引"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="分类名称"
                width="180"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="sort"
                label="排序"
                width="100"
                align="center"
            >
            </el-table-column>
            <el-table-column prop="remark" label="备注" align="center">
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{
                        scope.row.status ? "正常" : "禁用"
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-row>
                        <el-button
                            type="success"
                            size="small"
                            @click="handleEdit(scope.row.id, 'dialogForm')"
                            >编辑</el-button
                        >
                        <el-button
                            type="danger"
                            size="small"
                            @click="handleDelete(scope.row.id)"
                            >删除</el-button
                        >
                    </el-row>
                </template>
            </el-table-column>
        </el-table>

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
        <!-- 新增 编辑 分类对话框 -->
        <el-dialog
            title="收货地址"
            :visible.sync="dialogFormVisible"
            width="500px"
        >
            <el-form :model="dialogForm" label-width="100px" ref="dialogForm">
                <el-form-item label="分类名称" prop="name">
                    <el-input
                        v-model="dialogForm.name"
                        autocomplete="off"
                        width="300px"
                    ></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="dialogForm.status">
                        <el-radio label="正常" value="1"></el-radio>
                        <el-radio label="禁用" value="0"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number
                        v-model="dialogForm.sort"
                        :min="1"
                        :max="20"
                        style="width: 100%"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input
                        type="textarea"
                        v-model="dialogForm.remark"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="addCatergorySubmit"
                    v-show="whoOpenDialog === 'addButton'"
                    >确 定</el-button
                >
                <el-button
                    type="primary"
                    @click="editCatergorySubmit"
                    v-show="whoOpenDialog === 'editButton'"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import catergoryApi from "@/api/catergory";
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
            query: {
                name: "",
                status: "",
            },
            dialogFormVisible: false,
            dialogForm: {
                id: "",
                name: "",
                status: "",
                sort: "",
                remark: "",
            },
            whoOpenDialog: "",
        };
    },
    filters: {
        statusFilter(status) {
            const statusMap = { 0: "danger", 1: "success" };
            return statusMap[status];
        },
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            catergoryApi
                .getList(this.query, this.page.current, this.page.size)
                .then((response) => {
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
            console.log(this.page.size);
            this.fetchData();
        },
        handleCurrentChange(current) {
            this.page.current = current;
            this.fetchData();
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        onSubmit() {
            this.fetchData();
        },
        addCatergory(formName) {
            this.whoOpenDialog = "addButton";
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.resetForm(formName);
            });
        },
        addCatergorySubmit() {
            catergoryApi
                .addCatergory(this.dialogForm)
                .then((response) => {
                    if (response.code === 20000) {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: "success",
                        });
                    }
                })
                .catch((err) => {
                    this.$message({
                        showClose: true,
                        message: err,
                        type: "error",
                    });
                });
            this.dialogFormVisible = false;
        },
        handleEdit(id, formName) {
            this.whoOpenDialog = "editButton";
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.resetForm(formName);
            });
            catergoryApi
                .getCatergoryById(id)
                .then((response) => {
                    if (response.code === 20000) {
                        let data = response.data;
                        this.dialogForm.id = data.id;
                        this.dialogForm.name = data.name;
                        this.dialogForm.status = data.status;
                        this.dialogForm.sort = data.sort;
                        this.dialogForm.remark = data.remark;
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
        editCatergorySubmit() {
            catergoryApi
                .editCatergory(this.dialogForm)
                .then((response) => {
                    if (response.code === 20000) {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: "success",
                        });
                    }
                })
                .catch((err) => {
                    this.$message({
                        showClose: true,
                        message: err,
                        type: "error",
                    });
                });
            this.dialogFormVisible = false;
        },
        handleDelete() {},
    },
};
</script>

<style lang="scss" scoped>
.text-center {
    text-align: center;
}
.block {
    margin-top: 5px;
    margin-bottom: 15px;
}
</style>