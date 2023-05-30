import React, {useState} from 'react';

import './ingrediant-delegate.style.css'
import {NavLink} from "react-router-dom";

interface IIngredientProps {
    data: any
}

function IngredientDelegate(props: IIngredientProps) {
    const [isOpened, setOpened] = useState(false)
    const {id, name, minCost, maxCost, avgCost, isManual} = props.data;

    return (
        <div className={
            `all-ingredient-delegate-main-container all-ingredient-delegate-text ${isOpened ? "all-ingredient-delegate-opened" : ""}`
        }>
            <div className="all-ingredient-delegate-container">
                <div className="all-ingredient-delegate-table-container">
                    <span>{id}</span>
                </div>
                <div className="all-ingredient-delegate-table-container">
                    <span>{name}</span>
                </div>
                <div className="all-ingredient-delegate-table-container">
                    <span>{avgCost}₪</span>
                </div>
                <div className="all-ingredient-delegate-table-container align-right">
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
                <div className="all-ingredient-delegate-recipe-container op-50">

                    <div className="all-ingredient-delegate-recipe-title">
                        <div className="all-ingredient-delegate-recipe-title-item">
                            <span>Min Price</span>
                        </div>
                        <div className="all-ingredient-delegate-recipe-title-item">
                            <span>Max Price</span>
                        </div>
                    </div>
                    {
                        <div className="all-ingredient-delegate-recipe-title-value">
                            <div className="all-ingredient-delegate-recipe-title-item">
                                <span>{minCost.supermarketName} - {minCost.price}₪</span>
                            </div>
                            <div className="all-ingredient-delegate-recipe-title-item">
                                <span>{maxCost.supermarketName} - {maxCost.price}₪</span>
                            </div>
                            {isManual &&
                                <div className="all-ingredient-delegate-recipe-title-item align-right">
                                    <button className="expand-button">
                                        <NavLink to={`/ingredients/edit/${id}`} className={`link active`}>Edit</NavLink>
                                    </button>
                                </div>
                            }
                        </div>
                    }

                </div>
            }

        </div>
    );
}

export default IngredientDelegate;