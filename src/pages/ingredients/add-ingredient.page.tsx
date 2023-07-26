import React, {useEffect} from 'react'
import '../../App.css'
import './ingredients.style.css'
import NewIngredientForm from "../../components/create-new-ingredient/create-new-ingredient-form.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function AddIngredient() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

    return (
        <div className="data-container">
            <NewIngredientForm/>
        </div>
    )
}
