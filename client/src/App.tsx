import { Navigate, Route, Routes } from 'react-router';
import './app.sass'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/user/HomePage';
import { LanguageContextProvider } from './context/LanguageContext';
import LoggedOutLayout from './layouts/LoggedOutLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { IdentityContextProvider } from './context/IdentityContext';
import AdminLayout from './layouts/AdminLayout';

const App = () => {
  return (
    <LanguageContextProvider>
      <IdentityContextProvider>        
        <Routes>
          <Route element={<LoggedOutLayout/>}>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/register' element={<RegisterPage/>}/>
          </Route>

          <Route path='/' element={<MainLayout/>}>
            <Route index element={<HomePage/>}/>
            <Route path='machines' element={<h1>MACHINES</h1>}/>
            <Route path='domains' element={<h1>DOMAINS</h1>}/>

            <Route path='admin' element={<AdminLayout/>}>
              <Route index element={<h1>ADMIN</h1>}/>
              <Route path='users' element={<h1>ADMIN USERS</h1>}/>
              <Route path='domains' element={<h1>ADMIN DOMAINS</h1>}/>
              <Route path='machines' element={<h1>ADMIN MACHINES</h1>}/>
              <Route path='addresses' element={<h1>ADDRESSES</h1>}/>
            </Route>
            
          </Route>

          <Route path='*' element={<Navigate to='/'/>}/>
        </Routes>
      </IdentityContextProvider>
    </LanguageContextProvider>
  )
}

export default App
