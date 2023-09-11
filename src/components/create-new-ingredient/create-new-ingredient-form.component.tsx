import React, {useState} from 'react';
import '../../App.css';
import './create-new-ingredient-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import NumericInputField from "../numeric-input-field/input-field.component";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import {toast} from "react-toastify";
import {deleteToken} from "../../utils/TokenValidation";

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
        try {
            let codeRand = '';
            //if code is empty, generate random code
            if (code === undefined || code === null || code === '') {
                const randomNumber = Math.floor(Math.random() * 100000000);
                codeRand = randomNumber.toString().padStart(8, '0');
            }
            //if minPrice and maxPrice are empty, show error.
            if (minPrice === 0 && maxPrice === 0) {
                toast.error('Please fill at least one price field');
                return;
            }
            if (minPrice > maxPrice) {
                toast.error('Minimum price cannot be greater than maximum price');
                return;
            }
            if (minPriceStore === undefined && maxPriceStore === undefined) {
                toast.error('Please fill at least one store field');
                return;
            }
            if(ingredientName === undefined || ingredientName === null || ingredientName === '') {
                toast.error('Please fill ingredient name');
                return;
            }
            const body = {
                "code": code ? code : codeRand,
                "name": ingredientName,
                "min_price": minPrice === 0 ? maxPrice : minPrice,
                "min_store": minPriceStore === undefined ? maxPriceStore : minPriceStore,
                "max_price": maxPrice === 0 ? minPrice : maxPrice,
                "max_store": maxPriceStore === undefined ? minPriceStore : maxPriceStore
            }
            try {
                await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/create_new_mnl_ingredient',
                    body,
                    {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: "Bearer " + Cookies.get('makecake-token')
                        }
                    });
                toast.success(`${ingredientName} Added Successfully`);
                navigate('/ingredients');
            } catch (error) {
                console.error(`Error adding: ${ingredientName}`, error);
                toast.error(`Error adding: ${ingredientName}`);
            }
        } catch
            (error: any) {
            console.log(error);
            if (error.response.status === 401 || error.response.status === 403) {
                deleteToken();
                navigate('/');
                toast.error('Login expired please login again', {autoClose: 5000});
            } else {
                console.error('Error creating ingredient:', error);
                toast.error('Error creating ingredient, please try again later', {autoClose: 5000});
            }
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
                    <InputField setValueDelegate={setIngredientName} label="Ingredient Name" width={290}
                                margin={'0 2vh 1vh 0'}/>
                    <InputField setValueDelegate={setCode} label="Ingredient Code" width={195}/>
                </div>

                <div className="ingredient-input-field">
                    <InputField setValueDelegate={setMaxPriceStore} label="Store Name" width={290}
                                margin={'0 2vh 1vh 0'}/>
                    <NumericInputField setValueDelegate={setMaxPrice} label="Highest Price" width={195}/>
                </div>
                <div className="ingredient-input-field">
                    <InputField setValueDelegate={setMinPriceStore} label="Store Name" width={290}
                                margin={'0 2vh 1vh 0'}/>
                    <NumericInputField setValueDelegate={setMinPrice} label="Lowest Price" width={195}/>
                </div>
            </div>
            <div className="new-ingredient-create-button">
                <button className='create-ingredient-button button button-gradient'
                        onClick={sendDataToBackend}>Create
                </button>
            </div>
        </div>
    )
}
