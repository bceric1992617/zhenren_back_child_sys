<template>
<div>
    <el-aside>
        <SideMenu :items="items"></SideMenu>
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
</div>
</template>

<script>
import SideMenu from '@/components/sidemenu/SideMenu';
export default {
    components: {
        SideMenu
    },
    data() {
        return {
            items: [
                {
                    index: 'tradeList',
                    title: '交易单查询'
                },
                {
                    index: 'userList',
                    title: '用户管理'
                },
            ]
        }
    },
};
</script>

<style>
</style>
