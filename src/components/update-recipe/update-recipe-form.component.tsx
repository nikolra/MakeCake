import React, {useState} from 'react';
import '../../App.css';
import './update-recipe-form.style.css';
import OutlinedInputField from "../outlinedd-input-field/input-field.component";
import {makeIngredient} from "../create-new-recipe/dev-data";
import IngredientDelegate from "../create-new-recipe/ingredient-delegate/ingredient-delegate.component";
import {devRecipes} from "../recipes/dev-data"
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {toast, ToastContainer} from "react-toastify";

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
    //TODO: Tomer - get all recipe data by id

    const arr: any[] = []; //TODO: Amit - delete this after integration
    const [myIngredients, setMyIngredients] = useState(arr); //TODO: Amit - should be initialized to all ingredients name on page load


    const [ingredients, setIngredients] = useState(recipe.ingredients);
    const [recipeCost, setRecipeCost] = useState(recipe.avgCost);
    const [recipeName, setRecipeName] = useState(recipe.name);

    const [ingredientName, setIngredientName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [minCost, setMinCost] = useState('');
    const [avgCost, setAvgCost] = useState('');
    const [maxCost, setMaxCost] = useState('');

    function sendDataToBackend() {
        console.log(`Submit clicked`);
        if(ingredients.length === 0 || !ingredients)
            toast.error(`Please add at least one ingredient`);
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
        if(ingredientName === "" || !ingredientName)
            toast.error(`Please choose ingredient`);
        else if(quantity === 0 || !ingredientName)
            toast.error(`Please choose quantity greater that 0`);
        else {
            console.log(`addIngredient clicked`);
            console.log(`name: ${ingredientName}`);
            console.log(`quantity: ${quantity}`);
            console.log(`cost: ${minCost}`);
            console.log(`cost: ${avgCost}`);
            console.log(`cost: ${maxCost}`);
            setIngredients([...ingredients, makeIngredient(ingredientName, quantity, avgCost)]);
            setIngredientName('');
            setMaxCost("");
            setQuantity(0);
            setMinCost("");
            setAvgCost('');
        }
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
                            <Autocomplete
                                disablePortal
                                id="comcbo-box-demo"
                                value={ingredientName}
                                onChange={(event: any, newValue: string | null) => {
                                    if(newValue)
                                        setIngredientName(newValue);
                                    else setIngredientName("");

                                }}
                                options={myIngredients}
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
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {setMinCost(e.target.value)}}
                            >
                                <TextField disabled={true} id="standard-basic" label={'Min Cost'} variant="standard" value={minCost}/>
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {setAvgCost(e.target.value)}}
                            >
                                <TextField disabled={true} id="standard-basic" label={'Avg Cost'} variant="standard" value={avgCost}/>
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {setMaxCost(e.target.value)}}
                            >
                                <TextField disabled={true} id="standard-basic" label={'Max Cost'} variant="standard" value={maxCost}/>
                            </Box>
                        </div>
                        <div className="recipes-list">
                            {
                                ingredients.map((ingredient:IIngredient) => {
                                    return <IngredientDelegate removeDelegate={removeIngredient} key={ingredient.name} name={ingredient.name} quantity={ingredient.quantity.toString()} cost={ingredient.avgCost.toString()}/>
                                })
                            }
                        </div>
                    </div>
                    <button className='add-ingredient-to-recipe-button button-container button-text add-item-button' onClick={addIngredient}>Add</button>
                </div>

            </div>

            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Update</button>
            </div>
            <ToastContainer/>
        </div>
    )
}
