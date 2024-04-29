import Loadable from 'react-loadable';
import Loading from '@/components/Loading'
const Dashboard = Loadable({loader: () => import(/*webpackChunkName:'Dashboard'*/'@/views/dashboard'),loading: Loading});
const UserManagement = Loadable({loader: () => import(/*webpackChunkName:'UserManagement'*/'@/views/management/userManagement'),loading: Loading});
const PositionManagement = Loadable({loader: () => import(/*webpackChunkName:'PositionManagement'*/'@/views/management/positionManagement'),loading: Loading});
const DepartmentManagement = Loadable({loader: () => import(/*webpackChunkName:'DepartmentManagement'*/'@/views/management/departmentManagement'),loading: Loading});
const DeviceManagement = Loadable({loader: () => import(/*webpackChunkName:'DeviceManagement'*/'@/views/management/deviceManagement'),loading: Loading});
const ClientInfo = Loadable({loader: () => import(/*webpackChunkName:'ClientInfo'*/'@/views/business/clientInfo'),loading: Loading});
const Contract = Loadable({loader: () => import(/*webpackChunkName:'Contract'*/'@/views/business/contract'),loading: Loading});
const Projects = Loadable({loader: () => import(/*webpackChunkName:'Projects'*/'@/views/business/projects'),loading: Loading});
const VehicleDispatch = Loadable({loader: () => import(/*webpackChunkName:'VehicleDispatch'*/'@/views/management/vehicleDispatch'),loading: Loading});
const UserDispatch = Loadable({loader: () => import(/*webpackChunkName:'UserDispatch'*/'@/views/management/userDispatch'),loading: Loading});
const Calendar = Loadable({loader: () => import(/*webpackChunkName:'Calendar'*/'@/views/management/calendar'),loading: Loading});
const Explanation = Loadable({loader: () => import(/*webpackChunkName:'Explanation'*/'@/views/permission'),loading: Loading});
const SystemLayer = Loadable({loader: () => import(/*webpackChunkName:'SystemLayer'*/'@/views/standrad/systemLayer'),loading: Loading});
const SystemProb = Loadable({loader: () => import(/*webpackChunkName:'SystemProb'*/'@/views/standrad/systemProb'),loading: Loading});
const SystemModel = Loadable({loader: () => import(/*webpackChunkName:'SystemModel'*/'@/views/standrad/systemModel'),loading: Loading});
const SystemExpert = Loadable({loader: () => import(/*webpackChunkName:'SystemExpert'*/'@/views/standrad/systemExpert'),loading: Loading});
const SystemDeviceLayer = Loadable({loader: () => import(/*webpackChunkName:'SystemDeviceLayer'*/'@/views/standrad/systemDeviceLayer'),loading: Loading});
const SystemDeviceModel = Loadable({loader: () => import(/*webpackChunkName:'SystemDeviceModel'*/'@/views/standrad/systemDeviceModel'),loading: Loading});
const SystemDeviceProb = Loadable({loader: () => import(/*webpackChunkName:'SystemDeviceProb'*/'@/views/standrad/systemDeviceProb'),loading: Loading});
const SystemDeviceExpert = Loadable({loader: () => import(/*webpackChunkName:'SystemDeviceExpert'*/'@/views/standrad/systemDeviceExpert'),loading: Loading});
const MeasurementLayer = Loadable({loader: () => import(/*webpackChunkName:'MeasurementLayer'*/'@/views/standrad/measurementLayer'),loading: Loading});
const MeasurementModel = Loadable({loader: () => import(/*webpackChunkName:'MeasurementModel'*/'@/views/standrad/measurementModel'),loading: Loading});
const PlanManagement = Loadable({loader: () => import(/*webpackChunkName:'PlanManagement'*/'@/views/producePlan/planManagement'),loading: Loading});
const CorrectPractice = Loadable({loader: () => import(/*webpackChunkName:'CorrectPractice'*/'@/views/business/correctPractice'),loading: Loading});
const ModuleList = Loadable({loader: () => import(/*webpackChunkName:'ModuleList'*/'@/views/report/module-list'),loading: Loading});
const DocumentList = Loadable({loader: () => import(/*webpackChunkName:'DocumentList'*/'@/views/document/documentList'),loading: Loading});
const DataProb = Loadable({loader: () => import(/*webpackChunkName:'DataProb'*/'@/views/business/dataProblem'),loading: Loading});
const FuzzyEvalaute = Loadable({loader: () => import(/*webpackChunkName:'FuzzyEvalaute'*/'@/views/project/fuzzy-evalaute'),loading: Loading});
const CalcEvalaute = Loadable({loader: () => import(/*webpackChunkName:'CalcEvalaute'*/'@/views/project/calc-evalaute'),loading: Loading});
const DigitalMap = Loadable({loader: () => import(/*webpackChunkName:'DigitalMap'*/'@/views/map/digital-map'),loading: Loading});
const MapConfig = Loadable({loader: () => import(/*webpackChunkName:'MapConfig'*/'@/views/map/map-config'),loading: Loading});
const AdminPage = Loadable({loader: () => import(/*webpackChunkName:'AdminPage'*/'@/views/permission/adminPage'),loading: Loading});
const GuestPage = Loadable({loader: () => import(/*webpackChunkName:'GuestPage'*/'@/views/permission/guestPage'),loading: Loading});
const EditorPage = Loadable({loader: () => import(/*webpackChunkName:'EditorPage'*/'@/views/permission/editorPage'),loading: Loading});
const RichTextEditor = Loadable({loader: () => import(/*webpackChunkName:'RichTextEditor'*/'@/views/components-demo/richTextEditor'),loading: Loading});
const Markdown = Loadable({loader: () => import(/*webpackChunkName:'Markdown'*/'@/views/components-demo/Markdown'),loading: Loading});
const Draggable = Loadable({loader: () => import(/*webpackChunkName:'Draggable'*/'@/views/components-demo/draggable'),loading: Loading});
const KeyboardChart = Loadable({loader: () => import(/*webpackChunkName:'KeyboardChart'*/'@/views/charts/keyboard'),loading: Loading});
const LineChart = Loadable({loader: () => import(/*webpackChunkName:'LineChart'*/'@/views/charts/line'),loading: Loading});
const MixChart = Loadable({loader: () => import(/*webpackChunkName:'MixChart'*/'@/views/charts/mixChart'),loading: Loading});
const Menu1_1 = Loadable({loader: () => import(/*webpackChunkName:'Menu1_1'*/'@/views/nested/menu1/menu1-1'),loading: Loading});
const Menu1_2_1 = Loadable({loader: () => import(/*webpackChunkName:'Menu1_2_1'*/'@/views/nested/menu1/menu1-2/menu1-2-1'),loading: Loading});
const Table = Loadable({loader: () => import(/*webpackChunkName:'Table'*/'@/views/table'),loading: Loading});
const ExportExcel = Loadable({loader: () => import(/*webpackChunkName:'ExportExcel'*/'@/views/excel/exportExcel'),loading: Loading});
const UploadExcel = Loadable({ loader: () => import(/*webpackChunkName:'UploadExcel'*/'@/views/excel/uploadExcel'),loading: Loading });
const Zip = Loadable({loader: () => import(/*webpackChunkName:'Zip'*/'@/views/zip'),loading: Loading});
const Clipboard = Loadable({loader: () => import(/*webpackChunkName:'Clipboard'*/'@/views/clipboard'),loading: Loading});
const Error404 = Loadable({loader: () => import(/*webpackChunkName:'Error404'*/'@/views/error/404'),loading: Loading});
const Bug = Loadable({loader: () => import(/*webpackChunkName:'Bug'*/'@/views/bug'),loading: Loading});
const Personal = Loadable({loader: () => import(/*webpackChunkName:'Personal'*/'@/views/personal'),loading: Loading});

