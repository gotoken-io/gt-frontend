export const routes = [
  {
    path: '/proposal',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/proposal/list',
        name: '提案列表',
        component: './proposal/List',
      },
      {
        path: '/proposal/list/:zone_id',
        name: '提案列表',
        component: './proposal/List',
      },
      {
        path: '/proposal/detail/:id',
        name: '提案详情',
        component: './proposal/Detail',
      },
      {
        path: '/proposal/update/:id',
        name: '编辑提案',
        component: './proposal/Update',
      },
      {
        path: '/proposal/create',
        name: '创建提案',
        component: './proposal/Create',
      },
      {
        path: '/proposal/zone/list',
        name: '提案专区列表',
        component: './proposal_zone/List',
      },
      {
        path: '/proposal/zone/detail/:id',
        name: '提案专区详情',
        component: './proposal_zone/Detail',
      },
      {
        path: '/proposal/zone/create',
        name: '创建提案专区',
        component: './proposal_zone/Create',
      },
      {
        path: '/proposal/zone/update/:id',
        name: '编辑提案专区',
        component: './proposal_zone/Update',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/user',
    component: '../layouts/BasicLayout',
    routes: [
      {
        name: '个人中心',
        path: '/user/:username',
        component: './user/AccountCenter',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/account',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          // {
          //   path: '/account/admin',
          //   name: 'admin',
          //   icon: 'crown',
          //   component: './Admin',
          //   authority: ['admin'],
          // },
          {
            name: '个人设置',
            path: '/account/settings',
            component: './user/AccountSettings',
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/',
        redirect: '/proposal/list',
      },
      {
        name: 'login',
        path: '/login',
        component: './user/Login',
      },
      {
        name: 'register',
        path: '/register',
        component: './user/Register',
      },
      {
        name: 'forget-pwd',
        path: '/forget-password',
        component: './user/ForgetPwd',
      },
      {
        name: 'reset-pwd',
        path: '/reset-password/:token',
        component: './user/ResetPwd',
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
