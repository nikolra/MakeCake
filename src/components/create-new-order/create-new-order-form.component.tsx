import React, {useEffect,useState} from 'react';
import '../../App.css';
import './create-new-order-form.style.css';
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

    interface OrderItem {
        seller_email: { S: string };
        buyer_email: { S: string };
        order_id: { S: string };
        due_date: { S: string };
        recipes: {  L: OrderRecipeItem[] }
    }


    type CustomerType = {
        name: string;
        email: string;
    };

    const options1 = [ //TODO: Eden - remove after integration
        "Nikol", "Eden", "Amit", "Tomer"
    ]



    const [customerName, setCustomerName] = useState('yankale@gmail.com');///TODO eden need to do a getter that will return all the customers seller has
    const [dueDate, setDueDate] = useState(dayjs());
    const [orderRecipes, setOrderRecipes] = useState<OrderRecipeItem[]>([]);

    const [recipeName, setRecipeName] = useState("");
    const [quantity, setQuantity] = useState('');
    const [ingredientsCost, setIngredientsCost] = useState('');//TODO: Tomer - should we have all 3 prices? no,Should be only avg cost
    const [totalCost, setTotalCost] = useState('');
    const [myRecipesNames,setRecipeNames] = useState<string[]>([]); //TODO: Tomer - should be initializes to all recipes names for the user that is currently logged in
    const [myCustomers, setCustomers] = useState(options1); //TODO: Eden - should be initializes to all customer names for the user that is currently logged in. (Consider saving change customer name to customer email)
    const [myRecipes, setMyRecipes] = useState<RecipeItem[]>([]);

    const navigate = useNavigate();

    useEffect(()=>{fetchUserRecipes();console.log(1);},[]);
    useEffect(()=>{
        if(myRecipes)
        {
            const recipe = myRecipes.find((recipe)  => recipe.recipe_name.toString() === recipeName);
                if (recipe) {
                    setIngredientsCost(recipe.recipe_ingredients_cost.toString());
                    setQuantity('1');
                    setTotalCost(ingredientsCost.toString());

                    //setTotalCost(parse)
                }
            }
        },[recipeName]); //TODO this is taking the recipe name and return the data of this recipe so we can send it back to the DB
    useEffect(() => {
        const newTotalCost = Number(quantity) * Number(ingredientsCost);
        if (!isNaN(newTotalCost)) {
            setTotalCost(newTotalCost.toString());
        }
    }, [quantity, ingredientsCost]); //TODO this calculate the Total Cost


    const deleteRecipeFromOrder = (recipeName: string) => {
/*        console.log(`remove name: ${recipeName}`);
        const index = orderRecipes.findIndex(recipe => recipe.name === recipeName);
        const newOrders = [...orderRecipes];
        newOrders.splice(index, 1);
        setOrderRecipes(newOrders);*/
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
            console.log(recipesArr);
            setMyRecipes(recipesArr);
            const recipeNames: string[] = responseData.map((recipe: { recipe_name: { S: string } }) => recipe.recipe_name.S);
            setRecipeNames(recipeNames);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const createRecipeFromData = (recipeData: any) => {
        const recipeName = recipeData.M.recipe_name.S;
        const recipePrice = recipeData.M.recipe_price.S;
        const recipeQuantity = recipeData.M.recipe_quantity.S;
       // orderCost+= parseInt(recipePrice)*parseInt(recipeQuantity);
        return { id: '', name: recipeName, total: recipePrice, quantity: recipeQuantity };
    };

    async function sendDataToBackend() {
        console.log(`Submit clicked`);

        const order_Id = generateNumericID();
        console.log(orderRecipes);
        try {
            console.log(order_Id);
            const orderData = {
                seller_email: "tomer@gmail.com",
                order_id: order_Id,
                buyer_email: customerName,
                due_date: dueDate,
                recipes: orderRecipes
            }
                console.log('before');
                const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/new_order', orderData);
                console.log(response);
                console.log('after');

            }
/*            };
            toast.promise(async () => {
                const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/new_order', orderData);
                console.log(response);
                navigate('/orders');
                //console.log(JSON.stringify(response));
            }, {
                pending: 'Loading',
                success: `Created order `,
                error: `Error creating order`
            });}*/
         catch (error) {
             console.log(error);
            return error;
        }
    }


    const makeRecipe = (name:string, quantity:string, ingredientsCost:string, totalCost:string = (parseFloat(quantity) * parseFloat(ingredientsCost)).toString()): OrderRecipeItem => {
        return {
            recipe_name: { S: name },
            recipe_IngredientCost: { S: ingredientsCost },
            recipe_quantity: { S: quantity },
            recipe_totalCost: { S: totalCost },
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
                            </Box>{/* TODO: Tomer - Should be an Int. should be inserted only after recipe is chosen    DONE*/}

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
                            </Box>{/*  TODO: Tomer -should be taken from the recipe   DONE*/}

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
                            </Box>{         }

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
                    <button className='add-recipe-to-order-button' onClick={addRecipeToOrder}>Add recipe</button>
                </div>

            </div>

            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Create</button>
            </div>
        </div>
    )
}
