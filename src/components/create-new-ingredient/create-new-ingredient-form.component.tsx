import React, {useState} from 'react';
import '../../App.css';
import './create-new-ingredient-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import NumericInputField from "../numeric-input-field/input-field.component";
import axios from "axios";

export default function NewIngredientForm() {
//TODO: avgCost
    const [ingredientName, setIngredientName] = useState();
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [code, setCode] = useState();

    async function sendDataToBackend() {
        await axios.post("https://fvr4qwfb9a.execute-api.us-east-1.amazonaws.com/prod/ingredients/add",
            {
                name: ingredientName,
                minPrice: minPrice,
                maxPrice: maxPrice,
                code: code
            }
        );
        console.log(`Submit clicked`);
        //TODO: should calculate avg price??
    }

    return (
            <div className="dashboard-widget-container new-ingredient-widget-container">
                <div className="new-ingredients-header-title-row">
                    <div className="new-ingredients-header-text">
                        <span className="widget-title-text">New Ingredient</span>
                        <span className="widget-title-text-secondary"> </span>
                    </div>
                </div>
                <div className="new-ingredient-input-fields">
                    <div className="ingredient-input-field">
                        <InputField setValueDelegate={setIngredientName} label="Ingredient Name" width={290}/>
                        <InputField setValueDelegate={setCode} label="Ingredient Code" width={195}/>
                    </div>

                    <div className="ingredient-input-field ingredient-multiple-input-fields-line">
                    <InputField setValueDelegate={setIngredientName} label="Store Name" width={290}/>
                    <NumericInputField setValueDelegate={setMaxPrice} label="Highest Price"/>
                </div>
                <div className="ingredient-input-field ingredient-multiple-input-fields-line">
                    <InputField setValueDelegate={setIngredientName} label="Store Name" width={290}/>
                    <NumericInputField setValueDelegate={setMinPrice} label="Lowest Price"/>
                </div>
            </div>
            <div className="submit-button-container ingredient-create-button">
                <button className='create-ingredient-button button button-gradient' onClick={sendDataToBackend}>Create
                </button>
            </div>
        </div>
    )
}
