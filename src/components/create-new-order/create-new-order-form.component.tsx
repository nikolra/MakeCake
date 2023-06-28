import React, {useState} from 'react';
import '../../App.css';
import './create-new-order-form.style.css';
import InputField from "../standart-input-field/input-field.component";
import {makeRecipe} from "./dev-data";
import RecipeDelegate from "./recipe-delegate/recipe-delegate.component";
import DatePicker from "../date-picker/date-picker.component";
import ComboBox from "../combo-box/combo-box.component";
import dayjs from 'dayjs';
import axios from "axios";


export default function NewOrderForm() {

    type RecipeType = {
        name: string;
        quantity: number;
        ingredientsCost: number;
        totalCost: number;
    };

    const [recipes, setRecipes] = useState<Array<{ name: string, quantity: number, ingredientsCost: number, totalCost: number }>>([]);
    const [customerName, setCustomerName] = useState('yankale@gmail.com');///TODO eden need to do a getter that will return all the customers seller has
    const [recipeName, setRecipeName] = useState("");
    const [dueDate, setDueDate] = useState(dayjs());
    const [quantity, setQuantity] = useState(0);
    const [ingredientsCost, setIngredientsCost] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    //const [myRecipes,setAllMyRecipes] = useState(<Array<{}>>([]));

    async function sendDataToBackend() {
        console.log(`Submit clicked`);
        try{
            const orderData = {
                seller_email: "tomer@gmail.com",
                buyer_email: customerName,
                order: recipes.map((recipe: RecipeType) => {
                    return {
                        recipe_name: recipe.name,
                        recipe_price: recipe.ingredientsCost.toString(),
                        recipe_quantity: recipe.quantity.toString()
                    }
                })
            };
            //console.log('before response');
            //console.log(orderData);
            const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/new_order', orderData);
            const apiData = JSON.parse(response.data);
            console.log(response);
            console.log('after response');
        }
        catch(error)
        {
            return error;
        }
    }

    function addRecipeToOrder() {
        setRecipes([...recipes, makeRecipe(recipeName, quantity, ingredientsCost, totalCost)]);
        setRecipeName("");
        setQuantity(0);
        setIngredientsCost(0);
        setTotalCost(0);
        //console.log(recipes);
    }

    function setDateFromPicker(value: any) {
        setDueDate(value);
    }
    return (
        <div className="dashboard-widget-container new-order-widget all-orders-container inputs-container">
            <div className="input-fields">
                <div className={"new-order-customer-name"}>
                    <ComboBox setValueDelegate={setCustomerName} label="Customer Name"/>
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
                        <div className="recipes-input ">
                                <InputField placeholder='Name' onChange={(e: any) => {setRecipeName(e.target.value)}}/>{/* TODO: change to drop down with typing*/}
                                <InputField placeholder='Quantity' onChange={(e: any) => {setQuantity(e.target.value)}}/>{/* TODO: Should be an Int. should be inserted only after recipe is chosen*/}
                                <InputField placeholder='Ingredients Cost' onChange={(e: any) => {setIngredientsCost(e.target.value)}}/>{/* TODO: should be taken from the recipe*/}
                                <InputField placeholder='Total Cost' onChange={(e: any) => {setTotalCost(e.target.value)}}/>{/* TODO: should be calculated automatically when quantity inserted*/}
                        </div>
                        <div className="orders-list">
                            {
                                recipes.map((recipe) => {
                                    return <RecipeDelegate key={recipe.name} name={recipe.name} quantity={recipe.quantity.toString()} ingredientsCost={recipe.ingredientsCost.toString()} totalCost={recipe.totalCost.toString()}/>
                                })
                            }
                        </div>
                    </div>
                    <button className='button-container button-text add-item-button' onClick={addRecipeToOrder}>Add recipe</button> {/*TODO: when clicked should init the recipe input line*/}
                </div>

            </div>

            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Create</button>
            </div>
        </div>
    )
}
