import React, {useState} from 'react';
import '../../App.css';
import './create-new-recipe-form.style.css';
import InputField from "../standart-input-field/input-field.component";
import OutlinedInputField from "../outlinedd-input-field/input-field.component";
import IngredientDelegate from "./ingredient-delegate/ingredient-delegate.component";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export default function NewRecipeForm() {

    type IngredientType = {
         code: string,
         name: string,
         cost: string
         quantity: string,
         automated: boolean,
     };


    const IMakeIngredient = (name:string, quantity:string, cost:string,automated:string='1',code:string='0') => {
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
    const [minCost, setMinCost] = useState('');
    const [avgCost, setAvgCost] = useState('');
    const [maxCost, setMaxCost] = useState('');

    const navigate = useNavigate();

    async function sendDataToBackend() {
        console.log(`Submit clicked`);
        try {
            const recipeData = {
                user_identifier: "tomer@gmail.com",
                recipe_name: recipeName,
                recipe_price: '50',
                ingredients: ingredients.map((ingredient: IngredientType) => {
                    return {
                        ingredient_code: ingredient.code,
                        ingredient_name: ingredient.name,
                        ingredient_price: ingredient.cost,
                        ingredient_quantity: ingredient.quantity,
                        is_automated_ingredient: ingredient.automated
                    }
                })
            };
            toast.promise(async () => {
                console.log(recipeData);
                console.log(recipeData);
                const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/new_recipe', recipeData);
                navigate('/recipes');
                console.log(response.data.body);
                console.log('recipe created');
            }, {
                pending: 'Loading',
                success: `Created order `,
                error: `Error creating order`
            });
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
        console.log(`cost: ${minCost}`);
        console.log(`cost: ${avgCost}`);
        console.log(`cost: ${maxCost}`);
        setIngredients([...ingredients,IMakeIngredient(ingredientName, quantity, avgCost)]);
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
                    <div className="new-recipe-ingredients-header-ingredients-list-title">
                        <div className="new-recipe-ingredients-header-list-title">
                            <span>Name</span>
                        </div>
                        <div className="new-recipe-ingredients-header-list-title">
                            <span>Quantity</span>
                        </div>
                        <div className="new-recipe-ingredients-header-list-title">
                            <span>Min Cost</span>
                        </div>
                        <div className="new-recipe-ingredients-header-list-title">
                            <span>Avg Cost</span>
                        </div>
                        <div className="new-recipe-ingredients-header-list-title">
                            <span>Max Cost</span>
                        </div>
                    </div>

                    <div className="new-recipe-ingredients-list-container">
                        <div className="new-recipe-ingredients-input ">
                                <InputField placeholder='Name' onChange={(e: any) => {setIngredientName(e.target.value)}}/>
                                <InputField placeholder='Quantity' onChange={(e: any) => {setQuantity(e.target.value)}}/>
                                <InputField placeholder='Min Cost' onChange={(e: any) => {setMinCost(e.target.value)}} disabled={true}/>
                                <InputField placeholder='Avg Cost' onChange={(e: any) => {setAvgCost(e.target.value)}} disabled={true}/>
                                <InputField placeholder='Max Cost' onChange={(e: any) => {setMaxCost(e.target.value)}} disabled={true}/>
                        </div>
                        <div className="recipes-list">
                            {
                                ingredients.map((ingredient) => {
                                    return <IngredientDelegate removeDelegate={removeIngredient} key={ingredient.name} name={ingredient.name} quantity={ingredient.quantity.toString()} cost={ingredient.cost.toString()}/>
                                })
                            }
                        </div>
                    </div>
                    <button className='button-container button-text add-item-button add-ingredient-to-recipe-button' onClick={addIngredient}>Add Ingredient</button>
                </div>

            </div>

            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Create</button>
            </div>
        </div>
    )
}
