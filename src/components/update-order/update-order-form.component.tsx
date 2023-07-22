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
    recipes: Array<{
        id: string;
        name: string;
        total: string;
        quantity: string;
    }>;
};

interface OrderRecipeItem {
    recipe_name: { S: string };
    recipe_IngredientCost: { S: string };
    recipe_quantity: { S: string };
    recipe_totalCost: { S: string }
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
    recipe_ingredients_cost: { N: string };
    recipe_id: { S: string };
    user_email: { S: string };
    ingredients: { L: Ingredient[] };
    recipe_name: { S: string };
    recipe_price: { S: string };
}

export default function EditOrderForm({id}: IProps) {

    const options1 = ["Nikol", "Eden", "Amit", "Tomer"];  //TODO: Eden - remove after integration

    const [customerName, setCustomerName] = useState('yankale@gmail.com');
    const [dueDate, setDueDate] = useState(dayjs());
    const [orderRecipes, setOrderRecipes] = useState<OrderRecipeItem[]>([]);
    const [orderCost, setOrderCost] = useState('');

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

    const [order, setOrder] = useState<OrderType>(); //TODO: Tomer - should be initialized to chosen order by ID


    const deleteRecipeFromOrder = (recipeName: string) => {
        /*        console.log(`remove name: ${recipeName}`);
                const index =
            .findIndex(recipe => recipe.name === recipeName);
                const newOrders = [...recipes];
                newOrders.splice(index, 1);
                console.log(newOrders);
                console.log('newOrders');
                setRecipes(newOrders);*/

    }

    function sendDataToBackend() {
        console.log(`Submit clicked`);
        //TODO: Tomer integrate create new order
    }

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
    useEffect(() => {
        console.log(`order: ${order}`);
        //TODO: Tomer - all fields should have values from the order
        if (order) {
            setCustomerName(order.customer.name);
            setDueDate(dayjs(order.dueDate));
        }
    }, [order]);
    const fetchOrder = async () => {
        try {
            const payload = {seller_email: 'tomer@gmail.com', order_id: id};
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_order', {params: payload});
            const responseData = JSON.parse(response.data.body);
            const orderFiltered = responseData.map((orderData: any) => createOrderFromData(orderData));
            setOrder(orderFiltered[0]);
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
            console.log(responseData);
            const recipesArr = responseData.map((recipesData: any) => createRecipesArrFromData(recipesData));
            setMyRecipes(recipesArr);
            console.log(myRecipes);
            const recipeNames: string[] = responseData.map((recipe: {
                recipe_name: { S: string }
            }) => recipe.recipe_name.S);
            console.log(recipeNames);
            setRecipeNames(recipeNames);

        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    const createRecipesArrFromData = (orderData: any) => {
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
    function recipeExistInOrders(orderRecipes: any, quantity: string, ingredientsCost: string, totalCost: string) {
        const recipe = orderRecipes.find((recipe: any) => recipe.recipe_name.S === recipeName);
        //console.log(recipe);
        if (recipe) {
            console.log((Number(recipe.recipe_quantity.S) + Number(quantity)).toString());
            recipe.recipe_quantity.S = (Number(recipe.recipe_quantity.S) + Number(quantity)).toString();
            recipe.recipe_totalCost.S = (Number(recipe.recipe_totalCost.S) + Number(quantity) * Number(totalCost)).toString();
            console.log(`done`);
            return true;
        }
        console.log(`not exist`);
        return false;
    }
    const makeRecipe = (name: string, quantity: string, ingredientsCost: string, totalCost: string = (parseFloat(quantity) * parseFloat(ingredientsCost)).toString()): OrderRecipeItem => {
        return {
            recipe_name: {S: name},
            recipe_IngredientCost: {S: ingredientsCost},
            recipe_quantity: {S: quantity},
            recipe_totalCost: {S: totalCost},
        }
    }
    function addRecipeToOrder() {
        console.log(`addRecipe clicked`);
        const recipeExistInArray = recipeExistInOrders(orderRecipes, quantity, ingredientsCost, minCost);
        if (!recipeExistInArray) {
            console.log(`went inside not exist`);
            setOrderRecipes([...orderRecipes, makeRecipe(recipeName, quantity, ingredientsCost, minCost)]); //TODO  if the recipe doesnt exist it create a new item
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
                <DatePicker setValueDelegate={setDateFromPicker} initValue={dueDate.toISOString().split('T')[0]}/>
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
                            {/*                            {
                                recipes.map((recipe:RecipeType) => {
                                    return <RecipeDelegate removeDelegate={deleteRecipeFromOrder} key={recipe.name} name={recipe.name} quantity={recipe.quantity.toString()} ingredientsCost={recipe.ingredientsCost.toString()} totalCost={recipe.totalCost.toString()}/>
                                })
                            }*/}
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
