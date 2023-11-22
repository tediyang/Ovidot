import React from 'react'
import { useState } from 'react'
import {Link, NavLink} from 'react-router-dom'
import './navbar.css'
import {link} from '../data'
import Logo from '../images/ovidott.png'
import {FaBars} from 'react-icons/fa'
import {MdOutlineClose} from 'react-icons/md'

const Nvbar = () => {
  const [isNavShowing, setIsNavShowing] = useState(false); //controlling the navbar
    
    return (
      <nav>
        <div className="container nav__container">
          <Link to="/" className='logo' onClick={() => setIsNavShowing(false)}>
            <img src={Logo} alt="Nav Logo" />
          </Link>
          <ul className={`nav__links ${isNavShowing ? 'show__nav' : 'hide__nav'}`}>
            {
              link.map(({name, path}, index) => {
                return (
                  <li key={index}>
                    <NavLink to={path} className={({isActive}) => isActive ? 'active-nav' : ''} 
                    onClick={() => setIsNavShowing(prev => !prev)}>{name}</NavLink>
                  </li>//navbar appear/disappear when click bars.
                )
              })
            }
          </ul>
          {/*<Link to="/register" className="ov">Try Ovidot</Link>*/}
          <button className="nav__toggle-btn" onClick={() => setIsNavShowing(prev => !prev)}>
            {
              isNavShowing ? <MdOutlineClose /> : <FaBars />
            }
          </button>
        </div>
      </nav>
    )
  }

export default Nvbar