import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect:'/dataCenter/registerList',
        },
        {
            path: '/',
            component: () => import('../components/common/Whole.vue'),
            meta: {
                title: '整体页面布局'
            },
            children: [




                {
                    path: '/dataCenter',
                    component: () => import('../page/dataCenter/index.vue'),
                    meta: {
                        title: '数据中心'
                    },
                    redirect:'/dataCenter/registerList',
                    children:[
                        {
                            path: 'registerList',
                            component: () => import('../page/dataCenter/registerList.vue'),
                            meta: {
                                title: '注册查询'
                            }
                        },
                        {
                            path: 'tradeList',
                            component: () => import('../page/dataCenter/tradeList.vue'),
                            meta: {
                                title: '交易记录查询'
                            }
                        },
                        {
                            path: 'tradeRecord',
                            component: () => import('../page/dataCenter/tradeRecord.vue'),
                            meta: {
                                title: '账变记录'
                            }
                        },
                    ]
                },





                {
                    path: '/404',
                    component: () => import('../page/404.vue'),
                    meta: {
                        title: '404'
                    }
                },
                {
                    path: '/403',
                    component: () => import('../page/403.vue'),
                    meta: {
                        title: '403'
                    }
                },
            ]
        },
        {
            // 登录页面
            path: '/login',
            component: () => import('../page/Login.vue'),
            meta: {
                title: '登录'
            }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});