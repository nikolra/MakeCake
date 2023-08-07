import React from 'react';

import './ingredient-delegate.style.css'

interface IIngredientProps{
    name: string,
    quantity: number,
    minCost:number,
    avgCost:number,
    maxCost:number,
    measurement_unit?:string
    removeDelegate: Function
}

function IngredientDelegate(props: IIngredientProps) {
    const {name, quantity, minCost,avgCost,maxCost,measurement_unit = "",removeDelegate} = props;


    return (
        //TODO: Tomer - mishmash in quantity- talk with Nikol
        <div className={
            `ingredient-delegate-main-container ingredient-delegate-text`
        }>
            <div className="ingredient-delegate-container">
                <div className="recipe-delegate-table-container">
                    <span>{name}</span>
                </div>
                <div className="recipe-delegate-table-container">
                    <span>{quantity} {measurement_unit}</span>
                </div>
                <div className="recipe-delegate-table-container">
                    <span>{minCost*quantity}₪</span>
                </div>
                <div className="recipe-delegate-table-container">
                    <span>{avgCost*quantity}₪</span>
                </div>
                <div className="recipe-delegate-table-container">
                    <span>{maxCost*quantity}₪</span>
                </div>
                <div className="recipe-delegate-table-container align-right">
                    <button className="expand-button" onClick={() => {
                        removeDelegate(name);
                    }}>
                        <span>Remove</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IngredientDelegate;