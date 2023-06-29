import React, {useState} from 'react';

import './recipe-delegate.style.css'
import {NavLink} from "react-router-dom";

interface IRecipeProps {
    data: any
}

function RecipeDelegate(props: IRecipeProps) {
    const [isOpened, setOpened] = useState(false)
    const {id, name, totalCost:avgCost, ingredients} = props.data;

    return (
        <div className={
            `all-recipes-delegate-main-container all-recipes-delegate-text ${isOpened ? "all-recipes-delegate-opened" : ""}`
        }>
            <div className="all-recipes-delegate-container">
                <div className="all-recipes-delegate-table-container">
                    <span>{id}</span>
                </div>
                <div className="all-recipes-delegate-table-container">
                    <span>{name}</span>
                </div>
                <div className="all-recipes-delegate-table-container">
                    <span>{avgCost}₪</span>
                </div>
                <div className="all-recipes-delegate-table-container align-right">
                    <button className="expand-button" onClick={
                        () => {
                            setOpened(!isOpened);
                        }
                    }>
                        {!isOpened ? "Show" : "Hide"}
                    </button>
                    <button className="expand-button">
                        <NavLink to={`/recipe/edit/${id}`} className={`link active`}>Edit</NavLink>
                    </button>
                </div>
            </div>

            {isOpened &&
            <div className="all-recipes-delegate-recipe-container op-50">

                <div className="all-recipes-delegate-recipe-title">
                    <div className="all-recipes-delegate-recipe-title-item">
                        <span>Ingredient ID</span>
                    </div>
                    <div className="all-recipes-delegate-recipe-title-item">
                        <span>Ingredient Name</span>
                    </div>
                    <div className="all-recipes-delegate-recipe-title-item">
                        <span>Lowest Price</span>
                    </div>
                    <div className="all-recipes-delegate-recipe-title-item">
                        <span>Average Price</span>
                    </div>
                    <div className="all-recipes-delegate-recipe-title-item">
                        <span>Highest Price</span>
                    </div>
                </div>
                {
                    ingredients.map((ingredient: any) => {
                        return(
                            <div className="all-recipes-delegate-recipe-title-value">
                                <div className="all-recipes-delegate-recipe-title-item">
                                    <span>{ingredient.id}</span>
                                </div>
                                <div className="all-recipes-delegate-recipe-title-item">
                                    <span>{ingredient.name}</span>
                                </div>
                                <div className="all-recipes-delegate-recipe-title-item">
                                    <span>{ingredient.minCost.price}₪</span>
                                </div>
                                <div className="all-recipes-delegate-recipe-title-item">
                                    <span>{ingredient.avgCost}₪</span>
                                </div>
                                <div className="all-recipes-delegate-recipe-title-item">
                                    <span>{ingredient.maxCost.price}₪</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            }

        </div>
    );
}

export default RecipeDelegate;