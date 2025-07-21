import MainPage from '../Pages/Home';
import UpComing from '../Pages/UpComing'
import Profile from '../Pages/Profile';
import TrangChu from '../Pages/TrangChu';
import {DefaultLayout} from "../compoments/Layout";
const publicRoutes =[
    {path: '/', component: TrangChu, layout: null},
    {path: '/Main', component: MainPage, layout: DefaultLayout},
    {path: '/UpComing', component: UpComing, layout: DefaultLayout},
    {path: '/Profile', component: Profile, layout: DefaultLayout},

]

const privateRoutes =[

]
export { publicRoutes, privateRoutes }
