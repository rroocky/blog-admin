import request from '@/utils/request'
export default {
    getList(query, current = 1, size = 2) {
        return request({
            url: `/article/article/search`,
            method: "post",
            data: {
                current,
                size,
                ...query
            }
        })
    }
}