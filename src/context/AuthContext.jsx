import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('userToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const register = async (userData) => {
        const res = await axios.post('http://localhost:5000/api/users/register', userData);
        localStorage.setItem('userToken', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return res.data;
    };

    const login = async (userData) => {
        const res = await axios.post('http://localhost:5000/api/users/login', userData);
        localStorage.setItem('userToken', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
