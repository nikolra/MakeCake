import React, {useState} from 'react';

import './ingredient-delegate.style.css'

interface IIngredientProps{
    name: string,
    quantity: number,
    minCost:number,
    avgCost:number,
    maxCost:number,
    measurement_unit:string
    removeDelegate: Function
}

function IngredientDelegate(props: IIngredientProps) {
    const {name, quantity, minCost,avgCost,maxCost,measurement_unit,removeDelegate} = props;


    return (
        <div className={
            `ingredient-delegate-main-container ingredient-delegate-text`
        }>
            <div className="ingredient-delegate-container">
                <div className="ingredient-delegate-table-container">
                    <span>{name}</span>
                </div>
                <div className="ingredient-delegate-table-container">
                    <span>{quantity} {measurement_unit}</span>
                </div>
                <div className="ingredient-delegate-table-container">
                    <span>{minCost}₪</span>
                </div>
                <div className="ingredient-delegate-table-container">
                    <span>{avgCost}₪</span>
                </div>
                <div className="ingredient-delegate-table-container">
                    <span>{maxCost} ₪</span>
                </div>
                <div className="ingredient-delegate-table-container align-right">
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

export default IngredientDelegate;