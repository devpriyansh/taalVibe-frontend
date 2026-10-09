import React, { createContext, useContext, useState } from 'react';
import { API_BASE_URL } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: btoa(password) }),
      });
      const resData = await response.json();
      if (response.ok && resData.data && resData.data.status === 200) {
        const loggedInUser = resData.data.result.user;
        const jwtToken = resData.data.result.loginToken;
        setUser(loggedInUser);
        setToken(jwtToken);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('token', jwtToken);
        return { success: true };
      } else {
        const errorMessage = resData.errors && resData.errors.length > 0 ? resData.errors[0].description || resData.errors[0].message : 'Login failed';
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login.' };
    }
  };

  const register = async (email, password, confirmPassword, firstName, lastName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password: btoa(password), 
          confirmPassword: btoa(confirmPassword),
          firstName,
          lastName,
          userName: email.split('@')[0] 
        }),
      });
      const resData = await response.json();
      if (response.ok && resData.data && resData.data.status === 200) {
        return await login(email, password);
      } else {
        const errorMessage = resData.errors && resData.errors.length > 0 ? resData.errors[0].description || resData.errors[0].message : 'Registration failed';
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration.' };
    }
  };

  const googleLogin = async (accessToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });
      const resData = await response.json();
      
      if (response.ok && resData.data && resData.data.status === 200) {
        const loggedInUser = resData.data.result.user;
        const jwtToken = resData.data.result.loginToken;
        setUser(loggedInUser);
        setToken(jwtToken);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('token', jwtToken);
        return { success: true };
      } else {
        const errorMessage = resData.errors && resData.errors.length > 0 ? resData.errors[0].description || resData.errors[0].message : 'Google Login failed';
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Google Login error:', error);
      return { success: false, message: 'An error occurred during Google sign-in.' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/user/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });
      const resData = await response.json();
      
      if (response.ok && resData.data && resData.data.status === 200) {
        const updatedUser = resData.data.result.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true };
      } else {
        const errorMessage = resData.errors && resData.errors.length > 0 ? resData.errors[0].description || resData.errors[0].message : 'Update failed';
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'An error occurred during profile update.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, googleLogin, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);