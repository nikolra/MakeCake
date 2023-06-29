import React, { useEffect, useState } from 'react';
import '../dashboard-widgets/widgets.style.css';
import './orders.style.css';
import axios from 'axios';
import OrderDelegate from './order-delegate/order-delegate.component';
import { devOrders, makeOrder, makeCustomer, makeRecipe } from './dev-data';
import SearchField from '../search-field/search-field.component';
import NavigationButtonComponent from '../navigation-button/navigation-button.component';
import {useNavigate} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
// import { Auth } from 'aws-amplify';

interface IOrderProps {
    className: string;
    header: string;
    description: string;
}

type OrderType = {
    seller:string;
    id: string;
    dueDate: string;
    customer: {
        id: string;
        name: string;
    };
    recipes: Array<{
        id: string;
        name: string;
        total: string;
        quantity: string;
    }>;
};

export default function Orders({ className, header, description }: IOrderProps) {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
    const [searchString, setSearchString] = useState('');
    const [isLoading, setIsLoading] = useState(true); // new loading state
    const [error, setError] = useState(null); // new error state


    const fetchOrders = async () => {
        try {
            //const user = await Auth.currentAuthenticatedUser();
            //const payload = { seller_email: user.attributes.email };
            const payload = { seller_email: 'tomer@gmail.com'};
            console.log(payload);
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get-all-my-orders', {params:payload});
            const apiData = JSON.parse(response.data.body);
            console.log(apiData);
            const transformedOrders = apiData.map((orderData: any) => createOrderFromData(orderData));
            setOrders(transformedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const filtered = orders.filter((order) => {
            const name = order.customer.name.toLowerCase();
            console.log(name, searchString, name.includes(searchString));
            return name.includes(searchString);
        });
        setFilteredOrders(filtered);
    }, [orders, searchString]);


    const createOrderFromData = (orderData: any) => {
        let orderCost=0;
        const createRecipeFromData = (recipeData: any) => {
            const recipeName = recipeData.M.recipe_name.S;
            const recipePrice = recipeData.M.recipe_price.S;
            const recipeQuantity = recipeData.M.recipe_quantity.S;
            orderCost+= parseInt(recipePrice)*parseInt(recipeQuantity);
            return { id: '', name: recipeName, total: recipePrice, quantity: recipeQuantity };
        };
        const orderRecipes = orderData.order.L.map(createRecipeFromData);
        const orderDate = orderData['due_date'].S;
        //console.log(`order id:${orderData.id}`);
        const customer = { id: orderData.order_id.S, name: orderData.buyer_email.S };
        return { id: orderData.order_id.S, dueDate: orderDate, customer: customer, recipes: orderRecipes,totalCost:orderCost };
    };


    return (
        <div className={`dashboard-orders-widget-container orders-widget ${className}`}>
            <div className="orders-header">
                <div className="orders-header-title-row">
                    <div className="orders-header-text">
                        <span className="widget-title-text">{header}</span>
                        <span className="widget-title-text-secondary">{description}</span>
                    </div>
                    <div className="orders-header-find-container">
                        <SearchField
                            placeholder="Find"
                            onChangeHandler={(event: any) => {
                                setSearchString(event.target.value.toLowerCase());
                            }}
                        />
                    </div>
                </div>

                <div className="orders-header-orders-list-title">
                    <div className="orders-header-orders-list-title-item">
                        <span>Order</span>
                    </div>
                    <div className="orders-header-orders-list-title-item">
                        <span>Customer</span>
                    </div>
                    <div className="orders-header-orders-list-title-item">
                        <span>Total</span>
                    </div>
                </div>
            </div>
            <div className="orders-list-container">
                <div className="orders-list">
                    {filteredOrders.map((order) => {
                        return <OrderDelegate key={order.id} data={order} />;
                    })}
                </div>
            </div>
            <NavigationButtonComponent to="/orders/new" text="Add Order"/>
            <ToastContainer />
        </div>
    );
}
