// <!-- auto generated navs start -->
const autoGenHeaderNavs = [];
const autoGenAsideNavs = [];

// <!-- auto generated navs end -->

const customHeaderNavs = [
  {
    text: '首页',
    to: '/',
    icon: 'home',
  },
  {
    text: '反馈',
    to: 'https://github.com/alibaba/ice',
    external: true,
    newWindow: true,
    icon: 'message',
  },
  {
    text: '帮助',
    to: 'https://alibaba.github.io/ice',
    external: true,
    newWindow: true,
    icon: 'bangzhu',
  },
];

const customAsideNavs = [
  {
    text: '电子航道',
    to: '/dashboard',
    icon: 'home',
  },
  {
    text: '河床演变',
    to: '/evolution',
    icon: 'clock',
  },
  {
    text: '工程管理',
    to: '/project',
    icon: 'repair',
    children: [
      { text: '工程列表', to: '/project/list' },
      { text: '添加工程', to: '/project/create' },
    ],
  },
  {
    text: '标记管理',
    to: '/entity',
    icon: 'location',
    children: [
      { text: '标记列表', to: '/entity/list' },
      { text: '文档列表', to: '/entity/document' },
      { text: '添加标记', to: '/entity/create' },
    ],
  },
  {
    text: '用户管理',
    to: '/user',
    icon: 'yonghu',
    children: [
      { text: '用户列表', to: '/user/list' },
      { text: '添加用户', to: '/user/create' },
    ],
  },
  {
    text: '通用设置',
    to: '/setting',
    icon: 'shezhi',
    children: [
      { text: '基础设置', to: '/setting/basic' },
      {
        text: '菜单设置',
        to: '/setting/navigation',
      },
    ],
  },
];

function transform(navs) {
  // custom logical
  return [...navs];
}

export const headerNavs = transform([
  ...autoGenHeaderNavs,
  ...customHeaderNavs,
]);

export const asideNavs = transform([...autoGenAsideNavs, ...customAsideNavs]);
