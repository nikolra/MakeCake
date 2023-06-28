import React, {useState} from 'react';
import '../../App.css';
import './create-new-recipe-form.style.css';
import InputField from "../standart-input-field/input-field.component";
import OutlinedInputField from "../outlinedd-input-field/input-field.component";
//import {devIngredients, makeIngredient} from "./dev-data";
import IngredientDelegate from "./ingredient-delegate/ingredient-delegate.component";
import axios from 'axios';

export default function NewRecipeForm() {

    type IngredientType = {
         code: string,
         name: string,
         cost: string
         quantity: string,
         automated: boolean,
     };


    const ImakeIngredient = (name:string, quantity:string, cost:string,automated:string="true",code:string='0') => {
        return {
            code: code,
            name: name,
            cost: quantity,
            quantity: quantity,
            automated: automated
        }
    }

    const [ingredients, setIngredients] = useState<Array<{ code: any, name: any, cost: any,quantity: any, automated: any }>>([]);
    const [recipeCost, setRecipeCost] = useState();

    const [ingredientName, setIngredientName] = useState('');
    const [recipeName, setRecipeName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [cost, setCost] = useState('');

    async function sendDataToBackend() {
        console.log(`Submit clicked`);

        try{
            const recipeData = {
                user_identifier: "tomer@gmail.com",
                recipe_name: recipeName,
                recipe_price: '50',
                ingredients: ingredients.map((ingredient: IngredientType) => {
                    return {
                        ingredient_code: ingredient.code.toString(),
                        ingredient_name: ingredient.name.toString(),
                        ingredient_price: ingredient.cost.toString(),
                        ingredient_quantity: ingredient.quantity.toString(),
                        is_automated_ingredient:ingredient.automated.toString()
                    }
                })
            };
            //console.log(recipeData);
            //console.log('before response');
            console.log(recipeData);
            const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/new_recipe', recipeData);
            console.log(response.data.body);
            console.log('recipe created');
        }
        catch(error)
        {
            return error;
        }

    }

    async function removeIngredient(name: string) {
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
        setIngredients([...ingredients,ImakeIngredient(ingredientName, quantity, cost)]);
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
                                <InputField placeholder='Ingredients Cost' onChange={(e: any) => {setCost(e.target.value)}}/>{/*TODO: should not be editable and cost comes from ingredients data*/}
                        </div>
                        <div className="recipes-list">
                            {
                                ingredients.map((ingredient) => {
                                    return <IngredientDelegate removeDelegate={removeIngredient} key={ingredient.name} name={ingredient.name} quantity={ingredient.quantity.toString()} cost={ingredient.cost.toString()}/>
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
