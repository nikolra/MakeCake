import React, {useState} from 'react';

import './ingredient-delegate.style.css'

interface IIngredientProps{
    name: string,
    quantity: string,
    cost: string,
    removeDelegate: Function
}

function IngredientDelegate(props: IIngredientProps) {
    const {name, quantity, cost} = props;

    return (
        <div className={
            `ingredient-delegate-main-container ingredient-delegate-text`
        }>
            <div className="ingredient-delegate-container">
                <div className="ingredient-delegate-table-container">
                    <span>{name}</span>
                </div>
                <div className="ingredient-delegate-table-container">
                    <span>{quantity}</span>
                </div>
                <div className="ingredient-delegate-table-container">
                    <span>{cost}₪</span>
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