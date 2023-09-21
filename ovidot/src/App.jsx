import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import About from './pages/about/About'
import Calendar from './pages/calendar/Calendar'
import Contact from './pages/contact/Contact'
//import Settings from './pages/settings/Settings'
import Register from './pages/register/Register'
import NotFound from './pages/notFound/NotFound' 
import Navbar from './components/Navbar'
import Dashboard from './pages/dashboard/Dashboard'
import Footer from './components/Footer'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route index element={<Home/>} />
        <Route path='about' element={<About/>} />
        <Route path='contact' element={<Contact/>} />
        <Route path='calendar' element={<Calendar/>} />
        <Route path='register' element={<Register/>} />
        <Route path='dashboard' element={<Dashboard/>} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App