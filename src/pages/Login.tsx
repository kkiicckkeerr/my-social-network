import React, { useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { email, username, password } : { email, password };
      const { data } = await API.post(endpoint, payload);
      login(data.token, data.user);
      navigate(`/${data.user.username}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка выполнения');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow">
        <h2 className="text-center text-2xl font-bold">{isRegister ? 'Регистрация' : 'Вход в сеть'}</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded border p-2" required />
        {isRegister && <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full rounded border p-2" required />}
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded border p-2" required />
        <button type="submit" className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600">{isRegister ? 'Создать аккаунт' : 'Войти'}</button>
        <p className="text-center text-sm text-gray-600 cursor-pointer" onClick={() => setIsRegister(!isRegister)}>{isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}</p>
      </form>
    </div>
  );
};
