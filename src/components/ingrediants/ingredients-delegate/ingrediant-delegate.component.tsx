import React, {useState} from 'react';

import './ingrediant-delegate.style.css'

interface IIngredientProps {
    data: any
}

function IngredientDelegate(props: IIngredientProps) {
    const [isOpened, setOpened] = useState(false)
    const {id, name, minCost, maxCost, avgCost} = props.data;

    return (
        <div className={
            `ingredient-delegate-main-container ingredient-delegate-text ${isOpened ? "ingredient-delegate-opened" : ""}`
        }>
            <div className="ingredient-delegate-container">
                <div className="ingredient-delegate-table-container">
                    <span>{id}</span>
                </div>
                <div className="ingredient-delegate-table-container">
                    <span>{name}</span>
                </div>
                <div className="ingredient-delegate-table-container">
                    <span>{avgCost}₪</span>
                </div>
                <div className="ingredient-delegate-table-container align-right">
                    <button className="expand-button" onClick={
                        () => {
                            setOpened(!isOpened)
                        }
                    }>
                        {!isOpened ? "Show" : "Hide"}
                    </button>
                </div>
            </div>

            {isOpened &&
            <div className="ingredient-delegate-recipe-container op-50">

                <div className="ingredient-delegate-recipe-title">
                    <div className="ingredient-delegate-recipe-title-item">
                        <span>Min Price</span>
                    </div>
                    <div className="ingredient-delegate-recipe-title-item">
                        <span>Max Price</span>
                    </div>
                </div>
                {
                    <div className="ingredient-delegate-recipe-title-value">
                        <div className="ingredient-delegate-recipe-title-item">
                            <span>{minCost.supermarketName} - {minCost.price}₪</span>
                        </div>
                        <div className="ingredient-delegate-recipe-title-item">
                            <span>{maxCost.supermarketName} - {maxCost.price}₪</span>
                        </div>
                    </div>
                }
            </div>
            }

        </div>
    );
}

export default IngredientDelegate;