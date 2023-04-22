import React, {useState} from 'react';
import '../../App.css';
import './create-new-recipe-form.style.css';
import InputField from "../standart-input-field/input-field.component";
import OutlinedInputField from "../outlinedd-input-field/input-field.component";
import {devIngredients, makeIngredient} from "./dev-data";
import IngredientDelegate from "./ingredient-delegate/ingredient-delegate.component";

export default function NewRecipeForm() {

    // const devIngredients:{
    //     name: string,
    //     quantity: number,
    //     cost: number,
    // }[] = [];

    const [ingredients, setIngredients] = useState(devIngredients);//TODO: initial value should be an empty array
    const [recipeCost, setRecipeCost] = useState();

    const [ingredientName, setIngredientName] = useState();
    const [recipeName, setRecipeName] = useState();
    const [quantity, setQuantity] = useState();
    const [cost, setCost] = useState();

    function sendDataToBackend() {
        console.log(`Submit clicked`);
        //TODO: implement integration with backend
    }

    function removeIngredient(name: string) {
        console.log(`remove name: ${name}`);
        const index = ingredients.findIndex(ingredient => ingredient.name === name);
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setIngredients(newIngredients);
    }

    function addIngredient() {
        console.log(`addIngredient clicked`);
        console.log(`name: ${ingredientName}`);
        console.log(`quantity: ${quantity}`);
        console.log(`cost: ${cost}`);
        setIngredients([...ingredients,makeIngredient(ingredientName, quantity, cost)]);
    }

    return (
        <div className="dashboard-widget-container new-recipe-widget all-recipes-container inputs-container">
            <div className="new-recipe-input-fields">
                <div className={"new-recipe-ingredient-name"}>
                    <OutlinedInputField label='Recipe Name' setValueDelegate={setRecipeName} width={400}/>
                </div>
                <div className={"new-recipe-ingredient-name"}>
                    <OutlinedInputField label='Recipe Cost' setValueDelegate={setRecipeCost} width={400}/>
                </div>
            </div>

            <div className="recipes">
                <div className="ingredients-header-title-row">
                    <div className="recipes-header-text">
                        <span className="widget-title-text">Ingredients</span>
                        <span className="widget-title-text-secondary"> </span>
                    </div>
                </div>

                <div className="ingredients-widget">
                    <div className="ingredients-header-ingredients-list-title">
                        <div className="ingredients-header-list-title">
                            <span>Name</span>
                        </div>
                        <div className="ingredients-header-list-title">
                            <span>Quantity</span>
                        </div>
                        <div className="ingredients-header-list-title">
                            <span>Cost</span>
                        </div>
                    </div>

                    <div className="ingredients-list-container">
                        <div className="ingredients-input ">
                                <InputField placeholder='Name' onChange={(e: any) => {setIngredientName(e.target.value)}}/>
                                <InputField placeholder='Quantity' onChange={(e: any) => {setQuantity(e.target.value)}}/>
                                <InputField placeholder='Ingredients Cost' onChange={(e: any) => {setCost(e.target.value)}}/>{/*TODO: should not be editable and cost comes from ingrediants data*/}
                        </div>
                        <div className="recipes-list">
                            {
                                ingredients.map((ingredient) => {
                                    return <IngredientDelegate removeDelegate={removeIngredient} key={ingredient.name} name={ingredient.name} quantity={ingredient.quantity.toString()} cost={ingredient.avgCost.toString()}/>
                                })
                            }
                        </div>
                    </div>
                    <button className='button-container button-text add-item-button' onClick={addIngredient}>Add Ingredient</button>
                </div>

            </div>

            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Create</button>
            </div>
        </div>
    )
}
