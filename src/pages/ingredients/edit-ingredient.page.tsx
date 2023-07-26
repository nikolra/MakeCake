import React, {useEffect} from 'react'
import '../../App.css'
import './ingredients.style.css'
import {useNavigate, useParams} from "react-router-dom";
import UpdateIngredientForm from "../../components/update-manual-ingredient/update-ingredient-form.component";
import Cookies from "js-cookie";

export default function EditIngredientPage() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

    const { id } = useParams();
    console.log(`id = ${id}`);
    return (
        <div className="data-container">
            <UpdateIngredientForm id = {id? id : "1"}/>
        </div>
    )
}
