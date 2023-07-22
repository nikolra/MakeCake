import React, {SetStateAction,useEffect,useState} from 'react';
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

interface OrderRecipeItem
{
    recipe_name:{ S: string };
    recipe_IngredientCost:{ S: string };
    recipe_quantity:{ S: string };
    recipe_totalCost:{ S: string }
}



export default function EditOrderForm({id} : IProps) {

    //TODO: Tomer - all initial values should be according to the chose order
    //const [order,setOrder] = useState<OrderType>();
    const [orderRecipes, setOrderRecipes] = useState<OrderRecipeItem[]>([]); //TODO: Tomer - should be order.recipes
    const [order_id,setOrderId]=useState();
    const [customerName, setCustomerName] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [myRecipes,setMyRecipes]=useState<RecipeItem[]>(); //TODO: Tomer - should be initializes to all recipes names for the user that is currently logged in
    const [myRecipesNames,setRecipeNames] = useState<string[]>([]); //TODO: Tomer - should be initializes to all recipes names for the user that is currently logged in
    const [recipeName, setRecipeName] = useState("");
    const [quantity, setQuantity] = useState('');
    const [ingredientsCost, setIngredientsCost] = useState('');//TODO: Tomer - should we have all 3 prices?
    const [totalCost, setTotalCost] = useState('');
    const options1 = ["Nikol", "Eden", "Amit", "Tomer"];  //TODO: Eden - remove after integration
    const [orderPrice,setOrderPrice]=useState(0);
    const [myCustomers,setCustomers]=useState(options1); //TODO: Eden - should be initializes to all customer names for the user that is currently logged in. (Consider saving change customer name to customer email)
    const navigate = useNavigate();


    useEffect(()=>{console.log(orderPrice);},[orderPrice]);
    const deleteRecipeFromOrder = (recipeName: string) => {
        const index = orderRecipes.findIndex(recipe => recipe.recipe_name.S === recipeName);
        const newOrders = [...orderRecipes];
        addToOrderPrice(-Number(orderRecipes[index].recipe_totalCost.S));
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
        const newTotalCost = Number(quantity) * Number(ingredientsCost);
        if (!isNaN(newTotalCost)) {
            setTotalCost(newTotalCost.toString());
        }
    }, [quantity, ingredientsCost]); //TODO this calculate the Total Cost
    useEffect(()=>{
        if(myRecipes)
        {
            const recipe = myRecipes.find((recipe)  => recipe.recipe_name.toString() === recipeName);
            if (recipe) {
                setIngredientsCost(recipe.recipe_ingredients_cost.toString());
                setQuantity('1');
                setTotalCost(ingredientsCost.toString());
            }
        }
    },[recipeName]); //TODO this is taking the recipe name and return the data of this recipe so we can send it back to the DB
    const fetchOrder = async () => {
        try {
            const payload = {seller_email: 'tomer@gmail.com',order_id: id};
            const response =  await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_order', {params:payload});
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



    const fetchUserRecipes = async () => {
        try {
            const payload = {user_email: 'tomer@gmail.com'};
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_user_recipes', {params:payload});
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

    const makeRecipe = (name:string, quantity:string, ingredientsCost:string, totalCost:string = (parseFloat(quantity) * parseFloat(ingredientsCost)).toString()): OrderRecipeItem => {
        addToOrderPrice(Number(quantity)*Number(ingredientsCost));
        return {
            recipe_name: { S: name },
            recipe_IngredientCost: { S: ingredientsCost },
            recipe_quantity: { S: quantity },
            recipe_totalCost: { S: totalCost },
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
            setOrderRecipes([...orderRecipes, makeRecipe(recipeName, quantity, ingredientsCost, totalCost)]); //TODO  if the recipe doesnt exist it create a new item
        }
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
                            {
                                orderRecipes.map((recipe) => {
                                    return <RecipeDelegate removeDelegate={deleteRecipeFromOrder} key={recipe.recipe_name.S}
                                                           name={recipe.recipe_name.S} quantity={recipe.recipe_quantity.S.toString()}
                                                           ingredientsCost={recipe.recipe_IngredientCost.S}
                                                           totalCost={recipe.recipe_totalCost.S}/>
                                })
                            }
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
