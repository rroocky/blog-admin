import request from "@/utils/request"

export default {
    // 分页查询列表
    getList(query, current = 1, size = 20) {
        return request({
            url: `article/catergory/search`,
            method: 'post',
            data: {
                ...query,
                current,
                size
            }
        })
    },
    // 新增分类
    addCatergory(query) {
        return request({
            url: "article/catergory/add",
            method: "post",
            data: {
                ...query
            }
        })
    },
    // 通过id获取分类信息\
    getCatergoryById(id) {
        return request({
            url: `article/catergory/${id}`,
            method: "get",
        })
    },
    // 提交编辑后的分类信息
    editCatergory(query) {
        return request({
            url: "article/catergory/edit",
            method: "post",
            data: {
                ...query
            }
        })
    }
}