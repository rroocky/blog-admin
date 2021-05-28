import request from "@/utils/request"
export default {
    // 分页条件查询
    getList(query, current = 1, size = 20) {
        return request({
            url: `/article/label/search`,
            method: "post",
            data: {
                ...query,
                current,
                size
            }
        })
    },
    // 新增标签
    add(data) {
        return request({
            url: `/article/label`,
            method: "post",
            data: {
                ...data
            }
        })
    },
    // 根据id获取label信息
    getLabelById(id) {
        return request({
            url: `/article/label/${id}`,
            method: "get"
        })
    },
    // 更新标签
    updata(data) {
        return request({
            url: `/article/label`,
            method: "put",
            data: {
                ...data
            }
        })
    },
    //删除标签
    delete(id) {
        return request({
            url: `/article/label/${id}`,
            method: "delete"
        })
    }
}