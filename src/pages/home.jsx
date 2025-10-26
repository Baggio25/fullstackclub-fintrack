import { Navigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/auth';

const HomePage = () => {
  const { isInitializing, user, logout } = useAuthContext();

  if (isInitializing) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <h1>Olá {user.first_name}</h1>
      <Button onClick={logout}>Sair</Button>
    </>
  );
};

export default HomePage;
