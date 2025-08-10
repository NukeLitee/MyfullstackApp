import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // Import api client của bạn

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await api.get('/users/me');
                    setUser(response.data);
                } catch (error) {
                    console.error("Token không hợp lệ, đăng xuất:", error);
                    localStorage.removeItem('authToken');
                }
            }
            setIsLoading(false);
        };
        fetchUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
    };

    // Hàm để cập nhật lại thông tin user từ context
    const updateUser = (newUserData) => {
        setUser(newUserData);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để dễ dàng sử dụng context
export const useAuth = () => {
    return useContext(AuthContext);
};