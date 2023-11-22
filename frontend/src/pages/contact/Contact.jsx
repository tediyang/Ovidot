import {MdEmail} from 'react-icons/md'
import {BsMessenger} from 'react-icons/bs'
import {IoLogoWhatsapp} from 'react-icons/io'
import HeaderImage from '../../images/Blooming.png'
import Header from '../../components/Header'
import './contact.css'

const Contact = () => {
  return (
    <>
    <Header title="Get In Touch" image={HeaderImage}>
      We are here to assist you! Feel free to Reach out.
    </Header>

    <section className="contact">
      <div className="container contact__container">
        <div className="contact__wrapper">
          <a href='mailto:starsm004@gmail.com' target='_blank' rel='noreferrer noopener'><MdEmail/></a>
          <a href='http://m.me/' target='_blank' rel='noreferrer noopener'><BsMessenger/></a>
          <a href='https://wa.me/+255623966531' target='_blank' rel='noreferrer noopener'><IoLogoWhatsapp/></a>
        </div>
      </div>
    </section>
    </>
  )
}

export default Contact