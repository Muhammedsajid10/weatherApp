import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserReg from './Controller/UserReg';
import { useEffect, useState } from 'react';
import Login from './Controller/Login';
import UserDashboard from './Controller/UserDashboard';
import WeatherScreen from './Controller/WeatherScreen ';
import GetLocation from './Controller/GetLocation';

function App() {

  const [userInfo, setUserInfo] = useState(()=> {
    return JSON.parse(localStorage.getItem("futUserInfo"))
  })

  useEffect(()=> {
    console.log("Setting userInfo in localStorage:", userInfo);
    localStorage.setItem('futUserInfo', JSON.stringify(userInfo));
}, [userInfo])


  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserReg/>} />
        <Route path='/login' element={<Login setUserInfo={setUserInfo} userInfo={userInfo}/>} />
        <Route path='/weather' element={<WeatherScreen/>}/>
        <Route path='/getLoc' element={<GetLocation/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
