import React, {useState} from 'react';

import './order-delegate.style.css'
import {NavLink} from "react-router-dom";

interface IOrderProps {
    data: any,
    deleteDelegate: Function
}

function OrderDelegate(props: IOrderProps) {
    const [isOpened, setOpened] = useState(false)
    const {id, dueDate, customer, order_price, recipes} = props.data;
    //console.log(props.data);
    const deleteDelegate = props.deleteDelegate;

    return (
        <div className={
            `order-delegate-main-container order-delegate-text ${isOpened ? "order-delegate-opened" : ""}`
        }>
            <div className="order-delegate-container">
                <div className="order-delegate-table-container">
                    <span>{id}</span>
                </div>
                <div className="order-delegate-table-container">
                    <span>{customer}</span>
                </div>
                <div className="order-delegate-table-container">
                    <span>{order_price}₪</span>
                </div>
                <div className="order-delegate-table-container">
                    <span>{dueDate}</span>
                </div>
                <div className="order-delegate-table-container align-right">
                    <button className="expand-button">
                        <NavLink to={`/orders/edit/${id}`} className={`link active`}>Edit</NavLink>
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
                            setOpened(!isOpened)
                        }
                    }>
                        {!isOpened ? "Show" : "Hide"}
                    </button>
                </div>
            </div>

            {isOpened &&
                <div className="order-delegate-recipe-container op-50">

                    <div className="order-delegate-recipe-title">
                        <div className="order-delegate-recipe-title-item">
                            <span>Recipe</span>
                        </div>
                        <div className="order-delegate-recipe-title-item">
                            <span>Quantity</span>
                        </div>
                        <div className="order-delegate-recipe-title-item">
                            <span>Cost</span>
                        </div>
                    </div>
                    {
                        recipes.map((recipe: any) => {
                            return (
                                <div className="order-delegate-recipe-title-value">
                                    <div className="order-delegate-recipe-title-item">
                                        <span>{recipe.recipe_name}</span>
                                    </div>
                                    <div className="order-delegate-recipe-title-item">
                                        <span>{recipe.recipe_quantity}</span>
                                    </div>
                                    <div className="order-delegate-recipe-title-item">
                                        <span>{recipe.recipe_price*recipe.recipe_quantity}₪</span>
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

export default OrderDelegate;