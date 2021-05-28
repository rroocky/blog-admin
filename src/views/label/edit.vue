<template>
    <div>
        <el-dialog
            :title="title"
            :visible.sync="visible"
            width="500px"
            :before-close="handleClose"
        >
            <el-form
                :rules="rules"
                ref="formData"
                :model="formData"
                label-width="100px"
                label-position="right"
                style="width: 400px"
                status-icon
            >
                <el-form-item label="标签名称：" prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="所属分类：" prop="catergory">
                    <el-select
                        v-model="formData.catergory"
                        clearable
                        filterable
                        style="width: 100%"
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
                        type="primary"
                        @click="submitForm('formData')"
                        size="mini"
                        >确定</el-button
                    >
                    <el-button size="mini" @click="handleClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import api from "@/api/label";
export default {
    props: {
        title: {
            // 弹窗的标题
            type: String,
            default: "",
        },
        visible: {
            // 弹出窗口，true弹出
            type: Boolean,
            default: false,
        },
        formData: {
            // 提交表单数据
            type: Object,
            default: {},
        },
        remoteClose: Function, // 用于关闭窗口
        // 正常状态的分类列表
        ableCatergoryList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入标签名称",
                        trigger: "blur",
                    },
                ],
                catergory: [
                    {
                        required: true,
                        message: "请选择分类",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        console.log(this.ableCatergoryList);
    },
    methods: {
        // 取消按钮事件
        handleClose() {
            this.remoteClose();
        },
        // 确定按钮事件
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 校验通过，提交表单数据
                    this.submitData();
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        // 提交表单
        async submitData() {
            let res = null;

            if (this.formData.id) {
                //formData有id的话那是编辑调出的弹出框
                res= await api.updata(this.formData)
            } else {
                // 没有id是新增调用的弹出框
                res = await api.add(this.formData);
            }
            if (res.code === 20000) {
                this.$message({
                    message: "保存成功",
                    type: "success",
                });
                //关闭窗口
                this.handleClose();
            } else {
                this.$message({
                    message: "保存失败",
                    type: "error",
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
</style>