import React, {useState} from 'react';

import './order-delegate.style.css'

interface IOrderProps{
    data: any
}

function OrderDelegate(props: IOrderProps) {
    const [isOpened, setOpened] = useState(false)
    const {id, dueDate, customer, totalCost, recipes} = props.data;

    return (
        <div className={
            `order-delegate-main-container order-delegate-text ${ isOpened ? "order-delegate-opened" : "" }`
        }>
            <div className="order-delegate-container">
                <div className="order-delegate-table-container">
                    <span>{id}</span>
                </div>
                <div className="order-delegate-table-container">
                    <span>{customer.name}</span>
                </div>
                <div className="order-delegate-table-container">
                    <span>{totalCost}₪</span>
                </div>
                <div className="order-delegate-table-container align-right">
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
                        recipes.map((r: any) => {
                            return(
                                <div className="order-delegate-recipe-title-value">
                                    <div className="order-delegate-recipe-title-item">
                                        <span>{r.name}</span>
                                    </div>
                                    <div className="order-delegate-recipe-title-item">
                                        <span>{r.quantity}</span>
                                    </div>
                                    <div className="order-delegate-recipe-title-item">
                                        <span>{r.total}₪</span>
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