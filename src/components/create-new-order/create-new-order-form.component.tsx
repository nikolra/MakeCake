import React, {useState} from 'react';
import '../../App.css';
import './create-new-order-form.style.css';
import {makeRecipe} from "./dev-data";
import RecipeDelegate from "./recipe-delegate/recipe-delegate.component";
import DatePicker from "../date-picker/date-picker.component";
import ComboBox from "../combo-box/combo-box.component";
import dayjs from 'dayjs';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
export default function NewOrderForm() {

    type RecipeType = {
        name: string;
        quantity: number;
        ingredientsCost: number;
        totalCost: string;
    };

    type CustomerType = {
        name: string;
        email: string;
    };

    const options1 = [ //TODO: Eden - remove after integration
        "Nikol", "Eden", "Amit", "Tomer"
    ]

    const [customerName, setCustomerName] = useState('yankale@gmail.com');///TODO eden need to do a getter that will return all the customers seller has
    const [dueDate, setDueDate] = useState(dayjs());
    const [orderRecipes, setOrderRecipes] = useState<Array<{
        name: string,
        quantity: number,
        ingredientsCost: number,
        totalCost: string
    }>>([]);

    const [recipeName, setRecipeName] = useState("");
    const [quantity, setQuantity] = useState('');
    const [ingredientsCost, setIngredientsCost] = useState('');//TODO: Tomer - should we have all 3 prices?
    const [totalCost, setTotalCost] = useState('');
    const [myCustomers, setCustomers] = useState(options1); //TODO: Eden - should be initializes to all customer names for the user that is currently logged in. (Consider saving change customer name to customer email)
    const [myRecipes, setMyRecipes] = useState(options1); //TODO: Tomer - should be initializes to all recipes names for the user that is currently logged in

    const navigate = useNavigate();

    const deleteRecipeFromOrder = (recipeName: string) => {
        console.log(`remove name: ${recipeName}`);
        const index = orderRecipes.findIndex(recipe => recipe.name === recipeName);
        const newOrders = [...orderRecipes];
        newOrders.splice(index, 1);
        setOrderRecipes(newOrders);
    }

    async function getMyCustomers() {
        /*
                try {
                    const payload={seller_email_address: 'tomer@gmail.com'}
                    const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/getallcustomers',{params:payload});
                    setCustomers()
                }
        */
    }

    function generateNumericID() {
        const min = 1000000000000; // Minimum 16-digit number
        const max = 9999999999999; // Maximum 16-digit number
        const numericID = Math.floor(Math.random() * (max - min + 1)) + min;
        return numericID.toString();
        //TODO: Tomer - please use a hash function to generate something smaller
    }

    async function sendDataToBackend() {
        console.log(`Submit clicked`);
        const order_Id = generateNumericID();
        try {
            console.log(order_Id);
            const orderData = {
                seller_email: "tomer@gmail.com",
                order_id: order_Id,
                buyer_email: customerName,
                due_date: dueDate.toISOString().split('T')[0],
                order: orderRecipes.map((recipe: RecipeType) => {
                    return {
                        recipe_name: recipe.name,
                        recipe_price: recipe.ingredientsCost.toString(),
                        recipe_quantity: recipe.quantity.toString()
                    }
                })
            };
            toast.promise(async () => {
                const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/new_order', orderData);
                navigate('/orders');
                //console.log(JSON.stringify(response));
            }, {
                pending: 'Loading',
                success: `Created order `,
                error: `Error creating order`
            });
        } catch (error) {
            return error;
        }
    }

    function addRecipeToOrder() {
        setOrderRecipes([...orderRecipes, makeRecipe(recipeName, quantity, ingredientsCost, totalCost)]);
        setRecipeName('');
        setQuantity('');
        setIngredientsCost('');
        setTotalCost('');
    }

    function setDateFromPicker(value: any) {
        setDueDate(value);
    }

    return (
        <div className="dashboard-widget-container new-order-widget all-orders-container inputs-container">
            <div className="input-fields">
                <div className={"new-order-customer-name"}>
                    <ComboBox setValueDelegate={setCustomerName} label="Customer Name" options={myCustomers}/>
                </div>
                <DatePicker setValueDelegate={setDateFromPicker}/>
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
                            <span>Ingredients Cost</span>
                        </div>
                        <div className="recipes-header-list-title">
                            <span>Total Cost</span>
                        </div>
                    </div>

                    <div className="orders-list-container">
                        <div className="recipes-input ">
                            <Autocomplete
                                disablePortal
                                id="comcbo-box-demo"
                                value={recipeName}
                                onChange={(event: any, newValue: string | null) => {
                                    if (newValue)
                                        setRecipeName(newValue);
                                    else setRecipeName("");

                                }}
                                options={myRecipes}
                                sx={{width: 235, padding: "8px 0 0 0"}}
                                renderInput={(params) => <TextField {...params} label={"Name"} variant="standard"/>}
                            />
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setQuantity(e.target.value)
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Quantity'} type="number"
                                           defaultValue={quantity} value={quantity}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>{/* TODO: Tomer - Should be an Int. should be inserted only after recipe is chosen*/}

                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setIngredientsCost(e.target.value)
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Ingredients Cost'} type="number"
                                           defaultValue={ingredientsCost} value={ingredientsCost}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>{/* TODO: Tomer -should be taken from the recipe*/}

                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setTotalCost(e.target.value)
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Total Cost'} type="number"
                                           defaultValue={totalCost} value={totalCost}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>{/* TODO: Tomer - should be calculated automatically when quantity inserted. Do we need 3?*/}

                        </div>
                        <div className="orders-list">
                            {
                                orderRecipes.map((recipe) => {
                                    return <RecipeDelegate removeDelegate={deleteRecipeFromOrder} key={recipe.name}
                                                           name={recipe.name} quantity={recipe.quantity.toString()}
                                                           ingredientsCost={recipe.ingredientsCost.toString()}
                                                           totalCost={recipe.totalCost.toString()}/>
                                })
                            }
                        </div>
                    </div>
                    <button className='add-recipe-to-order-button' onClick={addRecipeToOrder}>Add recipe</button>
                </div>

            </div>

            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Create</button>
            </div>
        </div>
    )
}
