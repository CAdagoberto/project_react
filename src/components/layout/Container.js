import styles from './Container.module.css'

export default function Container(props) {
    return <div className={`${styles.container} ${styles.min_heigth}`}>{props.children}</div>
    
}