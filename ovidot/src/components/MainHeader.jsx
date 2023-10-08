import { Link } from "react-router-dom"
import Cycle from '../images/woman.jpeg'

const MainHeader = () => {
  return (
    <header className="main__header">
      <div className="container main__header-container">
        <div className="main__header-left">
          <h1>Every flow has a story</h1>
          <p>
            Embrace the Beauty of Your Monthly Cycle: Your Personal Menstrual Health Partner, Guiding You Through Each Phase of Womanhood.
          </p>

          <Link to="/login" className="btn lg"> Get Started</Link>
        </div>
        <div className="main__header-right">
          <div className="main__header-circle"></div>
          <div className="main__header-image">
          <img src={Cycle} alt="Main Header Image" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default MainHeader