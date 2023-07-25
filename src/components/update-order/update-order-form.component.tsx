import React, {useEffect, useState} from 'react';
import '../../App.css';
import './update-order-form.style.css';
import RecipeDelegate from "../create-new-order/recipe-delegate/recipe-delegate.component";
import DatePicker from "../date-picker/date-picker.component";
import ComboBox from "../combo-box/combo-box.component";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axios from "axios";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

interface IProps {
    id: string;
}


type OrderType = {
    seller: string;
    id: string;
    dueDate: string;
    customer: {
        id: string;
        name: string;
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


interface Ingredient {
    M: {
        is_automated_ingredient: { N: string };
        ingredient_code: { S: string };
        ingredient_name: { S: string };
        ingredient_price: { N: string };
        ingredient_quantity: { N: string };
    };
}



export default function EditOrderForm({id}: IProps) {

    const [order_id,setOrderId]=useState();
    const [customerName, setCustomerName] = useState<string>("");
    const [dueDate, setDueDate] = useState(dayjs());
    const [orderRecipes, setOrderRecipes] = useState<OrderRecipeItem[]>([]);
    const [recipeName, setRecipeName] = useState("");
    const [recipePrice, setRecipePrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [myRecipesNames, setRecipeNames] = useState<string[]>([]);
    const [myRecipes, setMyRecipes] = useState<RecipeItem[]>([]);
    //const [order, setOrder] = useState<OrderType>(); //TODO: Tomer - should be initialized to chosen order by ID
    const options1 = ["Nikol", "Eden", "Amit", "Tomer"];  //TODO: Eden - remove after integration
    const [orderPrice,setOrderPrice]=useState(0);
    const [myCustomers,setCustomers]=useState(options1); //TODO: Eden - should be initializes to all customer names for the user that is currently logged in. (Consider saving change customer name to customer email)
    const navigate = useNavigate();
    const [currentRecipe,setCurrentRecipe]=useState<RecipeItem>();
    const [minCost, setMinCost] = useState(0);
    const [maxCost, setMaxCost] = useState(0);
    const [avgCost, setAvgCost] = useState(0);
    const [totalMinCost, setTotalMinCost] = useState(0);
    const [totalMaxCost, setTotalMaxCost] = useState(0);
    const [totalAvgCost, setTotalAvgCost] = useState(0);


    useEffect(() => {
        if(recipeName==="")
        {
            setQuantity(0);
            setMinCost(0);
            setAvgCost(0);
            setMaxCost(0);
            setRecipePrice(0);
        }
        else
        {
            if (myRecipes) {
                const recipe = myRecipes.find((recipe) => recipe.recipe_name.toString() === recipeName);
                if (recipe) {
                    setCurrentRecipe(recipe);
                    setMinCost(recipe.ingredients_min_cost);
                    setAvgCost(recipe.ingredients_avg_cost);
                    setMaxCost(recipe.ingredients_max_cost);
                    setRecipePrice(recipe.recipe_price);
                    setQuantity(1);
                }
            }

        }
    }, [recipeName]);
    useEffect(()=>{fetchUserRecipes();},[]);
    useEffect(()=>{fetchOrder(); },[]);
    const deleteRecipeFromOrder = (recipeName: string) => {
        const index = orderRecipes.findIndex(recipe => recipe.recipe_name=== recipeName);
        const newOrders = [...orderRecipes];
        addToOrderPrice(-(orderRecipes[index].recipe_quantity*orderRecipes[index].recipe_price));
        addTotalMinIngredientCost(-(orderRecipes[index].ingredients_min_cost*orderRecipes[index].recipe_quantity));
        addTotalAvgIngredientCost(-(orderRecipes[index].ingredients_avg_cost*orderRecipes[index].recipe_quantity));
        addTotalMaxIngredientCost(-(orderRecipes[index].ingredients_max_cost*orderRecipes[index].recipe_quantity));
        newOrders.splice(index, 1);
        setOrderRecipes(newOrders);
    }




    function addTotalMinIngredientCost(val:number)
    {
        setTotalMinCost(totalMinCost+val);
    }
    function addTotalAvgIngredientCost(val:number)
    {
        setTotalAvgCost(totalAvgCost+val);
    }
    function addTotalMaxIngredientCost(val:number)
    {
        setTotalMaxCost(totalMaxCost+val);
    }


    async function addToOrderPrice(value:number)
    {
        setOrderPrice(Number(value)+Number(orderPrice));
    }

    async function sendDataToBackend() {
        try {
            const orderData = {
                seller_email: "tomer@gmail.com",
                order_id: order_id,
                buyer_email: customerName,
                due_date: dueDate,
                recipes: orderRecipes,
                order_price: orderPrice
            }
                const postPromise  =  axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/new_order', orderData);
                toast.promise(
                    () => postPromise,
                    {
                        pending: 'Loading',
                        success: { render: 'Order deleted', autoClose: 1000 },
                        error: { render: 'Error deleting order', autoClose: 1000 }
                    }
                ).then(response => {
                    if (response.status === 200) {
                        navigate(`/orders`);
                    }
                });
            } catch (error) {
                console.log(error);
                return error;
            }
    }

    useEffect(() => {
        if(currentRecipe) {
            setRecipePrice(quantity * currentRecipe.recipe_price);
        }
    }, [quantity]);


    useEffect(() => {
        if(currentRecipe)
            setRecipePrice(quantity * currentRecipe.recipe_price);
    }, [quantity]);
    const fetchOrder = async () => {
        try {
            const payload = {seller_email: 'tomer@gmail.com', order_id: id};
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_order', {params: payload});
            const responseData = JSON.parse(response.data.body);
            setCustomerName(responseData[0].buyer_email.S);
            setDateFromPicker(responseData[0].due_date.S);
            setOrderId(responseData[0].order_id.S);
            setOrderPrice(responseData[0].order_price.N);
            updateOrderFromData(responseData[0].recipes);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    function updateOrderCosts(orderRecipes1:OrderRecipeItem[])
    {
        orderRecipes1.forEach((recipe) => {
            setTotalMinCost(prevMinCost => prevMinCost + recipe.ingredients_min_cost * recipe.recipe_quantity);
            setTotalAvgCost(prevAvgCost => prevAvgCost + recipe.ingredients_avg_cost * recipe.recipe_quantity);
            setTotalMaxCost(prevMaxCost => prevMaxCost + recipe.ingredients_max_cost * recipe.recipe_quantity);
        });
    }
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

    const updateOrderFromData = (orderData: any) => {
        const result: OrderRecipeItem[] = orderData.L.map((orderRecipe:any) => ({
            recipe_name: orderRecipe.M.recipe_name.S,
            ingredients_min_cost :orderRecipe.M.ingredients_min_cost.N,
            ingredients_avg_cost :orderRecipe.M.ingredients_avg_cost.N,
            ingredients_max_cost :orderRecipe.M.ingredients_max_cost.N,
            recipe_quantity: orderRecipe.M.recipe_quantity.N,
            recipe_price: orderRecipe.M.recipe_price.N
        }))
        console.log(result);
        setOrderRecipes(result);
        updateOrderCosts(result);
    };


    const makeRecipe = (recipe:any): OrderRecipeItem => {
        addToOrderPrice(quantity*recipe.recipe_price);
        return {
            recipe_name: recipe.recipe_name,
            recipe_quantity: quantity,
            ingredients_min_cost:  recipe.ingredients_min_cost,
            ingredients_avg_cost:  recipe.ingredients_avg_cost,
            ingredients_max_cost: recipe.ingredients_max_cost,
            recipe_price: recipe.recipe_price
        }
    }
/*    function updateOrderExistRecipe(recipe:any) { //TODO  if the recipe exist it update it values
        addToOrderPrice(quantity * recipe.recipe_price);
        recipe.recipe_quantity = recipe.recipe_quantity + quantity;
    }*/
    function addRecipeToOrder() {
        const recipe = orderRecipes.find((recipe:any) => recipe.recipe_name === recipeName);
        if(recipe) {
            //updateOrderExistRecipe(recipe);
            recipe.recipe_quantity = Number(recipe.recipe_quantity) + quantity;
            addToOrderPrice(recipe.recipe_price*Number(quantity));
            addTotalMinIngredientCost(recipe.ingredients_min_cost*quantity);
            addTotalAvgIngredientCost(recipe.ingredients_avg_cost*quantity);
            addTotalMaxIngredientCost(recipe.ingredients_max_cost*quantity);

        }
        else
        {
            const recipeFromMyRecipes =myRecipes.find((recipe:any) => recipe.recipe_name === recipeName);
            if(recipeFromMyRecipes) {
                setOrderRecipes([...orderRecipes, makeRecipe(recipeFromMyRecipes)]);
                addTotalMinIngredientCost(recipeFromMyRecipes.ingredients_min_cost*quantity);
                addTotalAvgIngredientCost(recipeFromMyRecipes.ingredients_avg_cost*quantity);
                addTotalMaxIngredientCost(recipeFromMyRecipes.ingredients_max_cost*quantity);
                addToOrderPrice(Number(recipeFromMyRecipes.recipe_price * quantity));
            }
        }
        setCurrentRecipe(undefined);
        setRecipeName("");
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
                    <ComboBox setValueDelegate={setCustomerName} label="Customer Name" options={[]} isDisabled={true}
                              initialValue={customerName}/>
                </div>
                <DatePicker setValueDelegate={setDateFromPicker} initValue={dueDate.toString()/*.toISOString().split('T')[0]*/}/>
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
                        <div className="recipes-input">

                            <Autocomplete
                                disablePortal
                                value={recipeName}
                                id="comcbo-box-demo"
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
                                    setQuantity(Number(e.target.value))
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Quantity'} type="number"
                                           defaultValue={Number(quantity)}
                                           value={Number(quantity) === 0 ? "" : quantity.toString()}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}

                                />
                            </Box>

                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setMinCost(Number(e.target.value))
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Ingredients Min Cost'}
                                           type="number" disabled={true}
                                           defaultValue={minCost}
                                           value={minCost === 0 ? "" : minCost}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setAvgCost(Number(e.target.value))
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Ingredients Avg Cost'}
                                           type="number" disabled={true}
                                           defaultValue={avgCost}
                                           value={avgCost === 0 ? "" : avgCost}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setMaxCost(Number(e.target.value))
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Ingredients Max Cost'}
                                           type="number" disabled={true}
                                           defaultValue={maxCost}
                                           value={maxCost === 0 ? "" : maxCost}
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
                                <TextField variant="standard" id="standard-number" label={'Price'} type="number"
                                           defaultValue={recipePrice}
                                           value={recipePrice === 0 ? "" : recipePrice}
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
                                    setTotalMinCost(Number(e.target.value))
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
                                    setTotalAvgCost(Number(e.target.value))
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
                                    setTotalMaxCost(Number(e.target.value))
                                }}
                            />
                        </Box>
                        <button className='add-recipe-to-order-button' onClick={addRecipeToOrder}>Add recipe</button>
                    </div>
                </div>

            </div>

            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Update</button>
            </div>
        </div>
    )
}
