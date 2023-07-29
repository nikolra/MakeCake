import React from 'react'
import '../../App.css'
import './ingredients.style.css'
import { useParams} from "react-router-dom";
import UpdateIngredientForm from "../../components/update-manual-ingredient/update-ingredient-form.component";


export default function EditIngredientPage() {

    const {id} = useParams();

    return (

        <div className="data-container">
            <UpdateIngredientForm id={id ? id : "1"}/>
        </div>

    )
}
