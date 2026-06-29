// src/api/auth.ts

// Типізація з твого API-контракту
export interface User {
  id: number;
  email: string;
  role: 'patient' | 'doctor';
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

const API_URL = 'http://127.0.0.1:8000/api/auth';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Помилка авторизації');
    }

    // Одразу зберігаємо токени і юзера в localStorage
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },
  async register(email: string, password: string, password_confirm: string, role: 'patient' | 'doctor') {
    const response = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, password_confirm, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || JSON.stringify(data) || 'Помилка реєстрації');
    }

    return data;
  },
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    // Тут в ідеалі ще зробити POST на /logout/, але для базового флоу достатньо почистити сторедж
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};