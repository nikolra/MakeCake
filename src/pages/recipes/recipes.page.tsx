import React, {useEffect, useState} from 'react'
import AllRecipes from "../../components/recipes/recipes.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function Recipes() {

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
                <AllRecipes className="all-recipes-container" header="Recipes" description="All Recipes"/>
            }
        </div>
    )
}
