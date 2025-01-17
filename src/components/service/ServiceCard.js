import style from '../projects/ProjectCards.module.css'
import {BsFillTrashFill} from 'react-icons/bs'

export default function ServiceCard({id, name, cost, desc, handleRemove}) {
    
    const remove = (e) => {

    }
    
    return (
        <div className={style.project_card}>
            <h4>{name}</h4>
            <p>
                <span>Custo Total: </span> R$ {cost}
            </p>

            <p>
                {desc}
            </p>
            <div className={style.project_card_actions}>
                <button onClick={remove}>
                <BsFillTrashFill />
                    Remove
                </button>
                
            </div>
        </div>
    )
}