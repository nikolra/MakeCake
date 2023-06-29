import React, {useState} from 'react';
import '../../App.css';
import './update-recipe-form.style.css';
import InputField from "../standart-input-field/input-field.component";
import OutlinedInputField from "../outlinedd-input-field/input-field.component";
import {makeIngredient} from "../create-new-recipe/dev-data";
import IngredientDelegate from "../create-new-recipe/ingredient-delegate/ingredient-delegate.component";
import {devRecipes} from "../recipes/dev-data"

interface IRecipeProps {
    id: string
}

interface ICost {
    price: number,
    supermarketName: string
}

interface IIngredient {
    id: string,
    name: string,
    quantity: number,
    avgCost: number
    minCost: ICost,
    maxCost: ICost
}

export default function EditRecipeForm( {id}: IRecipeProps) {

    //TODO: Tomer - should get the recipe to edit from DB and not from devRecipes
    const recipe = devRecipes.find(recipe => recipe.id === id) || devRecipes[0];
    //     {
    //     id: number,
    //     name: string,
    //     ingredients: IIngredient[],
    //     avgCost: number,
    // }
    //TODO: get all recipe data by id

    const [ingredients, setIngredients] = useState(recipe.ingredients);
    const [recipeCost, setRecipeCost] = useState(recipe.avgCost);
    const [recipeName, setRecipeName] = useState(recipe.name);

    const [ingredientName, setIngredientName] = useState();
    const [quantity, setQuantity] = useState();
    const [minCost, setMinCost] = useState('');
    const [avgCost, setAvgCost] = useState('');
    const [maxCost, setMaxCost] = useState('');

    function sendDataToBackend() {
        console.log(`Submit clicked`);
        //TODO: Tomer - implement integration with backend gor recipe update
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
        console.log(`cost: ${minCost}`);
        console.log(`cost: ${avgCost}`);
        console.log(`cost: ${maxCost}`);
        setIngredients([...ingredients,makeIngredient(ingredientName, quantity, avgCost)]);
    }

    return (
        <div className="dashboard-widget-container new-recipe-widget all-recipes-container inputs-container">
            <div className="new-recipe-input-fields">
                <div className={"new-recipe-ingredient-name"}>
                    <OutlinedInputField label='Recipe Name' setValueDelegate={setRecipeName} width={400} value={recipeName}/>
                </div>

                <div className={"new-recipe-ingredient-name"}>
                    <OutlinedInputField label='Recipe Cost' value={recipeCost.toString()} setValueDelegate={setRecipeCost} width={400}/>
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

                    <div className="ingredients-list-container">
                        <div className="ingredients-input ">
                                <InputField placeholder='Name' onChange={(e: any) => {setIngredientName(e.target.value)}}/>
                                <InputField placeholder='Quantity' onChange={(e: any) => {setQuantity(e.target.value)}}/>
                                <InputField placeholder='Min Cost' onChange={(e: any) => {setMinCost(e.target.value)}} disabled={true}/>
                                <InputField placeholder='Avg Cost' onChange={(e: any) => {setAvgCost(e.target.value)}} disabled={true}/>
                                <InputField placeholder='Max Cost' onChange={(e: any) => {setMaxCost(e.target.value)}} disabled={true}/>
                        </div>
                        <div className="recipes-list">
                            {
                                ingredients.map((ingredient:IIngredient) => {
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
