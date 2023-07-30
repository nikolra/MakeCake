import React, {useEffect, useState} from 'react'
import '../../App.css'
import './ingredients.style.css'
import {useNavigate, useParams} from "react-router-dom";
import UpdateIngredientForm from "../../components/update-manual-ingredient/update-ingredient-form.component";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";


export default function EditIngredientPage() {

    const {id} = useParams();
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
                <UpdateIngredientForm id={id ? id : "1"}/>
            }
        </div>

    )
}
