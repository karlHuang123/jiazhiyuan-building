/**
 * icon:菜单项图标
 * roles:标明当前菜单项在何种角色下可以显示，如果不写此选项，表示该菜单项完全公开，在任何角色下都显示
 */
const menuList = [
  {
    title: "首页",
    path: "/dashboard",
    icon: "home",
    roles:["admin","editor","guest"]
  },
  {
    title: "人事管理",
    path: "/management",
    icon: "usergroup-add",
    roles:["admin","editor","guest"],
    children: [
      {
        title: "用户管理",
        path: "/management/userManagement",
        roles:["admin"]
      },
      // {
      //   title: "岗位管理",
      //   path: "/management/positionManagement",
      //   roles:["admin"]
      // },
      {
        title: "部门管理",
        path: "/management/departmentManagement",
        roles:["admin"]
      },
      {
        title: "调度管理",
        path: "/management/dispatchManagement",
        roles:["admin"],
        children: [
          {
            title: "车辆调度",
            path: "/management/vehicleDispatch",
            roles:["admin"]
          },
          {
            title: "人员调度",
            path: "/management/userDispatch",
            roles:["admin"]
          },
          // {
          //   title: "工作日历",
          //   path: "/management/calendar",
          //   roles:["admin"]
          // }
        ]
      }
    ]
  },
  {
    title: "业务信息",
    path: "/business",
    icon: "lock",
    children: [
      {
        title: "客户清单",
        path: "/business/clientInfo",
        roles:["admin"]
      },
      {
        title: "合同管理",
        path: "/business/contract",
        roles:["admin"]
      },
      {
        title: "项目列表",
        path: "/business/projects",
        roles:["admin"]
      },
      {
        title: "设备管理",
        path: "/business/devices",
        roles:["admin"]
      }
    ],
  },
  {
    title: "业务标准",
    path: "/standrad",
    icon: "radar-chart",
    children: [
      {
        title: "综合体系-标准-层级管理",
        path: "/standrad/layer",
        roles:["admin"]
      },
      {
        title: "综合体系-标准-问题管理",
        path: "/standrad/problems",
        roles:["admin"]
      },
      {
        title: "综合体系-模型管理",
        path: "/standrad/models",
        roles:["admin"]
      },
      {
        title: "综合体系-专家管理",
        path: "/standrad/expert",
        roles:["admin"]
      },
      {
        title: "设备体系-标准-层级管理",
        path: "/standrad/deviceLayer",
        roles:["admin"]
      },
      {
        title: "设备体系-标准-问题管理",
        path: "/standrad/deviceProblems",
        roles:["admin"]
      },
      {
        title: "设备体系-模型管理",
        path: "/standrad/deviceModels",
        roles:["admin"]
      },
      {
        title: "设备体系-专家管理",
        path: "/standrad/deviceExperts",
        roles:["admin"]
      },
      // {
      //   title: "实测实量体系-标准-层级管理",
      //   path: "/standrad/measurementLayer",
      //   roles:["admin"]
      // },
      // {
      //   title: "实测实量体系-标准-规则管理",
      //   path: "/standrad/measurementRules",
      //   roles:["admin"]
      // },
      {
        title: "实测实量-模型管理",
        path: "/standrad/measurementModel",
        roles:["admin"]
      },
    ],
  },
  {
    title: "生产计划",
    path: "/procucePlan",
    icon: "database",
    children: [
      {
        title: "计划管理",
        path: "/procucePlan/management",
        roles:["admin"]
      },
      // {
      //   title: "委托任务",
      //   path: "/procucePlan/task",
      //   roles:["admin"]
      // },
    ],
  },
  {
    title: "业务数据",
    path: "/businessData",
    icon: "cloud-server",
    children: [
      {
        title: "正确做法",
        path: "/businessData/correct-practice",
        roles:["admin"]
      },
      {
        title: "综合问题",
        path: "/businessData/problem",
        roles:["admin"]
      },
      // {
      //   title: "测量记录",
      //   path: "/businessData/measure-record",
      //   roles:["admin"]
      // },
    ],
  },
  {
    title: "报告管理",
    path: "/report",
    icon: "cloud-server",
    children: [
      {
        title: "模版清单",
        path: "/report/module",
        roles:["admin"]
      },
    ],
  },
  {
    title: "档案管理",
    path: "/document",
    icon: "cloud-server",
    children: [
      {
        title: "档案管理",
        path: "/document/list",
        roles:["admin"]
      },
    ],
  },
  {
    title: "项目评价",
    path: "/project",
    icon: "project",
    children: [
      {
        title: "模糊评价",
        path: "/project/fuzzy",
        roles:["admin"]
      },
      {
        title: "打分评价",
        path: "/project/calc",
        roles:["admin"]
      },
    ],
  },
  {
    title: "数字地图",
    path: "/map",
    icon: "dribbble-square",
    children: [
      {
        title: "数字地图",
        path: "/map/digital-map",
        roles:["admin"]
      },
      {
        title: "地图配置",
        path: "/map/map-config",
        roles:["admin"]
      },
    ],
  },
  // {
  //   title: "组件",
  //   path: "/components",
  //   icon: "appstore",
  //   roles:["admin","editor"],
  //   children: [
  //     {
  //       title: "富文本",
  //       path: "/components/richTextEditor",
  //       roles:["admin","editor"],
  //     },
  //     {
  //       title: "Markdown",
  //       path: "/components/Markdown",
  //       roles:["admin","editor"],
  //     },
  //     {
  //       title: "拖拽列表",
  //       path: "/components/draggable",
  //       roles:["admin","editor"],
  //     },
  //   ],
  // },
  // {
  //   title: "图表",
  //   path: "/charts",
  //   icon: "area-chart",
  //   roles:["admin","editor"],
  //   children: [
  //     {
  //       title: "键盘图表",
  //       path: "/charts/keyboard",
  //       roles:["admin","editor"],
  //     },
  //     {
  //       title: "折线图",
  //       path: "/charts/line",
  //       roles:["admin","editor"],
  //     },
  //     {
  //       title: "混合图表",
  //       path: "/charts/mix-chart",
  //       roles:["admin","editor"],
  //     },
  //   ],
  // },
  // {
  //   title: "路由嵌套",
  //   path: "/nested",
  //   icon: "cluster",
  //   roles:["admin","editor"],
  //   children: [
  //     {
  //       title: "菜单1",
  //       path: "/nested/menu1",
  //       children: [
  //         {
  //           title: "菜单1-1",
  //           path: "/nested/menu1/menu1-1",
  //           roles:["admin","editor"],
  //         },
  //         {
  //           title: "菜单1-2",
  //           path: "/nested/menu1/menu1-2",
  //           children: [
  //             {
  //               title: "菜单1-2-1",
  //               path: "/nested/menu1/menu1-2/menu1-2-1",
  //               roles:["admin","editor"],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: "表格",
  //   path: "/table",
  //   icon: "table",
  //   roles:["admin","editor"]
  // },
  // {
  //   title: "Excel",
  //   path: "/excel",
  //   icon: "file-excel",
  //   roles:["admin","editor"],
  //   children: [
  //     {
  //       title: "导出Excel",
  //       path: "/excel/export",
  //       roles:["admin","editor"]
  //     },
  //     {
  //       title: "上传Excel",
  //       path: "/excel/upload",
  //       roles:["admin","editor"]
  //     }
  //   ],
  // },
  // {
  //   title: "Zip",
  //   path: "/zip",
  //   icon: "file-zip",
  //   roles:["admin","editor"]
  // },
  // {
  //   title: "剪贴板",
  //   path: "/clipboard",
  //   icon: "copy",
  //   roles:["admin","editor"]
  // },
  // {
  //   title: "Bug收集",
  //   path: "/bug",
  //   icon: "bug",
  //   roles:["admin"]
  // },
];
export default menuList;
