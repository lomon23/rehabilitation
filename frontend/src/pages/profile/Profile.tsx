import React, { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../api/auth/auth';
import './Profile.scss';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  const { id } = useParams(); // витягне ID, якщо він є в URL
  
  useEffect(() => {
    // Якщо id є - передаємо його в authService, якщо ні - робимо запит без нього (свій профіль)
    const fetchProfile = async () => {
      const data = await authService.getProfile(id); 
      setProfile(data);
    };
    fetchProfile();
  }, [id]); // Рефетчимо, якщо id в URL змінився

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!profile) return <div className="profile-container">Завантаження...</div>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">Профіль</h1>

      <div className="profile-photo-zone">
        <div className="profile-photo-placeholder" /> {/* Твоя "сіра" фотографія */}
      </div>

      <div className="profile-fields">
        <Input label="Ім'я" value={profile.name || ''} readOnly />
        <Input label="Прізвище" value={profile.last_name || ''} readOnly />
        <Input label="Телефон" value={profile.phone_number || ''} readOnly />
        <Input label="Дата народження" value={profile.birthday || ''} readOnly />
      </div>

      <div className="profile-actions">
        <Button variant="secondary" onClick={handleLogout}>Вийти з акаунту</Button>
      </div>
    </div>
  );
};