export default [
  { path: "/dashboard", component: Dashboard },
  { path: "/management/userManagement", component: UserManagement },
  { path: "/management/positionManagement", component: PositionManagement },
  { path: "/management/departmentManagement", component: DepartmentManagement },
  { path: "/business/devices", component: DeviceManagement },
  { path: "/management/vehicleDispatch", component: VehicleDispatch },
  { path: "/management/userDispatch", component: UserDispatch },
  { path: "/management/calendar", component: Calendar },
  { path: "/business/clientInfo", component: ClientInfo },
  { path: "/business/contract", component: Contract},
  { path: "/business/projects", component: Projects},
  { path: "/standrad/layer", component: SystemLayer},
  { path: "/standrad/problems", component: SystemProb},
  { path: "/standrad/models", component: SystemModel},
  { path: "/standrad/expert", component: SystemExpert},
  { path: "/standrad/deviceLayer", component: SystemDeviceLayer},
  { path: "/standrad/deviceModels", component: SystemDeviceModel},
  { path: "/standrad/deviceExperts", component: SystemDeviceExpert},
  { path: "/standrad/measurementLayer", component: MeasurementLayer},
  { path: "/standrad/measurementmodel", component: MeasurementModel},
  { path: "/standrad/deviceProblems", component: SystemDeviceProb},
  { path: "/project/fuzzy", component: FuzzyEvalaute},
  { path: "/project/calc", component: CalcEvalaute},
  { path: "/procucePlan/management", component: PlanManagement},
  { path: "/businessData/correct-practice", component: CorrectPractice},
  { path: "/report/module", component: ModuleList},
  { path: "/document/list", component: DocumentList},
  { path: "/businessData/problem", component: DataProb},
  { path: "/map/digital-map", component: DigitalMap},
  { path: "/map/map-config", component: MapConfig},
  { path: "/permission/explanation", component: Explanation, roles: ["admin"] },
  { path: "/permission/adminPage", component: AdminPage, roles: ["admin"] },
  { path: "/permission/guestPage", component: GuestPage, roles: ["guest"] },
  { path: "/permission/editorPage", component: EditorPage, roles: ["editor"] },
  { path: "/components/richTextEditor", component: RichTextEditor, roles: ["admin","editor"] },
  { path: "/components/Markdown", component: Markdown, roles: ["admin","editor"] },
  { path: "/components/draggable", component: Draggable, roles: ["admin","editor"] },
  { path: "/charts/keyboard", component: KeyboardChart},
  { path: "/charts/line", component: LineChart},
  { path: "/charts/mix-chart", component: MixChart},
  { path: "/nested/menu1/menu1-1", component: Menu1_1, roles: ["admin","editor"] },
  { path: "/nested/menu1/menu1-2/menu1-2-1", component: Menu1_2_1, roles: ["admin","editor"] },
  { path: "/table", component: Table, roles: ["admin","editor"] },
  { path: "/excel/export", component: ExportExcel, roles: ["admin","editor"] },
  { path: "/excel/upload", component: UploadExcel, roles: ["admin","editor"] },
  { path: "/zip", component: Zip, roles: ["admin","editor"] },
  { path: "/clipboard", component: Clipboard, roles: ["admin","editor"] },
  { path: "/bug", component: Bug, roles: ["admin"] },
  { path: "/personal", component: Personal, roles: ["admin"] },
  { path: "/error/404", component: Error404 },
];
