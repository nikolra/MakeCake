import React, {useEffect, useState} from 'react';
import '../../App.css';
import './create-new-order-form.style.css';
import RecipeDelegate from "./recipe-delegate/recipe-delegate.component";
import DatePicker from "../date-picker/date-picker.component";
import ComboBox from "../combo-box/combo-box.component";
import dayjs from 'dayjs';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer,} from "react-toastify";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Cookies from 'js-cookie';

interface ICustomer {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    orders: {
        id: string;
        dueDate: number;
        totalCost: number;
    }[];
}

export default function NewOrderForm() {

    interface RecipeItem {
        recipe_name: string;
        ingredients_min_cost: number;
        ingredients_avg_cost: number;
        ingredients_max_cost: number;
        recipe_quantity: number;
        recipe_price: number;
        default_price:number;
    }


    const [customerName, setCustomerName] = useState('');
    const [dueDate, setDueDate] = useState(dayjs());
    const [orderRecipes, setOrderRecipes] = useState<RecipeItem[]>([]);
    const [orderPrice, setOrderPrice] = useState(0);
    const [recipeName, setRecipeName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [minCost, setMinCost] = useState(0);
    const [maxCost, setMaxCost] = useState(0);
    const [avgCost, setAvgCost] = useState(0);
    const [totalMinCost, setTotalMinCost] = useState(0);
    const [totalMaxCost, setTotalMaxCost] = useState(0);
    const [totalAvgCost, setTotalAvgCost] = useState(0);
    const [recipePrice, setRecipePrice] = useState(0);
    const [currentRecipe, setCurrentRecipe] = useState<RecipeItem>();
    const [myRecipesNames, setRecipeNames] = useState<string[]>([]);
    const [myCustomersNames, setCustomersNames] = useState<string[]>([""]);
    const [myRecipes, setMyRecipes] = useState<RecipeItem[]>([]);
    const [myCustomers, setCustomers] = useState<ICustomer[]>();
    const [manualPrice , setManualPrice]=useState(0);


    const navigate = useNavigate();


    useEffect(() => {
        if (!Cookies.get('makecake-token')) {
            navigate("/");
            return;
        }
        fetchUserRecipes();
        fetchCustomers();
    }, []);
    useEffect(() => {
        if (recipeName === "") {
            setQuantity(0);
            setMinCost(0);
            setAvgCost(0);
            setMaxCost(0);
            setRecipePrice(0);
        }
        if (myRecipes) {
            const recipe = myRecipes.find((recipe) => recipe.recipe_name === recipeName);
            if (recipe) {
                setCurrentRecipe(recipe);
                setMinCost(recipe.ingredients_min_cost);
                setAvgCost(recipe.ingredients_avg_cost);
                setMaxCost(recipe.ingredients_max_cost);
                setRecipePrice(recipe.recipe_price);
                setQuantity(1);
            }
        }
    }, [recipeName]);

    const fetchCustomers = async () => {
        const payload = {};
        const response =
            await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/all-customers',
                payload,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + Cookies.get('makecake-token')
                    }
                });
        const names = response.data.map((customer: ICustomer) => {return `${customer.name} - ${customer.email}`});
        setCustomersNames(names);
        console.log(response);

    }

    const deleteRecipeFromOrder = (recipeName: string) => {
        const index = orderRecipes.findIndex(recipe => recipe.recipe_name === recipeName);
        const newOrders = [...orderRecipes];
        addToOrderPrice(-(orderRecipes[index].recipe_price*orderRecipes[index].recipe_quantity));
        addTotalMinIngredientCost(-(orderRecipes[index].ingredients_min_cost * orderRecipes[index].recipe_quantity));
        addTotalAvgIngredientCost(-(orderRecipes[index].ingredients_avg_cost * orderRecipes[index].recipe_quantity));
        addTotalMaxIngredientCost(-(orderRecipes[index].ingredients_max_cost * orderRecipes[index].recipe_quantity));
        orderRecipes[index].recipe_price=orderRecipes[index].default_price;
        newOrders.splice(index, 1);
        setOrderRecipes(newOrders);
    }

    function addTotalMinIngredientCost(val: number) {
        setTotalMinCost(totalMinCost + val);
    }

    function addTotalAvgIngredientCost(val: number) {
        setTotalAvgCost(totalAvgCost + val);
    }

    function addTotalMaxIngredientCost(val: number) {
        setTotalMaxCost(totalMaxCost + val);
    }

    function addToOrderPrice(value: number) {
        setOrderPrice(orderPrice + value);
    }

    function generateNumericID() {
        const min = 100000000; // Minimum 16-digit number
        const max = 999999999; // Maximum 16-digit number
        const numericID = Math.floor(Math.random() * (max - min + 1)) + min;
        return numericID.toString();
    }

    const fetchUserRecipes = async () => {
        try {
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_user_recipes', {
                headers: {
                    "Content-type": "application/json",
                    Authorization: "Bearer " + Cookies.get('makecake-token')
                }
            });
            const responseData = JSON.parse(response.data.body);
            const recipeItems = responseData.map((item: RecipeItem) => ({
                recipe_price: item.recipe_price,
                recipe_name: item.recipe_name,
                ingredients_min_cost: item.ingredients_min_cost,
                ingredients_max_cost: item.ingredients_max_cost,
                ingredients_avg_cost: item.ingredients_avg_cost,
                quantity: 0,
                default_price:item.recipe_price,
            }));
            setMyRecipes(recipeItems);
            const recipeNames: string[] = responseData.map((recipe: any) => recipe.recipe_name);
            setRecipeNames(recipeNames);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    async function sendDataToBackend() {
        const order_Id = generateNumericID();
        if (customerName === "")
            toast.error("Please choose a customer");
        else if (orderRecipes.length === 0)
            toast.error("Please add at least  one recipe to the order");
        else if (isNaN(Number(orderPrice)))
            toast.error("Order price must be a number");
        else if (orderPrice === 0 || orderPrice.toString() === "0" || orderPrice.toString() === "")
            toast.error("Order price can't be 0");
        else {
            try {
                const payload = {
                    order_id: order_Id,
                    buyer_name: customerName.split('-')[0].split(' ')[0],
                    buyer_email: customerName.split('-')[1].split(' ')[1],
                    due_date: dueDate,
                    recipes: orderRecipes,
                    order_price: orderPrice
                };
                try {
                    const response = await axios.post(
                        'https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/new_order',
                        payload,
                        {
                            headers: {
                                "content-type": "application/json",
                                "Authorization": "Bearer " + Cookies.get('makecake-token')
                            }
                        }
                    );
                    if (response.status === 200) {
                        toast.success('Order created successfully', {autoClose: 2000});
                        navigate(`/orders`);
                    } else {
                        toast.error('Error creating order');
                    }
                } catch (error) {
                    //toast.dismiss(loadingToast); // Dismiss the "Loading" toast
                    toast.error('Error creating order');
                    console.error(error);
                }
            } catch (error) {
                return error;
            }
        }
    }

    function addRecipeToOrder() {
        const recipe = orderRecipes.find((recipe:any) => recipe.recipe_name === recipeName);
        if(recipe) {
            if(recipe.recipe_name==="") {
                toast.error("please choose recipe");
            }
            else {
                let newPrice=0;
                let recipeprice=0;
                if(manualPrice !== 0 && recipe.recipe_price !== manualPrice) {
                    newPrice=((orderPrice-(recipe.recipe_price*recipe.recipe_quantity)));
                    recipe.recipe_price = manualPrice / quantity;
                }

                recipe.recipe_quantity = recipe.recipe_quantity + quantity;
                newPrice += recipe.recipe_quantity*recipe.recipe_price;
                setOrderPrice(newPrice);
                setManualPrice(0)
                addTotalMinIngredientCost(recipe.ingredients_min_cost * quantity);
                console.log(recipe.ingredients_min_cost * quantity);
                addTotalAvgIngredientCost(recipe.ingredients_avg_cost * quantity);
                addTotalMaxIngredientCost(recipe.ingredients_max_cost * quantity);
            }
        }
        else
        {
            const recipeFromMyRecipes =myRecipes.find((recipe:any) => recipe.recipe_name === recipeName);
            if(recipeFromMyRecipes) {
                if(manualPrice !== 0 && recipeFromMyRecipes.recipe_price !== manualPrice) {
                        recipeFromMyRecipes.recipe_price = manualPrice / quantity;
                        addToOrderPrice(manualPrice);
                    }
                else
                    addToOrderPrice(recipePrice * quantity);
                setOrderRecipes([...orderRecipes, recipeFromMyRecipes]);
                console.log(recipeFromMyRecipes.ingredients_min_cost * quantity);
                addTotalMinIngredientCost(recipeFromMyRecipes.ingredients_min_cost * quantity);
                addTotalAvgIngredientCost(recipeFromMyRecipes.ingredients_avg_cost * quantity);
                addTotalMaxIngredientCost(recipeFromMyRecipes.ingredients_max_cost * quantity);
                }
            else{
                toast.error("please choose a recipe");
            }
        }
        setCurrentRecipe(undefined);
        setRecipeName('');
        setManualPrice(0)
        setQuantity(0);
        setMinCost(0);
        setMaxCost(0);
        setAvgCost(0);
        setRecipePrice(0);
    }


    function setDateFromPicker(value: any) {
        setDueDate(value);
    }

    return (
        <div className="dashboard-widget-container new-order-widget all-orders-container inputs-container">
            <div className="input-fields">
                <div className={"new-order-customer-name"}>
                    {/*<ComboBox setValueDelegate={setCustomerName} label="Customer Name" options={myCustomers}/>*/}
                    <div className="combo-box">
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            // value={myCustomers[0]}
                            onChange={(event: any, newValue: string | null) => {
                                setCustomerName(newValue? newValue: myCustomersNames[0]);
                            }}
                            options={myCustomersNames}
                            sx={{width: 300}}
                            renderInput={(params) => <TextField {...params} label={"Customer Name"}/>}
                        />
                    </div>
                </div>
                <DatePicker setValueDelegate={setDateFromPicker}/>
                <div className={"new-order-customer-name"}>
                    <Box
                        component="div"
                        sx={{
                            width: 255,
                            maxWidth: '100%',
                            m: '0 0 6px 0'
                        }}
                    >
                        <TextField fullWidth id="outlined-basic" label={"Order Price"} variant="outlined"
                                   defaultValue={orderPrice} value={orderPrice === 0 ? "" : orderPrice}
                                   onChange={(e: any) => {
                                       setOrderPrice(Number(e.target.value))
                                   }}/>
                    </Box>
                </div>
            </div>

            <div className="orders">
                <div className="recipes-header-title-row">
                    <div className="orders-header-text">
                        <span className="widget-title-text">Recipes</span>
                        <span className="widget-title-text-secondary"> </span>
                    </div>
                </div>
                <div className="recipes-widget">
                    <div className="create-recipe-header-recipes-list-title">
                        <div className="recipes-header-list-title">
                            <span>Name</span>
                        </div>
                        <div className="recipes-header-list-title">
                            <span>Quantity</span>
                        </div>
                        <div className="recipes-header-list-title">
                            <span>Min Cost</span>
                        </div>
                        <div className="recipes-header-list-title">
                            <span>Avg Cost</span>
                        </div>
                        <div className="recipes-header-list-title">
                            <span>Max Cost</span>
                        </div>
                        <div className="recipes-header-list-title">
                            <span>Price</span>
                        </div>
                    </div>

                    <div className="orders-list-container">
                        <div className="recipes-input">
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                value={recipeName}
                                onChange={(event: any, newValue: string | null) => {
                                    if (newValue)
                                        setRecipeName(newValue);
                                    else {
                                        setRecipeName("");
                                        setManualPrice(0);
                                        setRecipePrice(0);
                                    }
                                }}
                                options={myRecipesNames}
                                sx={{ width: 235, padding: "8px 0 0 0" }}
                                renderInput={(params) => <TextField {...params} label={"Name"} variant="standard" />}
                            />

                            <Box
                                component="div"
                                sx={{ '& > :not(style)': { m: 1, width: '25ch' }}}
                                onChange={(e: any) => {
                                    setQuantity(Number(e.target.value))
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Quantity'} type="number"
                                           defaultValue={quantity} value={quantity === 0 ? "" : quantity}
                                           inputProps={{ min: 1, inputMode: "numeric", pattern: '[0-9]+' }}
                                />
                            </Box>

                            <Box
                                component="div"
                                sx={{ '& > :not(style)': { m: 1, width: '25ch' }}}
                            >
                                <TextField variant="standard" id="standard-number" label={'Ingredients Min Cost'}
                                           type="number" disabled={true}
                                           defaultValue={minCost} value={minCost === 0 || quantity === 0 ? "" : minCost*quantity}
                                           inputProps={{ min: 0, inputMode: "numeric", pattern: '[0-9]+' }}
                                />
                            </Box>

                            <Box
                                component="div"
                                sx={{ '& > :not(style)': { m: 1, width: '25ch' }}}
                            >
                                <TextField variant="standard" id="standard-number" label={'Ingredients Avg Cost'}
                                           type="number" disabled={true}
                                           defaultValue={avgCost} value={avgCost === 0 || quantity === 0 ? "" : avgCost*quantity}
                                           inputProps={{ min: 0, inputMode: "numeric", pattern: '[0-9]+' }}
                                />
                            </Box>

                            <Box
                                component="div"
                                sx={{ '& > :not(style)': { m: 1, width: '25ch' }}}
                            >
                                <TextField variant="standard" id="standard-number" label={'Ingredients Max Cost'}
                                           type="number" disabled={true}
                                           defaultValue={maxCost} value={maxCost === 0 || quantity === 0 ? "" : maxCost*quantity}
                                           inputProps={{ min: 0, inputMode: "numeric", pattern: '[0-9]+' }}
                                />
                            </Box>

                            <Box
                                component="div"
                                sx={{ '& > :not(style)': { m: 1, width: '25ch' }}}
                                onChange={(e: any) => {
                                    setManualPrice(Number(e.target.value));
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Price'}
                                           type="number"
                                           defaultValue={manualPrice} value={manualPrice === 0 ? recipePrice*quantity === 0 ?"" :recipePrice*quantity : manualPrice}
                                           inputProps={{ min: 0, inputMode: "numeric", pattern: '[0-9]+' }}
                                />
                            </Box>
                        </div>
                        <div className="orders-list">
                            {
                                orderRecipes.map((recipe) => {
                                    return <RecipeDelegate removeDelegate={deleteRecipeFromOrder}
                                                           key={recipe.recipe_name}
                                                           name={recipe.recipe_name}
                                                           quantity={recipe.recipe_quantity}
                                                           minCost={recipe.ingredients_min_cost*recipe.recipe_quantity}
                                                           avgCost={recipe.ingredients_avg_cost*recipe.recipe_quantity}
                                                           maxCost={recipe.ingredients_max_cost*recipe.recipe_quantity}
                                                           price={recipe.recipe_price*recipe.recipe_quantity}/>
                                })
                            }
                        </div>
                    </div>
                    <div className="recipe-delegate-container">
                        <div/>
                        <div/>
                        <div/>
                        <Box
                            component="div"
                            sx={{
                                width: '25ch',
                                m: 1
                            }}
                        >
                            <TextField
                                disabled={true}
                                id="standard-basic"
                                label={"Order Min Cost"}
                                variant="standard"
                                defaultValue={totalMinCost}
                                value={totalMinCost === 0 ? "" : totalMinCost.toFixed(2)}
                                onChange={(e: any) => {
                                    setTotalMinCost(Number(e.target.value))
                                }}
                            />
                        </Box>
                        <Box
                            component="div"
                            sx={{
                                width: '25ch',
                                m: 1
                            }}
                        >
                            <TextField
                                disabled={true}
                                id="standard-basic"
                                label={"Order Avg Cost"}
                                variant="standard"
                                defaultValue={totalAvgCost}
                                value={totalAvgCost === 0 ? "" : totalAvgCost.toFixed(2)}
                                onChange={(e: any) => {
                                    setTotalAvgCost(Number(e.target.value))
                                }}
                            />
                        </Box>
                        <Box
                            component="div"
                            sx={{
                                width: '25ch',
                                m: 1
                            }}
                        >
                            <TextField
                                disabled={true}
                                id="standard-basic"
                                label={"Order Max Cost"}
                                variant="standard"
                                defaultValue={totalMaxCost}
                                value={totalMaxCost === 0 ? "" : totalMaxCost.toFixed(2)}
                                onChange={(e: any) => {
                                    setTotalMaxCost(Number(e.target.value))
                                }}
                            />
                        </Box>
                        <button className='add-recipe-to-order-button' onClick={addRecipeToOrder}>Add recipe</button>
                    </div>
                </div>
            </div>

            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Create</button>
            </div>
        </div>
    )
}
