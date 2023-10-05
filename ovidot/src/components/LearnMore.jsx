//import {GiQueenCrown} from 'react-icons/gi'
//import {program} from '../data'
//import SectionHead from './SectionHead'
//import Card from '../UI/Card'
//import {Link} from 'react-router-dom'
//import {AiFillCaretRight} from 'react-icons/ai'
import sanity from '../images/sanitary.png'
import stable from '../images/stability.png'
import timing from '../images/timing.jpeg'


const LearnMore = () => 
  <section className="courses">
  <h3>Know your body</h3>
  <div className="container courses__container">
    <article className="course">
      <div className="course__image1">
        <img src={sanity} alt='Learn'  />
      </div>
      <div className="course__info">
        <h4>Hygiene products</h4>
        <p>Tampons, Pads or Menstrual Cups? What's right for you? </p>
        <a href="https://www.healthywomen.org/content/article/tampons-pads-or-menstrual-cups-whats-right-you" className="button">
          {""}
          Learn More
        </a>
      </div>
    </article>
    <article className="course">
      <div className="course__image">
        <img src={stable} alt=''/>
      </div>
      <div className="course__info">
        <h4>Remedies for Menstrual Cramps</h4>
        <p>What causes Period Cramps? How to stop period cramps.</p>
        <a href="https://www.stylecraze.com/articles/home-remedies-to-relieve-period-cramps/" className="button">
          {" "}
          Learn More
        </a>
      </div>
    </article>
    <article className="course">
      <div className="course__image">
        <img src={timing} alt='Learn'/>
      </div>
      <div className="course__info">
        <h4>Getting Pregnant</h4>
        <p>
          How can i get pregnant? When am I more fertile?
        </p>
        <a href="https://www.medicalnewstoday.com/articles/322951" className="button button-primary">
          {" "}
          Learn More
        </a>
      </div>
    </article>
  </div>
</section>
{/*return (
    <section className="program">
        <div className="container program__container">
            <SectionHead icon={<GiQueenCrown/>} title="Learn More"/>
        <div className="program__wrapper">
            {
                program.map(({id, icon, title, info, path}) => {
                  return (
                  <Card className="program__LearnMore" key={id}>
                    <span>{icon}</span>
                    <h4>{title}</h4>
                    <small>{info}</small>
                    <Link to ={path} className="btn sm">Learn More<AiFillCaretRight/></Link>
                  </Card>)
                })
            }
        </div>
        </div>
    </section>
  )
          */}

export default LearnMore