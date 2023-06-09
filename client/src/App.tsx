import { Navigate, Route, Routes } from 'react-router';
import './app.sass'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/user/HomePage';

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<h1>LOGIN</h1>}/>
      <Route path='/register' element={<h1>REGISTER</h1>}/>

      <Route path='/' element={<MainLayout/>}>
        <Route index element={<HomePage/>}/>
        <Route path='machines' element={<h1>MACHINES</h1>}/>
        <Route path='domains' element={<h1>DOMAINS</h1>}/>

        <Route path='admin'>
          <Route index element={<h1>ADMIN</h1>}/>
          <Route path='users' element={<h1>ADMIN USERS</h1>}/>
          <Route path='domains' element={<h1>ADMIN DOMAINS</h1>}/>
          <Route path='machines' element={<h1>ADMIN MACHINES</h1>}/>
          <Route path='addresses' element={<h1>ADDRESSES</h1>}/>
        </Route>
        
      </Route>

      <Route path='*' element={<Navigate to='/'/>}/>
    </Routes>
  )
}

export default App
