import React, {useEffect, useState} from 'react'
import '../../App.css'
import './recipes.style.css'
import EditRecipeForm from "../../components/update-recipe/update-recipe-form.component";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function EditRecipePage() {

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

    const {id} = useParams();
    console.log(`ID = ${id}`);
    return (
        <div className="data-container">
            {isTokenValidated &&
                <EditRecipeForm id={id ? id : "1"}/>
            }
        </div>
    )
}
