import React, {useEffect} from 'react'
import AllRecipes from "../../components/recipes/recipes.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function Recipes() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

  return (
      <div className="data-container">
        <AllRecipes className="all-recipes-container" header="Recipes" description="All Recipes"/>
      </div>
  )
}
