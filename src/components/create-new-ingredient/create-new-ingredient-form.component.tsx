import React, {useState} from 'react';
import '../../App.css';
import './create-new-ingredient-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import NumericInputField from "../numeric-input-field/input-field.component";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";

export default function NewIngredientForm() {

    const [ingredientName, setIngredientName] = useState();
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [code, setCode] = useState();
    const [minPriceStore, setMinPriceStore] = useState();
    const [maxPriceStore, setMaxPriceStore] = useState();
    const navigate = useNavigate();


    async function sendDataToBackend() {
        console.log(`Submit clicked`);
        navigate('/ingredients');
        if (Cookies.get('makecake-token') == null){
            navigate('/login');
        }
        try {
            const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_user', {accessToken: Cookies.get('makecake-token')});
            const responseBodyJSON = JSON.parse(response.data.body);
            const user_email = responseBodyJSON.email;

            let calc_avg_price = (minPrice + maxPrice) / 2.0;
            const body = {
                "code": code,
                "name": ingredientName,
                "price": calc_avg_price,
                "user_email": user_email
            }
            try {
                const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/create_new_mnl_ingredient', body);
            }
            catch (error) {
                console.error(`Error adding: ${ingredientName}`, error);
            }
        }
        catch (error) {
            console.error(`Error getting user email`, error);
        }
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
