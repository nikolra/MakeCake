import React, {useEffect, useState} from 'react'
import '../../App.css'
import './ingredients.style.css'
import NewIngredientForm from "../../components/create-new-ingredient/create-new-ingredient-form.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function AddIngredient() {
    const [isTokenValidated, setIsTokenValidated] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('makecake-token');
        validateToken(token, navigate);
        setIsTokenValidated(true);
    }, []);

    return (
        <div className="data-container">
            {isTokenValidated &&
                <NewIngredientForm/>
            }
        </div>
    )
}
