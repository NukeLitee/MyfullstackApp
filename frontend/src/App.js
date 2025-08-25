import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from "./routes";
import { DefaultLayout } from "./compoments/Layout";
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext'; // 1. Import provider

function App() {
    return (
        <Router>
            <AuthProvider>
                {/* 2. Bọc các component cần dùng thông báo vào đây */}
                <NotificationProvider>
                    <div className="App">
                        <Routes>
                            {publicRoutes.map((route, index) => {
                                const Page = route.component;
                                let Layout = DefaultLayout;
                                if (route.layout) {
                                    Layout = route.layout;
                                } else if (route.layout === null) {
                                    Layout = Fragment;
                                }
                                return <Route key={index} path={route.path} element={<Layout><Page /></Layout>} />
                            })}
                        </Routes>
                    </div>
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;