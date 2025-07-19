import MainPage from '../Pages/Home';
import FollowingPage from '../Pages/FollowingPage'
import Profile from '../Pages/Profile';
import TrangChu from '../Pages/TrangChu';
import {DefaultLayout} from "../compoments/Layout";
const publicRoutes =[
    {path: '/', component: TrangChu, layout: null},
    {path: '/Main', component: MainPage, layout: DefaultLayout},
    {path: '/following', component: FollowingPage, layout: DefaultLayout},
    {path: '/Profile', component: Profile, layout: DefaultLayout},

]

const privateRoutes =[

]
export { publicRoutes, privateRoutes }
