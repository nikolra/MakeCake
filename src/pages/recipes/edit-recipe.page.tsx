import React, {useEffect} from 'react'
import '../../App.css'
import './recipes.style.css'
import EditRecipeForm from "../../components/update-recipe/update-recipe-form.component";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from "js-cookie";

export default function EditRecipePage() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

    const { id } = useParams();
    console.log(`ID = ${id}`);
    return (
        <div className="data-container">
            <EditRecipeForm id = {id? id : "1"}/>
        </div>
    )
}
