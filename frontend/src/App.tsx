import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Home from './components/Guest/Home';
import Login from './components/Login';
import IndexRegister from './components/Register/IndexRegister';
import RegisterInfoWorker from './components/Worker/RegisterInfoWorker';
import WorkerDetails from './components/Worker/WorkerDetails';
import ListOfWorkers from './components/Recruiter/ListOfWorkers';
import HomeWorker from './components/Worker/HomeWorker';
import ListOfFavorites from './components/Recruiter/ListOfFavorites';
import HomeRecruiter from './components/Recruiter/HomeRecruiter';
import {useAuthUser, useIsAuthenticated} from 'react-auth-kit';
import ListOfInvitations from './components/Recruiter/ListOfInvitations';
import WorkerListOfInvitations from './components/Worker/ListOfInvitations';
import ProgrammingLanguage from './components/Worker/AddWorkerProgrammingLanguages';


function App() {
const isAuthenticated = useIsAuthenticated()
const user = useAuthUser();
const userRole = user()?.role;

const PrivateRoute = ({ element, roles }: { element: JSX.Element, roles: string[] }) => {
    if (!isAuthenticated || (roles && !roles.includes(userRole))) {
      // Jeśli nie jest zalogowany lub rola nie pasuje, przekieruj na stronę logowania
      return <Navigate to="/login" />;
    }
  
    return element;
  };
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<IndexRegister />} />
        <Route path="workers" element={<ListOfWorkers />} />
        <Route
          path="workerHome"
          element={<PrivateRoute element={<HomeWorker />} roles={['worker']} />}
        >
          <Route
            path="worker"
            element={<PrivateRoute element={<WorkerDetails />} roles={['worker']} />}
          />
          <Route
            path="invitations"
            element={<PrivateRoute element={<WorkerListOfInvitations />} roles={['worker']} />}
          />
            <Route
            path="programingLanguages"
            element={<PrivateRoute element={<ProgrammingLanguage />} roles={['worker']} />}
          />
          <Route
            path="update"
            element={<PrivateRoute element={<RegisterInfoWorker />} roles={['worker']} />}
          />
        </Route>


        <Route
          path="recruiterHome"
          element={<PrivateRoute element={<HomeRecruiter />} roles={['recruiter']} />}
        >
            <Route
                path="invitations"
                element={<PrivateRoute element={<ListOfInvitations />} roles={['recruiter']} />}
            />
          <Route
            path="workers"
            element={<PrivateRoute element={<ListOfWorkers />} roles={['recruiter']} />}
          />
          
          <Route
            path="favorites"
            element={<PrivateRoute element={<ListOfFavorites />} roles={['recruiter']} />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
