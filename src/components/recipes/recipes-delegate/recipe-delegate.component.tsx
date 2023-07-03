import React, {useState} from 'react';

import './recipe-delegate.style.css'
import {NavLink} from "react-router-dom";

interface IRecipeProps {
    data: any,
    deleteDelegate: Function
}

function RecipeDelegate(props: IRecipeProps) {
    const [isOpened, setOpened] = useState(false)
    const {id, name, totalCost:avgCost, ingredients} = props.data;
    const deleteDelegate = props.deleteDelegate;

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
                    <button className="expand-button">
                        <NavLink to={`/recipes/edit/${id}`} className={`link active`}>Edit</NavLink>
                    </button>
                    <button className="expand-button" onClick={
                        async () => {
                            await deleteDelegate(id);
                        }
                    }>
                        Delete
                    </button>
                    <button className="expand-button" onClick={
                        () => {
                            setOpened(!isOpened);
                        }
                    }>
                        {!isOpened ? "Show" : "Hide"}
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
                        <span>Quantity</span>
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
                                    <span>{ingredient.ingredient_quantity}</span>
                                </div>
                                <div className="all-recipes-delegate-recipe-title-item">
                                    <span>{ingredient.minCost}₪</span>
                                </div>
                                <div className="all-recipes-delegate-recipe-title-item">
                                    <span>{ingredient.avgCost}₪</span>
                                </div>
                                <div className="all-recipes-delegate-recipe-title-item">
                                    <span>{ingredient.maxCost}₪</span>
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