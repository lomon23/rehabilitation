export interface User {
  id: number;
  email: string;
  role: 'patient' | 'doctor';
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
  first_name?: string; // <--- додати це
  name?: string;
}

const API_URL = 'http://127.0.0.1:8000/api/auth';

// Цей внутрішній метод замінює звичайний fetch
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem('access_token');
  
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  let response = await fetch(url, options);

  // Якщо 401 — пробуємо оновити токен
  if (response.status === 401) {
    const refresh = localStorage.getItem('refresh_token');
    const refreshResponse = await fetch(`${API_URL}/refresh/`, { // Переконайся, що роут саме такий
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });

    if (refreshResponse.ok) {
      const { access } = await refreshResponse.json();
      localStorage.setItem('access_token', access);
      
      // Повторюємо запит з новим токеном
      options.headers = { ...options.headers, 'Authorization': `Bearer ${access}` };
      response = await fetch(url, options);
    } else {
      // Якщо рефреш не допоміг — вихід
      authService.logout();
      window.location.href = '/login';
    }
  }

  return response;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Помилка авторизації');

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
    if (!response.ok) throw new Error(data.error || JSON.stringify(data));
    return data;
  },

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async updateProfile(data: any) {
    const response = await fetchWithAuth(`${API_URL}/profile/`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Помилка оновлення профілю');
    return response.json();
  },

  async getProfile(userId?: string | number) {
    const url = userId 
        ? `${API_URL}/profile/${userId}/` 
        : `${API_URL}/profile/`;

    const response = await fetchWithAuth(url, { method: 'GET' });
    if (!response.ok) throw new Error('Помилка завантаження профілю');
    return response.json();
  },
  async getDoctorDashboard() {
    const response = await fetchWithAuth(`${API_URL}/doctor/dashboard/`, { method: 'GET' });
    if (!response.ok) throw new Error('Помилка завантаження дашборду');
    return response.json();
  },

  async generateInvite() {
    const response = await fetchWithAuth(`${API_URL}/invite/`, { method: 'POST' }); // Тепер POST
    if (!response.ok) throw new Error('Помилка генерації коду');
    return response.json();
  },

  
  async connectToDoctor(code: string) {
    const response = await fetchWithAuth(`${API_URL}/connect/`, {
      method: 'POST',
      body: JSON.stringify({ code })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Помилка підключення');
    }
    
    return response.json();
  },
  async getPatientStatus() {
    const response = await fetchWithAuth(`${API_URL}/patient/status/`, { method: 'GET' });
    if (!response.ok) throw new Error('Помилка перевірки статусу');
    return response.json();
  },
  getPatientExercises: async (patientId: string) => {
    const response = await fetchWithAuth(`${API_URL}/patients/${patientId}/exercises/`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Помилка завантаження вправ');
    return response.json();
  },

  // Призначити вправу
  assignExercise: async (patientId: string, exerciseData: any) => {
    const response = await fetchWithAuth(`${API_URL}/patients/${patientId}/exercises/`, {
      method: 'POST',
      body: JSON.stringify(exerciseData),
    });
    if (!response.ok) throw new Error('Помилка призначення вправи');
    return response.json();
  },

  // Додати нову вправу
  addExerciseToPatient: async (patientId: string, exerciseData: { name: string, frequency: string }) => {
    const response = await fetchWithAuth(`${API_URL}/patients/${patientId}/exercises/`, {
      method: 'POST',
      body: JSON.stringify(exerciseData),
    });
    if (!response.ok) throw new Error('Помилка додавання вправи');
    return response.json();
  }
  
};
