import MainPage from './../src/Pages/Home';
import FollowingPage from './../src/Pages/FollowingPage'
import Profile from './../src/Pages/Profile';
import TrangChu from './../src/Pages/TrangChu';
const publicRoutes =[
    {path: '/', component: TrangChu, layout: null},
    {path: '/Main', component: MainPage},
    {path: '/following', component: FollowingPage},
    {path: '/Profile', component: Profile},


]

const privateRoutes =[

]
export { publicRoutes, privateRoutes }
