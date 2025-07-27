import MainPage from '../Pages/Home';
import UpcomingPage from '../Pages/UpComing'
import Profile from '../Pages/Profile';
import TrangChu from '../Pages/TrangChu';
import {DefaultLayout} from "../compoments/Layout";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import Completed from "../Pages/Completed";
const publicRoutes =[
    {path: '/', component: TrangChu, layout: null},
    {path: '/LoginPage', component: LoginPage, layout: null},
    {path: '/RegisterPage', component: RegisterPage, layout: null},
    {path: '/Main', component: MainPage, layout: DefaultLayout},
    {path: '/UpComingPage', component: UpcomingPage, layout: DefaultLayout},
    {path: '/Profile', component: Profile, layout: DefaultLayout},
    {path: '/Completed', component: Completed, layout: DefaultLayout},
]

const privateRoutes =[

]
export { publicRoutes, privateRoutes }
