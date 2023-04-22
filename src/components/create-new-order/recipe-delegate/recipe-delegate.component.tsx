import React, {useState} from 'react';

import './recipe-delegate.style.css'

interface IRecipeProps{
    name: string,
    quantity: string,
    ingredientsCost: string,
    totalCost: string
}

function RecipeDelegate(props: IRecipeProps) {
    const {name, quantity, ingredientsCost, totalCost} = props;

    return (
        <div className={
            `recipe-delegate-main-container recipe-delegate-text`
        }>
            <div className="recipe-delegate-container">
                <div className="recipe-delegate-table-container">
                    <span>{name}</span>
                </div>
                <div className="recipe-delegate-table-container">
                    <span>{quantity}</span>
                </div>
                <div className="recipe-delegate-table-container">
                    <span>{ingredientsCost}₪</span>
                </div>
                <div className="recipe-delegate-table-container">
                    <span>{totalCost}₪</span>
                </div>
            </div>


        </div>
    );
}

export default RecipeDelegate;