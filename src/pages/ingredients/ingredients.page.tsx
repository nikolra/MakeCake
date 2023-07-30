import React, {useEffect, useState} from 'react'
import AllIngredients from "../../components/ingredients/ingrediants.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function Ingredients() {

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
            { isTokenValidated &&
                <AllIngredients className="all-ingredients-container" header="Ingredients"
                                description="All ingredients"/>
            }
        </div>
    )
}
