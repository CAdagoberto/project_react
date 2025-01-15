import FormProject from '../projects/FormProject'
import style from './NewProject.module.css'
import {useNavigate} from 'react-router-dom'

export default function NewProject() {

    const navigate = useNavigate()

    function createPost(project) {
        // Inicializar o custo e serviços
        project.cost = 0;
        project.services = [];

        fetch('http://localhost:5000/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then(() => {
               
                navigate('/projects', { state: { message: 'Projeto Criado!' } });
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className={style.new_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços</p>
            <FormProject handleSubmit={createPost} btnText={'Criar Projeto'}/>
        </div>
    )
}