import React from 'react'
import '../../App.css'
import './recipes.style.css'
import EditRecipeForm from "../../components/update-recipe/update-recipe-form.component";
import {useParams} from "react-router-dom";

export default function EditRecipePage() {

    const { id } = useParams();
    console.log(`ID = ${id}`);
    return (
        <div className="data-container">
            <EditRecipeForm id = {id? id : "1"}/>
        </div>
    )
}
