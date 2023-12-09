import { Link } from "react-router-dom"
import Logo from '../images/ovidott.png'
import { AiOutlineTwitter} from 'react-icons/ai'
import { AiFillInstagram} from 'react-icons/ai'
import { FaFacebookF} from 'react-icons/fa'
import { FaLinkedin} from 'react-icons/fa'

const Footer = () => {
  return (
    <footer>
        <div className="container footer__container">
            <article>
                <Link to='/' className='Logo'>
                    <img src={Logo} alt="Footer Logo" />
                </Link>
                <p>
                Care, Insights, and Support to Help You Thrive in Every Season of Life.
                </p>
                <div className="footer__socials">
                    <a href='https://twitter.com/' target="_blank" rel="noreferrer noopener"><AiOutlineTwitter/></a>
                    <a href='https://instagram.com/' target="_blank" rel="noreferrer noopener"><AiFillInstagram/></a>
                    <a href='https://facebook.com/' target="_blank" rel="noreferrer noopener"><FaFacebookF/></a>
                    <a href='https://linkedin.com/' target="_blank" rel="noreferrer noopener"><FaLinkedin/></a>
                </div>
            </article>
            <article>
                <h4>PermaLinks</h4>
                <Link to='/about'> About </Link>
                <Link to='/contact'> Contact </Link>
                <Link to='/register'> Register </Link>
            </article>
            <article>
                <h4>Get In Touch</h4>
                <Link to='/contact'> Contact Us </Link>
            </article>
        </div>
    </footer>
  )
}

export default Footer