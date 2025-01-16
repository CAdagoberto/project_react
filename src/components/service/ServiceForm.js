import style from '../projects/FormProject.module.css'
import { useState } from 'react'
import SubmitButton from '../form/SubmitButton'
import Input from '../form/Input'

export default function ServiceForm({handleSubmit, btnText, projectData}) {
    function submit() {

    }

    function handleChange(e) {

    }

    return (
        <form onSubmit={submit} className={style.form}>
            <Input
                type='text'
                text='Nome do serviço'
                name='name'
                placeholder='Insira o nome do serviço'
                handleOnChange={handleChange}
            />

            <Input
                type='number'
                text='Custo do serviço'
                name='cost'
                placeholder='Insira o valor total'
                handleOnChange={handleChange}
            />

            <Input
                type='text'
                text='Descrição do serviço'
                name='description'
                placeholder='Descreva o serviço'
                handleOnChange={handleChange}
            />

            <SubmitButton text={btnText} />
        </form>
    )
}