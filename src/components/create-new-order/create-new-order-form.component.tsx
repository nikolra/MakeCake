import React, {useState} from 'react';
import '../../App.css';
import './create-new-order-form.style.css';
import InputField from "../standart-input-field/input-field.component";
import {devRecipes, makeRecipe} from "./dev-data";
import RecipeDelegate from "./recipe-delegate/recipe-delegate.component";
import DatePicker from "../date-picker/date-picker.component";
import ComboBox from "../combo-box/combo-box.component";


export default function NewOrderForm() {

    const [recipes, setRecipes] = useState(devRecipes)
    const [customerName, setCustomerName] = useState();
    const [recipeName, setRecipeName] = useState();
    const [dueDate, setDueDate] = useState();
    const [quantity, setQuantity] = useState();

    const [ingredientsCost, setIngredientsCost] = useState();
    const [totalCost, setTotalCost] = useState();

    function sendDataToBackend() {
        console.log(`Submit clicked`);
    }

    function addRecipe() {
        console.log(`addRecipe clicked`);
        console.log(`name: ${recipeName}`);
        console.log(`quantity: ${quantity}`);
        console.log(`ingredientsCost: ${ingredientsCost}`);
        console.log(`totalCost: ${totalCost}`);
        setRecipes([...recipes,makeRecipe(recipeName, quantity, ingredientsCost, totalCost)]);
    }

    function setDateFromPicker(value: any) {
        setDueDate(value);
        //TODO: implement integration with backend
    }
    return (
        <div className="dashboard-widget-container new-order-widget all-orders-container inputs-container">
            <div className="input-fields">
                <ComboBox setValueDelegate={setCustomerName} label="Customer Name"/>
                <DatePicker setValueDelegate={setDateFromPicker}/>
            </div>

            <div className="orders">
                <div className="recipes-header-title-row">
                    <div className="orders-header-text">
                        <span className="widget-title-text">Recipes</span>
                        <span className="widget-title-text-secondary"> </span>
                    </div>
                </div>

                <div className=" recipes-widget">
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
                                    return <RecipeDelegate key={recipe.name} name={recipe.name} quantity={recipe.quantity} ingredientsCost={recipe.ingredientsCost} totalCost={recipe.totalCost.toString()}/>
                                })
                            }
                        </div>
                    </div>
                    <button className='button-container button-text add-item-button' onClick={addRecipe}>Add recipe</button> {/*TODO: when clicked should init the recipe input line*/}
                </div>

            </div>

            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Create</button>
            </div>
        </div>
    )
}
