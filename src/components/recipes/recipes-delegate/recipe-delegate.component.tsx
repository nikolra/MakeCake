import React, {useState} from 'react';

import './recipe-delegate.style.css'
import {NavLink} from "react-router-dom";

interface IRecipeProps {
    data: any,
    deleteDelegate: Function
}

interface Ingredient {
    minCost:number;
    avgCost:number;
    maxCost:number;
    price: number;
    quantity: number;
    is_automated: number;
    ingredient_code: string;
    name: string;
}

function RecipeDelegate(props: IRecipeProps) {
    const [isOpened, setOpened] = useState(false)
    const {recipe_id, recipe_name, ingredients,recipe_price,ingredients_min_cost,ingredients_avg_cost,ingredients_max_cost,} = props.data;
    const deleteDelegate = props.deleteDelegate;

    return (
        <div className={
            `all-recipes-delegate-main-container all-recipes-delegate-text ${isOpened ? "all-recipes-delegate-opened" : ""}`
        }>
            <div className="all-recipes-delegate-container">
                <div className="all-recipes-delegate-table-container">
                    <span>{recipe_id}</span>
                </div>
                <div className="all-recipes-delegate-table-container">
                    <span>{recipe_name}</span>
                </div>
                <div className="all-recipes-delegate-table-container">
                    <span>{ingredients_min_cost}₪</span>
                </div>
                <div className="all-recipes-delegate-table-container">
                    <span>{ingredients_avg_cost}₪</span>
                </div>
                <div className="all-recipes-delegate-table-container">
                    <span>{ingredients_max_cost}₪</span>
                </div>
                <div className="all-recipes-delegate-table-container">
                    <span>{recipe_price}₪</span>
                    {/*TODO: Tomer - change to price*/}
                </div>
                <div className="all-recipes-delegate-table-container align-right">
                    <button className="expand-button">
                        <NavLink to={`/recipes/edit/${recipe_id}`} className={`link active`}>Edit</NavLink>
                    </button>
                    <button className="expand-button" onClick={
                        async () => {
                            await deleteDelegate(recipe_id);
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
                    ingredients.map((ingredient: Ingredient) => {
                        let barcode = "" ;
                        if(ingredient.is_automated)
                            barcode=ingredient.ingredient_code.toString();
                        return(
                            <div className="all-recipes-delegate-recipe-title-value">
                                <div className="all-recipes-delegate-recipe-title-item">
                                    <span>{barcode}</span>
                                </div>
                                <div className="all-recipes-delegate-recipe-title-item">
                                    <span>{ingredient.name}</span>
                                </div>
                                <div className="all-recipes-delegate-recipe-title-item">
                                    <span>{ingredient.quantity}</span>
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