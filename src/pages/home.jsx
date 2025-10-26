import { Navigate } from 'react-router';

import { useAuthContext } from '@/contexts/auth';

const HomePage = () => {
  const { isInitializing, user } = useAuthContext();

  if (isInitializing) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <h1>HomePage</h1>;
};

export default HomePage;
