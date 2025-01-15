
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import style from './FormProject.module.css'
import { useEffect, useState } from 'react'

export default function FormProject({handleSubmit ,btnText, projectData}) {
    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || {})

    useEffect(() => {
        fetch("http://localhost:5000/categories", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => resp.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((err) => console.log(err));
    }, []);

    const submit = (e) =>  {
        e.preventDefault()
        //console.log(project)
        handleSubmit(project)
    }

    function handleChange(e) {
        setProject({...project, [e.target.name]: e.target.value })
    }

    function handleCategory(e) {
        setProject({
            ...project, 
            category: {
                id: e.target.value, // ID da categoria selecionada
                name: e.target.options[e.target.selectedIndex].text, // Nome da categoria
            },
        });
    }


    
    
    
    return (
        <form onSubmit={submit} className={style.form}>
            <Input 
                handleOnChange={handleChange}
                type='text'
                text='Nome do projeto'
                name='name'
                placeholder='Insira o nome do projeto'
                value={project.name ? project.name : ''}
            />
            
            <Input 
                handleOnChange={handleChange}
                type='number'
                text='Orçamento do Projeto'
                name='budget'
                placeholder='Insira o Orçamento'
                value={project.budget ? project.budget : ''}
            />
            
            <Select 
                handleOnChange={handleCategory}
                name={'category_id'}
                text={'Selecione uma categoria'}
                options={categories}
                value={project.category ? project.category.id : ''}
            />

            <SubmitButton text={btnText}/>
        </form>
    )
}