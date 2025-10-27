import type { User, StudyProgress, PlacementTestResult, DailyProgress } from '../types';
import * as local from './localStorageService';

// =================================================================
// == HÃY THÊM URL API BACKEND CỦA BẠN VÀO ĐÂY ==
// == Ví dụ: 'https://my-api-server.com' 
// == Bỏ trống chuỗi này ('') để sử dụng Local Storage của trình duyệt làm phương án dự phòng.
// =================================================================
const BACKEND_API_URL = '';

// --- Các hàm API ---

export const register = async (name: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    if (!BACKEND_API_URL) {
        return local.registerUserLocal(name, password);
    }

    try {
        const response = await fetch(`${BACKEND_API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            return { success: false, message: data.message || 'Đăng ký thất bại.' };
        }
        // Assuming backend now logs in and returns user+token on register
        sessionStorage.setItem('authToken', data.token); 
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Registration API error:', error);
        return { success: false, message: 'Không thể kết nối đến server.' };
    }
};

export const login = async (name: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    if (!BACKEND_API_URL) {
        const result = local.loginUserLocal(name, password);
        if (result.success && result.user) {
            sessionStorage.setItem('loggedInUser', result.user.name);
        }
        return result;
    }
    try {
        const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            return { success: false, message: data.message || 'Đăng nhập thất bại.' };
        }
        // Backend returns user object and a token
        sessionStorage.setItem('authToken', data.token); 
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Login API error:', error);
        return { success: false, message: 'Không thể kết nối đến server.' };
    }
};

export const updateUser = async (user: User): Promise<void> => {
     if (!BACKEND_API_URL) {
        return local.updateUserLocal(user);
    }
    try {
        const token = sessionStorage.getItem('authToken');
        await fetch(`${BACKEND_API_URL}/user/`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(user),
        });
    } catch (error) {
        console.error('Update user API error:', error);
    }
}

export const updateProgress = async (name: string, progress: StudyProgress): Promise<void> => {
    if (!BACKEND_API_URL) {
        return local.updateUserProgressLocal(name, progress);
    }
    try {
        const token = sessionStorage.getItem('authToken');
        await fetch(`${BACKEND_API_URL}/user/progress`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ studyProgress: progress }),
        });
    } catch (error) {
        console.error('Update progress API error:', error);
    }
};

export const updateDailyProgress = async (name: string, progress: DailyProgress): Promise<void> => {
    if (!BACKEND_API_URL) {
        return local.updateUserDailyProgressLocal(name, progress);
    }
    try {
        const token = sessionStorage.getItem('authToken');
        await fetch(`${BACKEND_API_URL}/user/daily-progress`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ dailyProgress: progress }),
        });
    } catch (error) {
        console.error('Update daily progress API error:', error);
    }
};

export const completePlacementTest = async (name: string, result: PlacementTestResult): Promise<{ success: boolean; user?: User; message?: string }> => {
     if (!BACKEND_API_URL) {
        const user = local.completePlacementTestLocal(name, result);
        if (user) {
            return { success: true, user };
        }
        return { success: false, message: "Không tìm thấy người dùng." };
    }
    try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${BACKEND_API_URL}/user/complete-test`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ result }), // No longer need to send name, user is identified by token
        });
        const data = await response.json();
         if (!response.ok) {
            return { success: false, message: data.message || 'Cập nhật thất bại.' };
        }
        return { success: true, user: data.user }; // Backend returns the updated user
    } catch (error) {
        console.error('Complete placement test API error:', error);
        return { success: false, message: 'Không thể kết nối đến server.' };
    }
};

export const checkSession = async (): Promise<{ user: User | null }> => {
    const token = sessionStorage.getItem('authToken');
    if (!BACKEND_API_URL || !token) {
        const sessionUser = sessionStorage.getItem('loggedInUser');
        if (sessionUser) {
            const user = local.findUserByNameLocal(sessionUser);
            return { user: user || null };
        }
        return { user: null };
    }
    try {
        const response = await fetch(`${BACKEND_API_URL}/user/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            sessionStorage.removeItem('authToken');
            return { user: null };
        }
        const user = await response.json();
        return { user };
    } catch (error) {
        console.error('Check session API error:', error);
        return { user: null };
    }
};

export const getAllUsers = async (): Promise<User[]> => {
    if (!BACKEND_API_URL) {
        return local.getAllUsersLocal();
    }
     try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`${BACKEND_API_URL}/users`, {
             headers: { 
                'Authorization': `Bearer ${token}` 
            },
        });
        if (!response.ok) {
            return [];
        }
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Get all users API error:', error);
        return [];
    }
};

export const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('loggedInUser');
};