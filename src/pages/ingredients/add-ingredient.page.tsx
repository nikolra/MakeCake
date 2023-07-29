import React from 'react'
import '../../App.css'
import './ingredients.style.css'
import NewIngredientForm from "../../components/create-new-ingredient/create-new-ingredient-form.component";

export default function AddIngredient() {

    return (
        <div className="data-container">
            <NewIngredientForm/>
        </div>
    )
}
