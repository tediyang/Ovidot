import {GiQueenCrown} from 'react-icons/gi'
import {program} from '../data'
import SectionHead from './SectionHead'
import Card from '../UI/Card'
import {Link} from 'react-router-dom'
import {AiFillCaretRight} from 'react-icons/ai'



const LearnMore = () => {
  return (
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
}

export default LearnMore