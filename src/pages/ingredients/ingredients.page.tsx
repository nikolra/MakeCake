import React from 'react'
import AllIngredients from "../../components/ingredients/ingrediants.component";

export default function Ingredients() {

    return (
        <div className="data-container">
            <AllIngredients className="all-ingredients-container" header="Ingredients"
                            description="All ingredients"/>
        </div>
    )
}
