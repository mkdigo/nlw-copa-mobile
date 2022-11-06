import { useContext } from 'react';
import { AuthContext, AuthContextDateProps } from '../contexts/AuthContext';

export function useAuth(): AuthContextDateProps {
  return useContext(AuthContext);
}
