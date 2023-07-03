import React, {useState} from 'react';
import '../../App.css';
import './create-new-ingredient-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import NumericInputField from "../numeric-input-field/input-field.component";
import {useNavigate} from "react-router-dom";

export default function NewIngredientForm() {

    const [ingredientName, setIngredientName] = useState();
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [code, setCode] = useState();
    const [minPriceStore, setMinPriceStore] = useState();
    const [maxPriceStore, setMaxPriceStore] = useState();
    const navigate = useNavigate();

    async function sendDataToBackend() {
        console.log(`Submit clicked`);
        navigate('/ingredients');
        //TODO: Amit integrate create new ingredient (manual?)
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
                    <InputField setValueDelegate={setIngredientName} label="Ingredient Name" width={290} margin={'0 2vh 1vh 0'}/>
                    <InputField setValueDelegate={setCode} label="Ingredient Code" width={195}/>
                </div>

                <div className="ingredient-input-field">
                    <InputField setValueDelegate={setMaxPriceStore} label="Store Name" width={290} margin={'0 2vh 1vh 0'}/>
                    <NumericInputField setValueDelegate={setMaxPrice} label="Highest Price" width={195}/>
                </div>
                <div className="ingredient-input-field">
                    <InputField setValueDelegate={setMinPriceStore} label="Store Name" width={290} margin={'0 2vh 1vh 0'}/>
                    <NumericInputField setValueDelegate={setMinPrice} label="Lowest Price" width={195}/>
                </div>
            </div>
            <div className="new-ingredient-create-button">
                <button className='create-ingredient-button button button-gradient' onClick={sendDataToBackend}>Create
                </button>
            </div>
        </div>
    )
}
