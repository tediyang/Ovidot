import './about.css'
//import HeaderImage from '../../images/wallpaper.png'
import Header from '../../components/Header'
import StoryImage from '../../images/flowers.png'
import VisionImage from '../../images/calendar.jpeg'
import goalImage from '../../images/happy.jpeg'

const About = () => {
  return (
    <>
    <Header title="About us">
    Your Health, Your Way!
    </Header>
    
    <section className="section about__story">
      <div className="container about__story-container">
        <div className="about__section-image">
          <img src={StoryImage} alt="Our Story Image" />
        </div>
        <div className="about__section-content">
          <h1>What is Ovidot</h1>
          <p>
            Ovidot helps you navigate through all phases of your menstrual cycle, providing insights and predictions of your cycle.
          <p>
            Helps you understand your body through all four phases of your Cycle.
          </p>
          </p>
        </div>
      </div>
    </section>

    <section className="section about__reason">
      <div className="container about__reason-container">
        <div className="about__section-content">
          <h1>Our Vision</h1>
          <p>
            Ovidot is committed to educating and supporting women in their health journey.
            We provide answers to your most curious questions about menstrual health, debunk myths, and offer guidance backed by knowldege of medical professionals.
          </p>
        </div>
        <div className="about__section-image">
          <img src={VisionImage} alt="Our reason Image" />
        </div>
      </div>
    </section>

    <section className="section about__goal">
      <div className="container about__goal-container">
        <div className="about__section-image">
          <img src={goalImage} alt="Our goal Image" />
        </div>
        <div className="about__section-content">
          <h1>Our Goal</h1>
          <p>
            Our goal is to foster a community where every woman feels understood, supported, and confident in managing her menstrual health. 
          With Ovidot, you are not just tracking your cycle; you are gaining a partner in your health journey.
          </p>
        </div>
      </div>
    </section>
    </>
  )
}

export default About