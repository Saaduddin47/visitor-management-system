import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnimatedSignIn } from '../components/ui/sign-in';

const LoginPage = () => {
  const { login, ssoEmployee } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSsoLoading, setIsSsoLoading] = useState(false);

  const routeByRole = (role) => {
    if (role === 'employee') navigate('/employee');
    if (role === 'manager') navigate('/manager');
    if (role === 'front-desk') navigate('/frontdesk');
    if (role === 'it-admin') navigate('/admin');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const user = await login(form);
      routeByRole(user.role);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onSso = async () => {
    setMessage('');
    setIsSsoLoading(true);
    try {
      const user = await ssoEmployee({ email: form.email });
      routeByRole(user.role);
    } catch (error) {
      setMessage(error.response?.data?.message || 'SSO failed');
    } finally {
      setIsSsoLoading(false);
    }
  };

  return (
    <AnimatedSignIn
      email={form.email}
      password={form.password}
      onEmailChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
      onPasswordChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
      onSubmit={onSubmit}
      onSso={onSso}
      message={message}
      isLoading={isLoading}
      isSsoLoading={isSsoLoading}
    />
  );
};

export default LoginPage;
