import React, {SetStateAction,useEffect,useState} from 'react';
import '../../App.css';
import './update-order-form.style.css';
import {makeRecipe} from "../create-new-order/dev-data";
import RecipeDelegate from "../create-new-order/recipe-delegate/recipe-delegate.component";
import DatePicker from "../date-picker/date-picker.component";
import ComboBox from "../combo-box/combo-box.component";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axios from "axios";
import dayjs from "dayjs";

interface IProps {
    id: string;
}

const devRecipes:{
    name: string,
    quantity: number,
    ingredientsCost: number,
    totalCost: string
}[] = [];

type IngredientType = {
    id: string;
    name: string;
    minCost: number;
    avgCost: number;
    maxCost: number;
    ingredient_quantity: number;
};

type RecipeType = {
    recipe_id: string;
    recipe_name: string;
    recipe_price:number
    ingredients: IngredientType[];
    recipe_ingredients_cost: number;
};

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

export default function EditOrderForm({id} : IProps) {

    //TODO: Tomer - all initial values should be according to the chose order
    const [order,setOrder] = useState<OrderType>();
    const [recipes, setRecipes] = useState<RecipeType[]>([]); //TODO: Tomer - should be order.recipes
    const [customerName, setCustomerName] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [myRecipes,setMyRecipes]=useState<RecipeType[]>(); //TODO: Tomer - should be initializes to all recipes names for the user that is currently logged in
    const [myRecipesNames,setRecipeNames] = useState<string[]>([]); //TODO: Tomer - should be initializes to all recipes names for the user that is currently logged in
    const [recipeName, setRecipeName] = useState("");
    const [quantity, setQuantity] = useState('');
    const [ingredientsCost, setIngredientsCost] = useState('');//TODO: Tomer - should we have all 3 prices?
    const [totalCost, setTotalCost] = useState('');
    const options1 = ["Nikol", "Eden", "Amit", "Tomer"];  //TODO: Eden - remove after integration
    const [myCustomers,setCustomers]=useState(options1); //TODO: Eden - should be initializes to all customer names for the user that is currently logged in. (Consider saving change customer name to customer email)


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
    useEffect(()=>{fetchUserRecipes();},[recipes]);
    useEffect(()=>{fetchOrder(); },[]);
    useEffect(()=>{console.log(myRecipesNames);},[myRecipesNames]);
    useEffect(()=>{console.log(myRecipes);},[myRecipes]);
    useEffect(() => {if(order) {setCustomerName(order.customer.name);setDueDate(order.dueDate);} }, [order]);
    const fetchOrder = async () => {
        try {
            const payload = {seller_email: 'tomer@gmail.com',order_id: id};
            const response =  await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_order', {params:payload});
            const responseData = JSON.parse(response.data.body);
            const orderFiltered= responseData.map((orderData:any)=>createOrderFromData(orderData));
            setOrder(orderFiltered[0]);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };


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
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_user_recipes', {params:payload});
            const responseData = JSON.parse(response.data.body);
            console.log(responseData);
            const recipesArr = responseData.map((recipesData:any)=>createRecipesArrFromData(recipesData));
            setMyRecipes(recipesArr);
            console.log(myRecipes);
            const recipeNames: string[] = responseData.map((recipe: { recipe_name: { S: string } }) => recipe.recipe_name.S);
            console.log(recipeNames);
            setRecipeNames(recipeNames);

        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    const createRecipesArrFromData = (orderData: any) => {
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
            const customer = {id: orderData.order_id.S, name: orderData.buyer_email.S};
            return {
                id: orderData.order_id.S,
                dueDate: orderDate,
                customer: customer,
                recipes: orderRecipes,
                totalCost: orderCost
            };
    };
   function addRecipeToOrder() {
        console.log(`addRecipe clicked`);
        console.log(myRecipes);
        if(myRecipes) {
            const recipe = myRecipes.find((recipe) => recipe.recipe_name === recipeName)
            console.log(recipe);
        }
/*       const createRecipeFromData = (recipeData: any) => {
           const recipeName = recipeData.M.recipe_name.S;
           const recipePrice = recipeData.M.recipe_price.S;
           const recipeQuantity = recipeData.M.recipe_quantity.S;
           //orderCost+= parseInt(recipePrice)*parseInt(recipeQuantity);
           return { id: '', name: recipeName, total: recipePrice, quantity: recipeQuantity };
       };*/

        /*console.log(`name: ${recipeName}`);
        console.log(`quantity: ${quantity}`);
        console.log(`ingredientsCost: ${ingredientsCost}`);
        console.log(`totalCost: ${totalCost}`);
        setRecipes([...recipes,makeRecipe(recipeName, quantity, ingredientsCost, totalCost)]);
        setRecipeName('');
        setQuantity('');
        setIngredientsCost('');
        setTotalCost('');*/
    }
    function setDateFromPicker(value: any) {
        setDueDate(value);
    }

    return (
        <div className="dashboard-widget-container new-order-widget all-orders-container inputs-container">
            <div className="input-fields">
                <div className={"new-order-customer-name"}>
                    <ComboBox setValueDelegate={setCustomerName} label="Customer Name" options={[]} isDisabled={true} initialValue={customerName}/>
                </div>
                <DatePicker setValueDelegate={setDateFromPicker} initValue={dueDate}/>
            </div>

            <div className="orders">
                <div className="recipes-header-title-row">
                    <div className="orders-header-text">
                        <span className="widget-title-text">Recipes</span>
                        <span className="widget-title-text-secondary"> </span>
                    </div>
                </div>

                <div className="recipes-widget">
                    <div className="recipes-header-recipes-list-title">
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
                        <div className="recipes-input">

                            <Autocomplete
                                disablePortal
                                value={recipeName}
                                id="comcbo-box-demo"
                                onChange={(event: any, newValue: string | null) => {
                                    console.log(`New Value: ${newValue}`);
                                    if(newValue)
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
                    <button className='add-recipe-to-order-button' onClick={addRecipeToOrder}>Add recipe</button> {/*TODO: when clicked should init the recipe input line*/}
                </div>

            </div>

            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Update</button>
            </div>
        </div>
    )
}
