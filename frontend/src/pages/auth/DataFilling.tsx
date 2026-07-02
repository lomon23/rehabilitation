import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../api/auth/auth'; // Твій сервіс
import './DataFilling.scss';

export const DataFillingPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    phone_number: '',
    birthday: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Викликаємо метод оновлення профілю (POST /api/auth/profile/)
      await authService.updateProfile(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Помилка збереження профілю:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="data-container">
      <h1 className="data-title">Ваші дані</h1>
      
      <form className="data-form" onSubmit={handleSubmit}>
        <div className="data-fields">
          <Input 
            label="Ім'я" 
            placeholder="Введіть ім'я" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Прізвище" 
            placeholder="Введіть прізвище" 
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
          />
          <Input 
            label="Дата народження" 
            type="date"
            value={formData.birthday}
            onChange={(e) => setFormData({...formData, birthday: e.target.value})}
          />
          <Input 
            label="Телефон" 
            type="tel"
            placeholder="+380 (XX) XXX-XX-XX" 
            value={formData.phone_number}
            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
          />
        </div>

        <div className="data-submit-zone">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Збереження...' : 'Зберегти'}
          </Button>
        </div>
      </form>
    </div>
  );
};