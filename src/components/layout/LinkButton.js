import { Link } from 'react-router-dom'
import style from './LinkButton.module.css'

export default function LinkButton({to, text}) {
    return (
        <Link className={style.btn} to={to}>
            {text}
        </Link>
    )
}