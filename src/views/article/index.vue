<template>
    <div>
        <h1>{{ page.total }}</h1>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.current"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import articleApi from "@/api/catergory";
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
                        this.page.list = response.data.records;
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
            this.fetchData();
        },
        handleCurrentChange(current) {
            this.fetchData()
        },
    },
};
</script>

<style lang="scss" scoped>
</style>