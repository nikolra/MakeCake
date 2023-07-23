import React, {useState} from 'react';
import './recipe-delegate.style.css'

interface IRecipeProps{
    name: string,
    quantity: string,
    minCost: string,
    avgCost: string,
    maxCost: string,
    price: string,
    removeDelegate: Function
}

function RecipeDelegate(props: IRecipeProps) {
    const {name, quantity, minCost,avgCost, maxCost, price/*, removeDelegate*/} = props;
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
                    <span>{minCost}₪</span>
                </div>
                <div className="recipe-delegate-table-container">
                    <span>{avgCost}₪</span>
                </div>
                <div className="recipe-delegate-table-container">
                    <span>{maxCost}₪</span>
                </div>
                <div className="recipe-delegate-table-container">
                    <span>{price}₪</span>
                </div>
                <div className="recipe-delegate-table-container align-right">
                    <button className="expand-button" onClick={() => {
                        props.removeDelegate(name);
                    }}>
                        <span>Remove</span>
                    </button>
                </div>
            </div>


        </div>
    );
}

export default RecipeDelegate;