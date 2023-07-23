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
import StandardInputField from "../standart-input-field/input-field.component";
import InputField from "../outlinedd-input-field/input-field.component";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

interface IProps {
    id: string;
}


interface Ingredient {
    M: {
        is_automated_ingredient: { N: string };
        ingredient_code: { S: string };
        ingredient_name: { S: string };
        ingredient_price: { N: string };
        ingredient_quantity: { N: string };
    }}

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
    recipe_ingredients_cost: { N: string };
    recipe_id: { S: string };
    user_email: { S: string };
    ingredients: { L: Ingredient[] };
    recipe_name: { S: string };
    recipe_price: { S: string };
}


interface OrderRecipeItem {
    recipe_name: { S: string };
    recipe_quantity: { S: string };
    ingredients_min_cost: { N: string };
    ingredients_avg_cost: { N: string };
    ingredients_max_cost: { N: string };
    recipe_price: { S: string }
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
interface RecipeItem {
    ingredients_min_cost: { S: string };
    ingredients_avg_cost: { S: string };
    ingredients_max_cost: { S: string };
    recipe_id: { S: string };
    user_email: { S: string };
    ingredients: { L: Ingredient[] };
    recipe_name: { S: string };
    recipe_price: { S: string };
}


export default function EditOrderForm({id}: IProps) {

    const [order_id,setOrderId]=useState();
    const [customerName, setCustomerName] = useState<string>("");
    const [dueDate, setDueDate] = useState(dayjs());
    const [orderRecipes, setOrderRecipes] = useState<OrderRecipeItem[]>([]);
    const [orderCost, setOrderCost] = useState('');
    const [recipeName, setRecipeName] = useState("");
    const [recipePrice, setRecipePrice] = useState("");
    const [quantity, setQuantity] = useState('');
    const [ingredientsCost, setIngredientsCost] = useState('');
    const [myRecipesNames, setRecipeNames] = useState<string[]>([]);
    const [myRecipes, setMyRecipes] = useState<RecipeItem[]>([]);
    const [order, setOrder] = useState<OrderType>(); //TODO: Tomer - should be initialized to chosen order by ID
    const options1 = ["Nikol", "Eden", "Amit", "Tomer"];  //TODO: Eden - remove after integration
    const [orderPrice,setOrderPrice]=useState(0);
    const [myCustomers,setCustomers]=useState(options1); //TODO: Eden - should be initializes to all customer names for the user that is currently logged in. (Consider saving change customer name to customer email)
    const navigate = useNavigate();


    const [minCost, setMinCost] = useState('');
    const [maxCost, setMaxCost] = useState('');
    const [avgCost, setAvgCost] = useState('');
    const [totalMinCost, setTotalMinCost] = useState('');
    const [totalMaxCost, setTotalMaxCost] = useState('');
    const [totalAvgCost, setTotalAvgCost] = useState('');


    const deleteRecipeFromOrder = (recipeName: string) => {
        const index = orderRecipes.findIndex(recipe => recipe.recipe_name.S === recipeName);
        const newOrders = [...orderRecipes];
        setOrderCost((-Number(orderRecipes[index].recipe_quantity.S)*Number(orderRecipes[index].recipe_price.S)).toString());
        newOrders.splice(index, 1);
        setOrderRecipes(newOrders);
    }
    async function addToOrderPrice(value:number)
    {
        setOrderPrice(Number(orderPrice)+value);
    }

    async function sendDataToBackend() {
        try {
            const orderData = {
                seller_email: "tomer@gmail.com",
                order_id: order_id,
                buyer_email: customerName,
                due_date: dueDate,
                recipes: orderRecipes,
                order_price: orderPrice.toString()
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

    useEffect(()=>{fetchUserRecipes();},[]);
    useEffect(()=>{fetchOrder(); },[]);
    useEffect(() => {
        //price;
        }, [quantity]); //TODO this calculate the Total Cost
/*    useEffect(()=>{
        if(myRecipes)
        {
            const recipe = myRecipes.find((recipe)  => recipe.recipe_name.toString() === recipeName);
            if (recipe) {
                setIngredientsCost(recipe.recipe_ingredients_cost.toString());
                setQuantity('1');
                setTotalCost(ingredientsCost.toString());
            }
        }
    },[recipeName]); //TODO this is taking the recipe name and return the data of this recipe so we can send it back to the DB*/

    useEffect(() => {
        fetchUserRecipes();
    }, [orderRecipes]);
    useEffect(() => {
        fetchOrder();
    }, []);
    useEffect(() => {
        console.log(myRecipesNames);
    }, [myRecipesNames]);
    useEffect(() => {
        console.log(myRecipes);
    }, [myRecipes]);
/*    useEffect(() => {
        console.log(`order: ${order}`);
        //TODO: Tomer - all fields should have values from the order
        if (order) {
            setCustomerName(order.customer.name);
            setDueDate(dayjs(order.dueDate));
        }
    }, [order]);*/
    const fetchOrder = async () => {
        try {
            const payload = {seller_email: 'tomer@gmail.com', order_id: id};
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_order', {params: payload});
            const responseData = JSON.parse(response.data.body);
            setCustomerName(responseData[0].buyer_email.S);
            setDateFromPicker(dayjs(responseData[0].due_date.S));
            setOrderId(responseData[0].order_id.S);
            setOrderPrice(responseData[0].order_price.S);
            createRecipesArrFromData(responseData[0]);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const createOrderFromData = (orderData: any) => {
        let orderCost = 0;
        const createRecipeFromData = (recipeData: any) => {
            const recipeName = recipeData.M.recipe_name.S;
            const recipePrice = recipeData.M.recipe_price.S;
            const recipeQuantity = recipeData.M.recipe_quantity.S;
            orderCost += parseInt(recipePrice) * parseInt(recipeQuantity);
            return {id: '', name: recipeName, total: recipePrice, quantity: recipeQuantity};
        };
        const orderRecipes = orderData.order.L.map(createRecipeFromData);
        const orderDate = orderData['due_date'].S;
        const customer = {id: orderData.order_id.S, name: orderData.buyer_email.S};
        return {
            id: orderData.order_id.S,
            dueDate: orderDate,
            customer: customer,
            recipes: orderRecipes,
            totalCost: orderCost
        };
    };
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
                    recipe_price: Number(item.recipe_price.S),
                };
            });
            setMyRecipes(recipesArr);
            const recipeNames: string[] = responseData.map((recipe: { recipe_name: { S: string } }) => recipe.recipe_name.S);
            setRecipeNames(recipeNames);

        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    const createRecipesArrFromData = (orderData: any) => {
        const result: OrderRecipeItem[] = orderData.recipes.L.map((item:any) => ({
            recipe_name: { S: item.M.recipe_name.S },
            recipe_IngredientCost: { S: item.M.recipe_IngredientCost.S },
            recipe_quantity: { S: item.M.recipe_quantity.S },
            recipe_totalCost: { S: item.M.recipe_totalCost.S },
        }))
        setOrderRecipes(result);
    };

    const makeRecipe = (name:string, quantity:string, ingredientsMinCost:string,ingredientsAvgCost:string,ingredientsMaxCost:string, recipePrice:string = (parseFloat(quantity) * parseFloat(ingredientsCost)).toString()): OrderRecipeItem => {
        addToOrderPrice(Number(quantity)*Number(ingredientsCost));
        return {
            recipe_name: {S: name},
            recipe_quantity: {S: quantity},
            ingredients_min_cost: {N: ingredientsMinCost},
            ingredients_avg_cost: {N: ingredientsAvgCost},
            ingredients_max_cost: {N: ingredientsMaxCost},
            recipe_price: {S: recipePrice}
        }
    }
    function recipeExistInOrders(orderRecipes:any,quantity:string, ingredientsCost:string, totalCost:string){ //TODO  if the recipe exist it update it values
        const recipe = orderRecipes.find((recipe:any) => recipe.recipe_name.S === recipeName);
        if(recipe)
        {
            addToOrderPrice(Number(quantity)*Number(ingredientsCost));
            recipe.recipe_quantity.S=(Number(recipe.recipe_quantity.S)+ Number(quantity)).toString();
            recipe.ingridien.S=(Number(recipe.recipe_totalCost.S)+ Number(quantity)*Number(ingredientsCost)).toString();
            recipe.recipe_totalCost.S=(Number(recipe.recipe_totalCost.S)+ Number(quantity)*Number(ingredientsCost)).toString();
            recipe.recipe_totalCost.S=(Number(recipe.recipe_totalCost.S)+ Number(quantity)*Number(ingredientsCost)).toString();
            return true;
        }
        return false;
    }

    function addRecipeToOrder() {
        const recipeExistInArray = recipeExistInOrders(orderRecipes,quantity, recipePrice, recipePrice); //TODO  if the recipe exist it update it values
        if(!recipeExistInArray) {
            console.log(`went inside not exist`);
            setOrderRecipes([...orderRecipes, makeRecipe(recipeName, minCost, avgCost,maxCost, recipePrice)]); //TODO  if the recipe doesnt exist it create a new item
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
                    <ComboBox setValueDelegate={setCustomerName} label="Customer Name" options={[]} isDisabled={true}
                              initialValue={customerName}/>
                </div>
                <DatePicker setValueDelegate={setDateFromPicker} initValue={dueDate.toString()/*.toISOString().split('T')[0]*/}/>
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
                        <div className="recipes-input">

                            <Autocomplete
                                disablePortal
                                value={recipeName}
                                id="comcbo-box-demo"
                                onChange={(event: any, newValue: string | null) => {
                                    console.log(`New Value: ${newValue}`);
                                    if (newValue)
                                        setRecipeName(newValue);
                                    else setRecipeName("");

                                }}
                                options={myRecipesNames/*myRecipes*/}
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
                                <TextField variant="standard" id="standard-number" label={'Total Cost'} type="number"
                                           defaultValue={recipePrice} value={recipePrice}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>{/* TODO: Tomer - should be calculated automatically when quantity inserted. Do we need 3?  No we only need max cost */}

                        </div>
                        <div className="orders-list">
                            {
                                    orderRecipes.map((recipe) => {
                                        return <RecipeDelegate removeDelegate={deleteRecipeFromOrder}
                                                               key={recipe.recipe_name.S}
                                                               name={recipe.recipe_name.S}
                                                               quantity={recipe.recipe_quantity.S.toString()}
                                                               minCost={recipe.ingredients_min_cost.toString()}
                                                               avgCost={recipe.ingredients_avg_cost.toString()}
                                                               maxCost={recipe.ingredients_max_cost.toString()}
                                                               price={recipe.recipe_price.S}/>
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
                <button className='button button-gradient' onClick={sendDataToBackend}>Update</button>
            </div>
        </div>
    )
}
