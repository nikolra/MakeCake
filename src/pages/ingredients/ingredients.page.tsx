import React, {useEffect} from 'react'
import AllIngredients from "../../components/ingredients/ingrediants.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function Ingredients() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

  return (
      <div className="data-container">
        <AllIngredients className="all-ingredients-container" header="Ingredients" description="All ingredients"/>
      </div>
  )
}
