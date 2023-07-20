import React, { useEffect, useState } from 'react';
import '../dashboard-widgets/widgets.style.css';
import './orders.style.css';
import axios from 'axios';
import OrderDelegate from './order-delegate/order-delegate.component';
import SearchField from '../search-field/search-field.component';
import NavigationButtonComponent from '../navigation-button/navigation-button.component';
import {useNavigate} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import dayjs from "dayjs";
// import { Auth } from 'aws-amplify';

interface IOrderProps {
    className: string;
    header: string;
    description: string;
    isDashboard?: boolean;
}

interface RecipeItem {
    recipe_ingredients_cost: { S: string };
    recipe_id: { S: string };
    user_email: { S: string };
    recipe_name: { S: string };
    recipe_price: { S: string };
}


type OrderType = {
    seller: string;
    id: string;
    dueDate: string;
    customer: string;
    recipes: Array<{
        id: string;
        name: string;
        total: string;
        totalCost: string;
        quantity: string;
    }>;
};

export default function Orders({ className, header, description, isDashboard }: IOrderProps) {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
    const [searchString, setSearchString] = useState('');
    const [isLoading, setIsLoading] = useState(true); // new loading state
    const [error, setError] = useState(null); // new error state
    const navigate = useNavigate();

    const deleteOrder= async (id: any) => {
        try {
            const payload = {
                seller_email: 'tomer@gmail.com',
                order_id: id
            };
            const response =await axios.delete('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/delete_order', {params: payload});
            await navigate('/orders');
            console.log(response);
        }
        catch (error)
        {
            console.error(`Error deleting order ${id}:`, error);
        }
    }

    const fetchOrders = async () => {
        try {
            //const user = await Auth.currentAuthenticatedUser();
            //const payload = { seller_email: user.attributes.email };
            const payload = { seller_email: 'tomer@gmail.com'};
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get-all-my-orders', {params:payload});
            const apiData = JSON.parse(response.data.body);
            if(isDashboard)
            {
                const transformedOrders = apiData.map((orderData:any) => createOrderFromData(orderData,true)).filter((orderData:any)=>orderData!=null);
                setOrders(transformedOrders);
            }
            else
            {
                const transformedOrders = apiData.map((orderData: any) => createOrderFromData(orderData,false));
                setOrders(transformedOrders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const filtered = orders.filter((order) => {
            const name = order.customer;
            return name.includes(searchString);
        });
        setFilteredOrders(filtered);
    }, [orders, searchString]);


    const createRecipeFromData = (recipeData: any) => {
        return{
            id: recipeData.M.recipe_name.S,
            name: recipeData.M.recipe_name.S,
            total: recipeData.M.recipe_totalCost.S,
            //totalCost: recipeData.M.recipe_totalCost.S,
            quantity: recipeData.M.recipe_quantity.S

        };
    };

    const createOrderFromData = (orderData: any,onlyTodayOrders:boolean) => {

        const today = dayjs().toISOString().split('T')[0];
        const orderDate = orderData['due_date'].S.split('T')[0];
        if (onlyTodayOrders && today !== orderDate) {
            return null;
        }
        else {
            const orderRecipes = orderData.recipes.L.map(createRecipeFromData);
            const customer = orderData.buyer_email.S;
            return {
                id: orderData.order_id.S,
                dueDate: orderDate,
                customer: customer,
                recipes: orderRecipes,
                totalCost: orderData[`order_price`].S
            };
        }
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
                    <div className="orders-header-orders-list-title-item">
                        <span>due Date</span>
                    </div>
                </div>
            </div>
            <div className="orders-list-container">
                <div className="orders-list">
                    {filteredOrders.map((order) => {
                        return <OrderDelegate key={order.id} data={order} deleteDelegate={deleteOrder}/>;
                    })}
                </div>
            </div>
            <NavigationButtonComponent to="/orders/new" text="Add Order" spanClass={'add-order-span'}/>
            <ToastContainer />
        </div>
    );
}
