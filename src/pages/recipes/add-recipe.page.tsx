import React from 'react'
import '../../App.css'
import './recipes.style.css'
import NewRecipeForm from "../../components/create-new-recipe/create-new-recipe-form.component";

export default function AddRecipePage() {

    return (
        <div className="data-container">
            <NewRecipeForm/>
        </div>
    )
}
