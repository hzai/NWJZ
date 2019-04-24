/*
 * @Author: Roy Chen
 * @Date: 2019-04-19 20:34:39
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-24 21:49:29
 */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/auth-redirect',
        component: () => import('@/views/login/auth-redirect'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error-page/401'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index'),
                name: 'Dashboard',
                meta: {
                    title: 'dashboard',
                    icon: 'dashboard',
                    noCache: true,
                    affix: true
                }
            }
        ]
    },
    {
        path: '/resume',
        component: () => import('@/views/resume/index'),
        hidden: true
    }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    {
        path: '/worker',
        component: Layout,
        redirect: '/worker/index',
        name: 'worker',
        alwaysShow: true,
        meta: {
            title: 'worker',
            icon: 'peoples'
        },
        children: [
            {
                path: 'create',
                component: () => import('@/views/worker/manage/create'),
                name: 'CreateWorker',
                meta: { title: 'createWorker', icon: 'edit' }
            },
            {
                path: 'edit',
                component: () => import('@/views/worker/manage/edit'),
                name: 'worker-info',
                meta: {
                    title: 'workerInfo',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'detail',
                component: () => import('@/views/worker/manage/detail'),
                name: 'worker-detail',
                meta: {
                    title: 'editWorker',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'list',
                component: () => import('@/views/worker/manage'),
                name: 'worker-manage',
                meta: { title: 'workerManage', icon: 'people' }
            }
        ]
    },
    {
        path: '/customer',
        component: Layout,
        redirect: '/customer/index',
        name: 'customer',
        alwaysShow: true,
        meta: {
            title: 'customer',
            icon: 'peoples'
        },
        children: [
            {
                path: 'create',
                component: () => import('@/views/customer/create'),
                name: 'customer-create',
                meta: { title: 'createCustomer', icon: 'edit' }
            },
            {
                path: 'edit',
                component: () => import('@/views/customer/edit'),
                name: 'EditCustomer',
                meta: {
                    title: 'editCustomer',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'client',
                component: () => import('@/views/customer/client'),
                name: 'customer-client',
                meta: { title: 'customerClient', icon: 'people' }
            }
        ]
    },
    {
        path: '/order',
        component: Layout,
        redirect: '/order/index',
        name: 'order',
        alwaysShow: true,
        meta: {
            title: 'order',
            icon: 'money'
        },
        children: [
            {
                path: 'create',
                component: () => import('@/views/order/create'),
                name: 'order-create',
                meta: { title: 'createOrder', icon: 'edit' }
            }
        ]
    },
    {
        path: '/statistic',
        component: Layout,
        redirect: '/statistic/index',
        name: 'statistic',
        alwaysShow: true,
        meta: {
            title: 'statistic',
            icon: 'money'
        },
        children: [
            {
                path: 'shop',
                component: () => import('@/views/statistic/shop'),
                name: 'statistic-shop',
                meta: { title: 'statisticShop', icon: 'edit' }
            },
            {
                path: 'sale',
                component: () => import('@/views/statistic/sale'),
                name: 'statistic-sale',
                meta: { title: 'statisticSale', icon: 'edit' }
            }
        ]
    },
    {
        path: '/system',
        component: Layout,
        redirect: '/system/index',
        name: 'system',
        meta: {
            title: 'system',
            icon: 'component'
        },
        children: [
            {
                path: 'privilege',
                component: () => import('@/views/system/privilege'),
                name: 'system-privilege',
                meta: { title: 'privilege', icon: 'password' }
            },
            {
                path: 'user',
                component: () => import('@/views/system/user'),
                name: 'system-user',
                meta: { title: 'user', icon: 'user' }
            }
        ]
    },
    { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes
    });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
