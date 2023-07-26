import React, {useEffect} from 'react'
import '../../App.css'
import './recipes.style.css'
import NewRecipeForm from "../../components/create-new-recipe/create-new-recipe-form.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function AddRecipePage() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

    return (
        <div className="data-container">
            <NewRecipeForm/>
        </div>
    )
}
