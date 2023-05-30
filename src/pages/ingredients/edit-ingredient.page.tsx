import React from 'react'
import '../../App.css'
import './ingredients.style.css'
import {useParams} from "react-router-dom";
import UpdateIngredientForm from "../../components/update-manual-ingredient/update-ingredient-form.component";

export default function EditIngredientPage() {

    const { id } = useParams();
    console.log(`id = ${id}`);
    return (
        <div className="data-container">
            <UpdateIngredientForm id = {id? id : "1"}/>
        </div>
    )
}
