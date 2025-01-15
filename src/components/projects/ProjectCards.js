import style from './ProjectCards.module.css'
import { Link } from 'react-router-dom'
import {BsPencil, BsFillTrashFill} from 'react-icons/bs'

export default function ProjectCards({id, budget, name, category, handleRemove}) {
    let remove = (e) => {
      e.preventDefault()
      handleRemove(id)
    }
    return (
        <div className={style.project_card}>
          <h4>{name}</h4>
          <p>
            <span>Orçamento:</span> R${budget}
          </p>
          <p className={style.category_text}>
            <span className={`${style[category.toLowerCase()]}`}></span> {category}
          </p>
          <div className={style.project_card_actions}>
            <Link to={'/project/' + id}>
              <BsPencil /> Editar
            </Link>
            <button onClick={remove}>
              <BsFillTrashFill /> Excluir
            </button>
          </div>
      </div>
    )
}