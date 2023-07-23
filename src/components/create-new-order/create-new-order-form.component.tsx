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

export default function NewOrderForm() {

    interface Ingredient {
        M: {
            is_automated_ingredient: string;
            ingredient_code: string;
            ingredient_name: string ;
            ingredient_price: number ;
            ingredient_quantity:  number ;
        };
    }
    interface RecipeItem {
        ingredients_min_cost:  number;
        ingredients_avg_cost:  number;
        ingredients_max_cost:  number;
        recipe_id: string;
        user_email: string;
        ingredients: Ingredient[];
        recipe_name: string;
        recipe_price: number;
    }
    interface OrderRecipeItem {
        recipe_name: string;
        recipe_quantity: number;
        ingredients_min_cost: number;
        ingredients_avg_cost: number;
        ingredients_max_cost: number;
        recipe_price: number;
    }
    type CustomerType = {
        name: string;
        email: string;
    };
    const options1 = [ //TODO: Eden - remove after integration
        "Nikol", "Eden", "Amit", "Tomer"
    ]

    const [customerName, setCustomerName] = useState('');///TODO - Eden need to do a getter that will return all the customers seller has
    const [dueDate, setDueDate] = useState(dayjs());
    const [orderRecipes, setOrderRecipes] = useState<OrderRecipeItem[]>([]);
    const [orderPrice,setOrderPrice]=useState(0);
    const [recipeName, setRecipeName] = useState("");
    const [quantity, setQuantity] = useState('');
    const [minCost, setMinCost] = useState('');
    const [maxCost, setMaxCost] = useState('');
    const [avgCost, setAvgCost] = useState('');
    const [totalMinCost, setTotalMinCost] = useState('');
    const [totalMaxCost, setTotalMaxCost] = useState('');
    const [totalAvgCost, setTotalAvgCost] = useState('');
    const [recipePrice,setRecipePrice]=useState('');
    const [currentRecipe,setCurrentRecipe]=useState<RecipeItem>();




    const [myRecipesNames, setRecipeNames] = useState<string[]>([]); //TODO: Tomer - should be initializes to all recipes names for the user that is currently logged in
    const [myCustomers, setCustomers] = useState(options1); //TODO: Eden - should be initializes to all customer names for the user that is currently logged in. (Consider saving change customer name to customer email)
    const [myRecipes, setMyRecipes] = useState<RecipeItem[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if(recipeName==="")
        {
            setQuantity("");
            setMinCost("");
            setAvgCost("");
            setMaxCost("");
            setRecipePrice("");
        }
        }, [recipeName]);
    useEffect(() => {fetchUserRecipes(); }, []);
    useEffect(() => {
        if(currentRecipe)
            setRecipePrice((Number(quantity) * currentRecipe.recipe_price).toString());
    }, [quantity]);
    useEffect(() => {setOrderPrice(orderPrice);}, [orderPrice]);
    useEffect(() => {
        if (myRecipes) {
            const recipe = myRecipes.find((recipe) => recipe.recipe_name.toString() === recipeName);
            if (recipe) {
                setCurrentRecipe(recipe);
                setMinCost(recipe.ingredients_min_cost.toString());
                setAvgCost(recipe.ingredients_avg_cost.toString());
                setMaxCost(recipe.ingredients_max_cost.toString());
                setRecipePrice(recipe.recipe_price.toString());
                setQuantity('1');
            }
        }
    }, [recipeName]);

    const deleteRecipeFromOrder = (recipeName: string) => {
        const index = orderRecipes.findIndex(recipe => recipe.recipe_name=== recipeName);
        const newOrders = [...orderRecipes];
        addToOrderPrice(-(Number(orderRecipes[index].recipe_quantity)*(orderRecipes[index].recipe_price)));
        addTotalMinIngredientCost(-(orderRecipes[index].ingredients_min_cost*Number(orderRecipes[index].recipe_quantity)));
        addTotalAvgIngredientCost(-(orderRecipes[index].ingredients_avg_cost*Number(orderRecipes[index].recipe_quantity)));
        addTotalMaxIngredientCost(-(orderRecipes[index].ingredients_max_cost*Number(orderRecipes[index].recipe_quantity)));
        newOrders.splice(index, 1);
        setOrderRecipes(newOrders);
    }

    function addTotalMinIngredientCost(val:number)
    {
        setTotalMinCost((Number(totalMinCost)+val).toString());
    }
    function addTotalAvgIngredientCost(val:number)
    {
        setTotalAvgCost((Number(totalAvgCost)+val).toString());
    }
    function addTotalMaxIngredientCost(val:number)
    {
        setTotalMaxCost((Number(totalMaxCost)+val).toString());
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
            const recipesArr = responseData.map((item:any) => {
                return {
                    ingredients_min_cost :Number(item.ingredients_min_cost.N),
                    ingredients_avg_cost :Number(item.ingredients_avg_cost.N),
                    ingredients_max_cost :Number(item.ingredients_max_cost.N),
                    user_email: item.user_email.S,
                    recipe_id: item.recipe_id.S,
                    recipe_name: item.recipe_name.S,
                    recipe_price: Number(item.recipe_price.N)
                };
            });
            setMyRecipes(recipesArr);
            const recipeNames: string[] = recipesArr.map((recipe:any)=>recipe.recipe_name);
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
                order_price: orderPrice
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


    const makeRecipe = (recipe:any): OrderRecipeItem => {
        addToOrderPrice(Number(quantity)*recipe.recipe_price);
        return {
            recipe_name: recipe.recipe_name,
            recipe_quantity: Number(quantity),
            ingredients_min_cost:  recipe.ingredients_min_cost,
            ingredients_avg_cost:  recipe.ingredients_avg_cost,
            ingredients_max_cost: recipe.ingredients_max_cost,
            recipe_price: recipe.recipe_price
        }
    }
    function updateOrderExistRecipe(recipe:any) { //TODO  if the recipe exist it update it values
        addToOrderPrice(Number(quantity) * Number(recipe.recipe_price));
        recipe.recipe_quantity = Number(recipe.recipe_quantity) + Number(quantity);

    }
    function addRecipeToOrder() {
        const recipe = orderRecipes.find((recipe:any) => recipe.recipe_name === recipeName);
        if(recipe) {
            updateOrderExistRecipe(recipe);
            addToOrderPrice(recipe.recipe_price*Number(quantity));
            addTotalMinIngredientCost(recipe.ingredients_min_cost*Number(quantity));
            addTotalAvgIngredientCost(recipe.ingredients_avg_cost*Number(quantity));
            addTotalMaxIngredientCost(recipe.ingredients_max_cost*Number(quantity));
        }
        else
        {
            const recipeFromMyRecipes =myRecipes.find((recipe:any) => recipe.recipe_name === recipeName);
            if(recipeFromMyRecipes) {
                console.log(makeRecipe(recipeFromMyRecipes));
                setOrderRecipes([...orderRecipes, makeRecipe(recipeFromMyRecipes)]);
                addTotalMinIngredientCost(recipeFromMyRecipes.ingredients_min_cost*Number(quantity));
                addTotalAvgIngredientCost(recipeFromMyRecipes.ingredients_avg_cost*Number(quantity));
                addTotalMaxIngredientCost(recipeFromMyRecipes.ingredients_max_cost*Number(quantity));
                addToOrderPrice(recipeFromMyRecipes.recipe_price * Number(quantity));
            }
        }
        setCurrentRecipe(undefined);
        setRecipeName('');
        setQuantity('');
        setMinCost('');
        setMaxCost('');
        setAvgCost('');
        setRecipePrice('');

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
                    <Box
                        component="div"
                        sx={{
                            width: 255,
                            maxWidth: '100%',
                            m: '0 0 6px 0'
                        }}
                    >
                        <TextField  fullWidth id="outlined-basic" label={"Order Cost"} variant="outlined" defaultValue={orderPrice} value={orderPrice}
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
                                                           key={recipe.recipe_name}
                                                           name={recipe.recipe_name}
                                                           quantity={recipe.recipe_quantity.toString()}
                                                           minCost={recipe.ingredients_min_cost.toString()}
                                                           avgCost={recipe.ingredients_avg_cost.toString()}
                                                           maxCost={recipe.ingredients_max_cost.toString()}
                                                           price={recipe.recipe_price.toString()}/>
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
                                m:1
                            }}
                        >
                            <TextField
                                disabled={true}
                                id="standard-basic"
                                label={"Order Min Cost"}
                                variant="standard"
                                defaultValue={totalMinCost}
                                value={totalMinCost}
                                onChange={(e: any) => {
                                    setTotalMinCost(e.target.value)
                                }}
                            />
                        </Box>
                        <Box
                            component="div"
                            sx={{
                                width: '25ch',
                                m:1
                            }}
                        >
                            <TextField
                                disabled={true}
                                id="standard-basic"
                                label={"Order Avg Cost"}
                                variant="standard"
                                defaultValue={totalAvgCost}
                                value={totalAvgCost}
                                onChange={(e: any) => {
                                    setTotalAvgCost(e.target.value)
                                }}
                            />
                        </Box>
                        <Box
                            component="div"
                            sx={{
                                width: '25ch',
                                m:1
                            }}
                        >
                            <TextField
                                disabled={true}
                                id="standard-basic"
                                label={"Order Max Cost"}
                                variant="standard"
                                defaultValue={totalMaxCost}
                                value={totalMaxCost}
                                onChange={(e: any) => {
                                    setTotalMaxCost(e.target.value)
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
