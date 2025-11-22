import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthUser} from 'react-auth-kit';

export const useNavigation = () => {
  const authUser = useAuthUser();
  const navigate = useNavigate();

  const navigateToHome = () => {
    const userRole = authUser()?.role;
    if (userRole === 'recruiter') navigate('/recruiterHome');
    else if (userRole === 'worker') navigate('/workerHome');
  };

  useEffect(() => {
    navigateToHome();
  }, [authUser]); // Run the effect whenever authUser changes

  return navigateToHome;
};