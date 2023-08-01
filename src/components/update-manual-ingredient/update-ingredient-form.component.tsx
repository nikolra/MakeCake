import React, {useEffect, useState} from 'react';
import '../../App.css';
import './update-ingredient-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import NumericInputField from "../numeric-input-field/input-field.component";
import {devIngredients} from "../ingredients/dev-data";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {toast} from "react-toastify";

interface IProps {
    id: string
}

interface IIngredientData{
    id: string,
    name: string,
    minCost: number,
    avgCost: number,
    maxCost: number,
    minCostStore: string,
    avgCostStore: string
}

export default function UpdateIngredientForm({id}: IProps) {

    //TODO: Amit - should receive real data from DB
    //const ingredient = devIngredients.find(ingredient => ingredient.id === id) || devIngredients[0];
    const [ingredientName, setIngredientName] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [minPriceStore, setMinPriceStore] = useState("");
    const [maxPriceStore, setMaxPriceStore] = useState("");
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const func = async () => {
            const ingredient = await fetchIngredient();
            console.log("99", ingredient);

            if (!ingredient) {
                toast.error('Error getting ingredient data');
                return;
            }
            else {
                console.log("11", ingredient);
                setIngredientName(ingredient.name);
                setMinPrice(ingredient.min_price);
                setMaxPrice(ingredient.max_store);
                setMinPriceStore(ingredient.min_price);
                setMaxPriceStore(ingredient.max_store);
                setCode(ingredient.code);
            }
        }
        func();
    }, []);

    const fetchIngredient = async () => {
        const body = {
            "table_name": "mnl_ingredients",
            "field_name": "code",
            "search_value": `${id}`
        }
        console.log(body);
        try {
            const response =
                await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_mnl_ingredients',
                    body,
                    {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: "Bearer " + Cookies.get('makecake-token')
                        }
                    });
            console.log(response);
            if(response.status === 200) {
                console.log(`Ingredient data received`);
                return response.data;
            }
            else {
                console.error(`Error updating: ${ingredientName}`, response);
            }
        }
        catch (error) {
            console.error(`Error updating: ${ingredientName}`, error);
        }
    }

    async function sendDataToBackend() {
        console.log(`Submit clicked`);
        const body = {
            "code": code,
            "new_name": ingredientName,
            "new_min_price": minPrice,
            "new_min_store": minPriceStore,
            "new_max_price": maxPrice,
            "new_new_max_store": maxPriceStore
        }
        try {
            const response =
                await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/edit_mnl_ingredient',
                    body,
                    {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: "Bearer " + Cookies.get('makecake-token')
                        }
                    });
            if(response.data.status == 200) {
                toast.success(`${ingredientName} Updated Successfully`);
                navigate('/ingredients');
            }
            else {
                console.error(`Error updating: ${ingredientName}`, response);
                toast.error(`Error updating: ${ingredientName}`);
            }
        }
        catch (error) {
            console.error(`Error updating: ${ingredientName}`, error);
            toast.error(`Error updating: ${ingredientName}`);
        }
    }

    return (
        <div className="dashboard-widget-container new-ingredient-widget-container">
            <div className="new-ingredients-header-title-row">
                <div className="new-ingredients-header-text">
                    <span className="widget-title-text">Edit Ingredient</span>
                    <span className="widget-title-text-secondary"> </span>
                </div>
            </div>
            <div className="update-ingredient-input-fields">
                <div className="ingredient-input-field">
                    <InputField setValueDelegate={setIngredientName} label="Ingredient Name" width={290} value={ingredientName} margin={'0 2vh 1vh 0'}/>
                    <InputField setValueDelegate={setCode} label="Ingredient Code" width={195} value={code} disabled={true}/>
                </div>

                <div className="ingredient-input-field">
                    <InputField setValueDelegate={setMaxPriceStore} label="Store Name" width={290} value={maxPriceStore} margin={'0 2vh 1vh 0'}/>
                    <NumericInputField setValueDelegate={setMaxPrice} label="Highest Price" width={195} value={maxPrice}/>
                </div>
                <div className="ingredient-input-field">
                    <InputField setValueDelegate={setMinPriceStore} label="Store Name" width={290} value={minPriceStore} margin={'0 2vh 1vh 0'}/>
                    <NumericInputField setValueDelegate={setMinPrice} label="Lowest Price" width={195} value={minPrice}/>
                </div>
            </div>

            <div className="submit-button-container ingredient-create-button">
                <button className='create-ingredient-button button button-gradient' onClick={sendDataToBackend}>Create
                </button>
            </div>
        </div>
    )
}
