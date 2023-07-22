import React, {useEffect, useState} from 'react';
import '../../App.css';
import './create-new-order-form.style.css';
import RecipeDelegate from "./recipe-delegate/recipe-delegate.component";
import DatePicker from "../date-picker/date-picker.component";
import ComboBox from "../combo-box/combo-box.component";
import dayjs from 'dayjs';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast,ToastContainer} from "react-toastify";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import update = toast.update;
import InputField from "../outlinedd-input-field/input-field.component";
import StandardInputField from "../standart-input-field/input-field.component";

export default function NewOrderForm() {

    interface Ingredient {
        M: {
            is_automated_ingredient: { N: string };
            ingredient_code: { S: string };
            ingredient_name: { S: string };
            ingredient_price: { N: string };
            ingredient_quantity: { N: string };
        };
    }

    interface RecipeItem {
        recipe_ingredients_cost: { N: string };
        recipe_id: { S: string };
        user_email: { S: string };
        ingredients: { L: Ingredient[] };
        recipe_name: { S: string };
        recipe_price: { S: string };
    }

    interface OrderRecipeItem {
        recipe_name: { S: string };
        recipe_IngredientCost: { S: string };
        recipe_quantity: { S: string };
        recipe_totalCost: { S: string }
    }

    interface OrderItem {

        seller_email: { S: string };
        buyer_email: { S: string };
        order_id: { S: string };
        due_date: { S: string };
        recipes: { L: OrderRecipeItem[] }
    }

    type CustomerType = {
        name: string;
        email: string;
    };
    const options1 = [ //TODO: Eden - remove after integration
        "Nikol", "Eden", "Amit", "Tomer"
    ]

    const [customerName, setCustomerName] = useState('yankale@gmail.com');///TODO - Eden need to do a getter that will return all the customers seller has
    const [dueDate, setDueDate] = useState(dayjs());
    const [orderRecipes, setOrderRecipes] = useState<OrderRecipeItem[]>([]);
    const [orderPrice,setOrderPrice]=useState(0);
    const [recipeName, setRecipeName] = useState("");
    const [recipePrice, setRecipePrice] = useState("");
    const [quantity, setQuantity] = useState('');
    const [ingredientsCost, setIngredientsCost] = useState('');
    const [minCost, setMinCost] = useState('');
    const [maxCost, setMaxCost] = useState('');
    const [avgCost, setAvgCost] = useState('');

    const [totalMinCost, setTotalMinCost] = useState('');
    const [totalMaxCost, setTotalMaxCost] = useState('');
    const [totalAvgCost, setTotalAvgCost] = useState('');

    const [myRecipesNames, setRecipeNames] = useState<string[]>([]); //TODO: Tomer - should be initializes to all recipes names for the user that is currently logged in
    const [myCustomers, setCustomers] = useState(options1); //TODO: Eden - should be initializes to all customer names for the user that is currently logged in. (Consider saving change customer name to customer email)
    const [myRecipes, setMyRecipes] = useState<RecipeItem[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserRecipes();
    }, []);
    useEffect(() => {
        if (myRecipes) {
            const recipe = myRecipes.find((recipe) => recipe.recipe_name.toString() === recipeName);
            if (recipe) {
                setIngredientsCost(recipe.recipe_ingredients_cost.toString());
                setQuantity('1');
                setMinCost(ingredientsCost.toString());
                //setTotalCost(parse)
            }
        }
    }, [recipeName]); //TODO this is taking the recipe name and return the data of this recipe so we can send it back to the DB
    useEffect(() => {
        const newTotalCost = Number(quantity) * Number(ingredientsCost);
        if (!isNaN(newTotalCost)) {
            setMinCost(newTotalCost.toString());
        }
    }, [quantity, ingredientsCost]); //TODO this calculate the Total Cost
    const deleteRecipeFromOrder = (recipeName: string) => {
        const index = orderRecipes.findIndex(recipe => recipe.recipe_name.S === recipeName);
        const newOrders = [...orderRecipes];
        addToOrderPrice(-Number(orderRecipes[index].recipe_totalCost.S));
        newOrders.splice(index, 1);
        setOrderRecipes(newOrders);
    }
    function generateNumericID() {
        const min = 100000000; // Minimum 16-digit number
        const max = 999999999; // Maximum 16-digit number
        const numericID = Math.floor(Math.random() * (max - min + 1)) + min;
        return numericID.toString();
        //TODO: Tomer - please use a hash function to generate something smaller  || possible but will have to save the values to a file because after a server shutdown the hashtable will reset.
    }                                                                       //TODO|| and it will forget the last key and start over again
    const fetchUserRecipes = async () => {
        try {
            const payload = {user_email: 'tomer@gmail.com'};
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_user_recipes', {params: payload});
            const responseData = JSON.parse(response.data.body);
            const recipesArr = responseData.map((item: RecipeItem) => {
                return {
                    recipe_ingredients_cost: Number(item.recipe_ingredients_cost.N),
                    user_email: item.user_email.S,
                    ingredients: item.ingredients.L.map((ingItem: Ingredient) => {
                        return {
                            is_automated_ingredient: Number(ingItem.M.is_automated_ingredient.N),
                            ingredient_code: ingItem.M.ingredient_code.S,
                            ingredient_name: ingItem.M.ingredient_name.S,
                            ingredient_price: Number(ingItem.M.ingredient_price.N),
                            ingredient_quantity: Number(ingItem.M.ingredient_quantity.N)
                        };
                    }),
                    recipe_id: item.recipe_id.S,
                    recipe_name: item.recipe_name.S,
                    recipe_price: item.recipe_price.S
                };
            });
            setMyRecipes(recipesArr);
            const recipeNames: string[] = responseData.map((recipe: { recipe_name: { S: string } }) => recipe.recipe_name.S);
            setRecipeNames(recipeNames);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    async function addToOrderPrice(value:number) {
        setOrderPrice(Number(orderPrice)+value);
    }

    async function sendDataToBackend() {
        const order_Id = generateNumericID();
        try {
            const orderData = {
                seller_email: "tomer@gmail.com",
                order_id: order_Id,
                buyer_email: customerName,
                due_date: dueDate,
                recipes: orderRecipes,
                order_price: orderPrice.toString()
            };
            const postPromise  =  axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/new_order', orderData);
            toast.promise(
                () => postPromise,
                {
                    pending: 'Loading',
                    success: { render: 'Order deleted', autoClose: 1000 },
                    error: { render: 'Error deleting order', autoClose: 1000 }
                }
            ).then(response => {
                console.log(response);
                if (response.status === 200) {
                    navigate(`/orders`);
                }
            });
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    const makeRecipe = (name:string, quantity:string, ingredientsCost:string, totalCost:string = (parseFloat(quantity) * parseFloat(ingredientsCost)).toString()): OrderRecipeItem => {
        addToOrderPrice(Number(quantity)*Number(ingredientsCost));
        return {
            recipe_name: {S: name},
            recipe_IngredientCost: {S: ingredientsCost},
            recipe_quantity: {S: quantity},
            recipe_totalCost: {S: totalCost},
        }
    }
    function recipeExistInOrders(orderRecipes:any,quantity:string, ingredientsCost:string, totalCost:string){ //TODO  if the recipe exist it update it values
        const recipe = orderRecipes.find((recipe:any) => recipe.recipe_name.S === recipeName);
        if(recipe)
        {
            addToOrderPrice(Number(quantity)*Number(ingredientsCost));
            recipe.recipe_quantity.S=(Number(recipe.recipe_quantity.S)+ Number(quantity)).toString();
            recipe.recipe_totalCost.S=(Number(recipe.recipe_totalCost.S)+ Number(quantity)*Number(ingredientsCost)).toString();
            return true;
        }
        return false;
    }

    function addRecipeToOrder() {
        const recipeExistInArray = recipeExistInOrders(orderRecipes,quantity, ingredientsCost, totalCost); //TODO  if the recipe exist it update it values
        if(!recipeExistInArray) {
            console.log(`went inside not exist`);
            setOrderRecipes([...orderRecipes, makeRecipe(recipeName, quantity, ingredientsCost, totalCost)]); //TODO  if the recipe doesnt exist it create a new item
        }
        setRecipeName('');
        setQuantity('');
        setIngredientsCost('');
        setMinCost('');
        setMaxCost('');
        setAvgCost('');

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
                <div className={"new-order-customer-name"}>
                    <InputField setValueDelegate={setOrderCost} label="Order Cost" width={255}/>
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
                                options={myRecipesNames}
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
                            </Box>

                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setMinCost(e.target.value)
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Ingredients Min Cost'}
                                           type="number" disabled={true}
                                           defaultValue={minCost} value={minCost}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setAvgCost(e.target.value)
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Ingredients Avg Cost'}
                                           type="number" disabled={true}
                                           defaultValue={avgCost} value={avgCost}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setMaxCost(e.target.value)
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Ingredients Max Cost'}
                                           type="number" disabled={true}
                                           defaultValue={maxCost} value={maxCost}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>

                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setRecipePrice(e.target.value)
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Price'}
                                           type="number"
                                           defaultValue={recipePrice} value={recipePrice}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>

                        </div>
                        <div className="orders-list">
                            {
                                orderRecipes.map((recipe) => {
                                    return <RecipeDelegate removeDelegate={deleteRecipeFromOrder}
                                                           key={recipe.recipe_name.S}
                                                           name={recipe.recipe_name.S}
                                                           quantity={recipe.recipe_quantity.S.toString()}
                                                           minCost={recipe.recipe_IngredientCost.S}
                                                           avgCost={recipe.recipe_IngredientCost.S}
                                                           maxCost={recipe.recipe_IngredientCost.S}
                                                           price={recipe.recipe_totalCost.S}/>
                                })
                            }
                        </div>
                    </div>
                    <div className="recipe-delegate-container">
                        <div/>
                        <div/>
                        <div/>
                        {/*TODO: tomer - these should have the recipe cost added to them*/}
                        <StandardInputField onChange={setTotalMinCost} placeholder="Order Min Cost" disabled={true}/>
                        <StandardInputField onChange={setTotalAvgCost} placeholder="Order Avg Cost" disabled={true}/>
                        <StandardInputField onChange={setTotalMaxCost} placeholder="Order Max Cost" disabled={true}/>
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
