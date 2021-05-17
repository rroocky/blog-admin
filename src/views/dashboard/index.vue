<template>
    <div class="dashboard-container">
        <div class="dashboard-text">name: {{ name }}</div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import testApi from "@/api/test";

export default {
    name: "Dashboard",
    computed: {
        ...mapGetters(["name"]),
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            testApi.getData().then((response) => {
                console.log(response);
                console.log(response.data);
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
