import React from 'react'
import AllRecipes from "../../components/recipes/recipes.component";

export default function Recipes() {
  return (
      <div className="data-container">
        <AllRecipes className="all-recipes-container" header="Recipes" description="All Recipes"/>
      </div>
  )
}
