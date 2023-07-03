import React, {useState} from 'react';
import '../../App.css';
import './update-order-form.style.css';
import {makeRecipe} from "../create-new-order/dev-data";
import RecipeDelegate from "../create-new-order/recipe-delegate/recipe-delegate.component";
import DatePicker from "../date-picker/date-picker.component";
import ComboBox from "../combo-box/combo-box.component";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

interface IProps {
    id: string;
}

const devRecipes:{
    name: string,
    quantity: number,
    ingredientsCost: number,
    totalCost: string
}[] = [];

export default function EditOrderForm({id} : IProps) {


    //TODO: tomer - implement get order by id
    const order = {};
    //TODO: Tomer - all initial values should be according to the chose order
    const [recipes, setRecipes] = useState(devRecipes); //TODO: Tomer - should be order.recipes
    const [customerName, setCustomerName] = useState(""); //TODO: Tomer - should be order.customerName
    const [dueDate, setDueDate] = useState(""); //TODO: Tomer - should be order.dueDate

    const [recipeName, setRecipeName] = useState("");
    const [quantity, setQuantity] = useState('');
    const [ingredientsCost, setIngredientsCost] = useState('');//TODO: Tomer - should we have all 3 prices?
    const [totalCost, setTotalCost] = useState('');

    const options1 = [ //TODO: Eden - remove after integration
        "Nikol", "Eden", "Amit", "Tomer"
    ]
    const [myCustomers,setCustomers]=useState(options1); //TODO: Eden - should be initializes to all customer names for the user that is currently logged in. (Consider saving change customer name to customer email)
    const [myRecipes,setMyRecipes]=useState(options1); //TODO: Tomer - should be initializes to all recipes names for the user that is currently logged in

    const deleteRecipeFromOrder = (recipeName: string) => {
        console.log(`remove name: ${recipeName}`);
        const index = recipes.findIndex(recipe => recipe.name === recipeName);
        const newOrders = [...recipes];
        newOrders.splice(index, 1);
        setRecipes(newOrders);
    }

    function sendDataToBackend() {
        console.log(`Submit clicked`);
        //TODO: Tomer integrate create new order
    }

    function addRecipeToOrder() {
        console.log(`addRecipe clicked`);
        console.log(`name: ${recipeName}`);
        console.log(`quantity: ${quantity}`);
        console.log(`ingredientsCost: ${ingredientsCost}`);
        console.log(`totalCost: ${totalCost}`);
        setRecipes([...recipes,makeRecipe(recipeName, quantity, ingredientsCost, totalCost)]);
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
                                    console.log(`New Value: ${newValue}`);
                                    if(newValue)
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
                                    '& > :not(style)': { m: 1, width: '25ch' },
                                }}
                                onChange={(e: any) => {setQuantity(e.target.value)}}
                            >
                                <TextField value={quantity} id="standard-basic" label={'Quantity'} variant="standard" />
                            </Box>{/* TODO: Tomer - Should be an Int. should be inserted only after recipe is chosen*/}
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': { m: 1, width: '25ch' },
                                }}
                                onChange={(e: any) => {setIngredientsCost(e.target.value)}}
                            >
                                <TextField value={ingredientsCost} id="standard-basic" label={'Ingredients Cost'} variant="standard" />
                            </Box>{/* TODO: Tomer - should be taken from the recipe*/}
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': { m: 1, width: '25ch' },
                                }}
                                onChange={(e: any) => {setTotalCost(e.target.value)}}
                            >
                                <TextField value={totalCost} id="standard-basic" label={'Total Cost'} variant="standard" />
                            </Box>{/* TODO: Tomer - should be calculated automatically when quantity inserted*/}
                        </div>
                        <div className="orders-list">
                            {
                                recipes.map((recipe) => {
                                    return <RecipeDelegate removeDelegate={deleteRecipeFromOrder} key={recipe.name} name={recipe.name} quantity={recipe.quantity.toString()} ingredientsCost={recipe.ingredientsCost.toString()} totalCost={recipe.totalCost.toString()}/>
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
