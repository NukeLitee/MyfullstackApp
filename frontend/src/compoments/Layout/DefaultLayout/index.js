import Header from './Header';
import Sidebar from './Sidebar';

function DefaultLayout({children}){
    return(
        <div>
            <Header />
            <div className = "container">
                <Sidebar />
            </div>
        </div>
    )
}
export default DefaultLayout;