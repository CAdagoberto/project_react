import {Link} from 'react-router-dom'
import Container from './Container'
import style from './Navbar.module.css'
import logo from '../../img/costs_logo.png'

export default function Navbar() {
    return (
        <nav className={style.navbar}>
          <Container>
            <Link to='/'>
              <img src={logo} />
            </Link>
            <ul className={style.list}>
              <li className={style.item}>
                <Link to="/">Home</Link>
              </li>
              <li className={style.item}>
                <Link to="/contact">Contato</Link>
              </li>
              <li className={style.item}>
                <Link to="/newproject">Novo Projeto</Link>
              </li>
              <li className={style.item}>
                <Link to="/projects">Projetos</Link>
              </li>
            </ul>
          </Container>
      </nav>
    )
}