import React, {useEffect, useState} from 'react';
import '../dashboard-widgets/widgets.style.css';
import './orders.style.css';
import axios from 'axios';
import OrderDelegate from './order-delegate/order-delegate.component';
import SearchField from '../search-field/search-field.component';
import NavigationButtonComponent from '../navigation-button/navigation-button.component';
import {toast, ToastContainer} from 'react-toastify';
import dayjs from "dayjs";
import Cookies from 'js-cookie';
import {deleteToken} from '../../utils/TokenValidation';
import {useNavigate} from "react-router-dom";

interface IOrderProps {
    className: string;
    header: string;
    description: string;
    isDashboard?: boolean;
}


interface OrderRecipeItem {
    recipe_name: string;
    recipe_quantity: number;
    ingredients_min_cost: number;
    ingredients_avg_cost: number;
    ingredients_max_cost: number;
    recipe_price: number;
}

type OrderType = {
    seller: string;
    id: string;
    dueDate: string;
    customer: string;
    order_price: number;
    recipes: OrderRecipeItem[]
};

export default function Orders({className, header, description, isDashboard}: IOrderProps) {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
    const [searchString, setSearchString] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const func = async () => {
            await fetchOrders();
        }
        func();
    }, []);

    useEffect(() => {
        const filtered = orders.filter((order) => {
            console.log('orders', order);
            const name = order.customer.toLowerCase();
            const doesInclude = name.includes(searchString);
            console.log(doesInclude);
            return doesInclude;
        });
        setFilteredOrders(filtered);
    }, [orders, searchString]);

    const deleteOrder = async (id: any) => {
        const payload = {order_id: id.toString()};
        try {
            await axios.post(`https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/delete_order`, payload,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + Cookies.get('makecake-token'),
                    }
                });
            handleDeleteOrder(id);
        } catch (error: any) {
            console.error(`Error deleting order`, error);
            if (error.response.status === 401 || error.response.status === 403) {
                deleteToken();
                navigate('/');
                toast.error('Login expired please login again', {autoClose: 1500});
            } else {
                toast.error('Error deleting order, please try again later', {autoClose: 1500});
            }
        }
    }

    const handleDeleteOrder = (id: any) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    }

    const fetchOrders = async () => {
        try {
            console.log(1);
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get-all-my-orders',
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + Cookies.get('makecake-token')
                    }
                });
            const apiData = JSON.parse(response.data.body);
            if (isDashboard) {
                const transformedOrders = apiData.map((orderData: any) => createOrderFromData(orderData, true)).filter((orderData: any) => orderData != null);
                setOrders(transformedOrders);
            } else {
                const transformedOrders = apiData.map((orderData: any) => createOrderFromData(orderData, false));
                setOrders(transformedOrders);
                console.log(orders);
            }
        } catch (error: any) {
            if (error.response.status === 401 || error.response.status === 403) {
                deleteToken();
                navigate('/');
                toast.error('Login expired please login again', {autoClose: 1500});
            } else
                console.error('Error fetching orders:', error);
        }
    };

    const createRecipeFromData = (recipeData: any): OrderRecipeItem => {
        return {
            ingredients_min_cost: recipeData.M.ingredients_min_cost.N,
            ingredients_avg_cost: recipeData.M.ingredients_avg_cost.N,
            ingredients_max_cost: recipeData.M.ingredients_max_cost.N,
            recipe_name: recipeData.M.recipe_name.S,
            recipe_price: recipeData.M.recipe_price.N,
            recipe_quantity: recipeData.M.recipe_quantity.N
        };
    };

    const createOrderFromData = (orderData: any, onlyTodayOrders: boolean) => {

        const today = dayjs().toISOString().split('T')[0];
        const orderDate = orderData['due_date'].S.split('T')[0];
        if (onlyTodayOrders && today !== orderDate) {
            return null;
        } else {
            const orderRecipes = orderData.recipes.L.map(createRecipeFromData);
            console.log(orderRecipes);
            const customer = orderData.buyer_name.S;
            return {
                id: orderData.order_id.S,
                dueDate: orderDate,
                customer: customer,
                recipes: orderRecipes,
                order_price: orderData.order_price.N,
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
                    {filteredOrders.map((order: OrderType) => {
                        return <OrderDelegate key={order.id} data={order} deleteDelegate={deleteOrder}/>;
                    })}
                </div>
            </div>
            <NavigationButtonComponent to="/orders/new" text="Add Order" spanClass={'add-order-span'}/>
            <ToastContainer/>
        </div>
    );
}
