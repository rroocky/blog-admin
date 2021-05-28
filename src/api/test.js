import request from "@/utils/request"

export default {
    getData() {
        return request({
            method: 'post',
            url: '/test',
            data: {
                name: 'xiaoming'
            }
        })
    }
}