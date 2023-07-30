import React, {useEffect, useState} from 'react'
import '../../App.css'
import './recipes.style.css'
import NewRecipeForm from "../../components/create-new-recipe/create-new-recipe-form.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function AddRecipePage() {

    const [isTokenValidated, setIsTokenValidated] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('makecake-token');
        const func = async () => {
            await validateToken(token, navigate);
            setIsTokenValidated(true);
        }
        func();
    }, []);

    return (
        <div className="data-container">
            {isTokenValidated &&
                <NewRecipeForm/>
            }
        </div>
    )
}
