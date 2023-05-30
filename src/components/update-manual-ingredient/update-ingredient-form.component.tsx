import React, {useState} from 'react';
import '../../App.css';
import './update-ingredient-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import NumericInputField from "../numeric-input-field/input-field.component";
import {devIngredients} from "../ingredients/dev-data";
import {useNavigate} from "react-router-dom";

interface IProps {
    id: string
}

export default function UpdateIngredientForm({id}: IProps) {

    //TODO: Amit - should receive real data from DB
    const ingredient = devIngredients.find(ingredient => ingredient.id === id) || devIngredients[0];
    const [ingredientName, setIngredientName] = useState(ingredient.name);
    const [minPrice, setMinPrice] = useState(ingredient.minCost.price);
    const [maxPrice, setMaxPrice] = useState(ingredient.maxCost.price);
    const [minPriceStore, setMinPriceStore] = useState(ingredient.minCost.supermarketName);
    const [maxPriceStore, setMaxPriceStore] = useState(ingredient.minCost.supermarketName);
    const [code, setCode] = useState(ingredient.id);
    const navigate = useNavigate();

    async function sendDataToBackend() {
        console.log(`Submit clicked`);
        navigate('/ingredients');
        //TODO: Amit integrate update manual ingredient
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
                    <InputField setValueDelegate={setIngredientName} label="Ingredient Name" width={290} value={ingredientName}/>
                    <InputField setValueDelegate={setCode} label="Ingredient Code" width={195} value={code}/>
                </div>

                <div className="ingredient-input-field ingredient-multiple-input-fields-line">
                    <InputField setValueDelegate={setMaxPriceStore} label="Store Name" width={290} value={maxPriceStore}/>
                    <NumericInputField setValueDelegate={setMaxPrice} label="Highest Price" value={maxPrice}/>
                </div>
                <div className="ingredient-input-field ingredient-multiple-input-fields-line">
                    <InputField setValueDelegate={setMinPriceStore} label="Store Name" width={290} value={minPriceStore}/>
                    <NumericInputField setValueDelegate={setMinPrice} label="Lowest Price" value={minPrice}/>
                </div>
            </div>

            <div className="submit-button-container ingredient-create-button">
                <button className='create-ingredient-button button button-gradient' onClick={sendDataToBackend}>Create
                </button>
            </div>
        </div>
    )
}
