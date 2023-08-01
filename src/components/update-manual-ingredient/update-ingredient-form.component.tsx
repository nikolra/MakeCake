import React, {useEffect, useState} from 'react';
import '../../App.css';
import './update-ingredient-form.style.css';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {toast} from "react-toastify";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

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
                setMaxPrice(ingredient.max_price);
                setMinPriceStore(ingredient.min_store);
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
            "new_max_store": maxPriceStore
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
            if(response.status === 200) {
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
                    <Box
                        component="div"
                        sx={{
                            width: 290,
                            maxWidth: '100%',
                            m: '0 2vh 1vh 0'
                        }}
                    >
                        <TextField fullWidth id="outlined-basic" label={"Ingredient Name"} variant="outlined"value={ingredientName}
                                   onChange={(e: any) => {
                                       console.log(`Ingredient Name: ${e.target.value}`)
                                       setIngredientName(e.target.value)
                                   }}/>
                    </Box>
                    <Box
                        component="div"
                        sx={{
                            width: 195,
                            maxWidth: '100%',
                            m: '0 0 6px 0'
                        }}
                    >
                        <TextField disabled={true} fullWidth id="outlined-basic" label={"Ingredient Code"} variant="outlined" value={code}
                                   onChange={(e: any) => {
                                       console.log(`Ingredient Code: ${e.target.value}`)
                                       setCode(e.target.value)
                                   }}/>
                    </Box>
                </div>

                <div className="ingredient-input-field">
                    <Box
                        component="div"
                        sx={{
                            width: 290,
                            maxWidth: '100%',
                            m: '0 2vh 1vh 0'
                        }}
                    >
                        <TextField fullWidth id="outlined-basic" label={"Store Name"} variant="outlined" value={maxPriceStore}
                                   onChange={(e: any) => {
                                       console.log(`Store Name: ${e.target.value}`)
                                       setMaxPriceStore(e.target.value)
                                   }}/>
                    </Box>
                    <Box
                        component="div"
                        sx={{
                            width: 195,
                            maxWidth: '100%',
                            m: '0 0 6px 0'
                        }}
                    >
                        <TextField fullWidth id="outlined-number" label={"Highest Price"} variant="outlined" value={maxPrice} type="number"
                                   inputProps={{ min: 0, inputMode: "numeric", pattern: '[0-9]+' }}
                                   onChange={(e: any) => {
                                       console.log(`Highest Price: ${e.target.value}`)
                                       setCode(e.target.value)
                                   }}
                        />
                    </Box>
                </div>
                <div className="ingredient-input-field">
                    <Box
                        component="div"
                        sx={{
                            width: 290,
                            maxWidth: '100%',
                            m: '0 2vh 1vh 0'
                        }}
                    >
                        <TextField fullWidth id="outlined-basic" label={"Store Name"} variant="outlined" value={minPriceStore}
                                   onChange={(e: any) => {
                                       console.log(`Store Name: ${e.target.value}`)
                                       setMinPriceStore(e.target.value)
                                   }}/>
                    </Box>
                    <Box
                        component="div"
                        sx={{
                            width: 195,
                            maxWidth: '100%',
                            m: '0 0 6px 0'
                        }}
                    >
                        <TextField fullWidth id="outlined-number" label={"Lowest Price"} variant="outlined" value={minPrice} type="number"
                                   inputProps={{ min: 0, inputMode: "numeric", pattern: '[0-9]+' }}
                                   onChange={(e: any) => {
                                       console.log(`Lowest Price: ${e.target.value}`)
                                       setMinPrice(e.target.value)
                                   }}/>
                    </Box>
                </div>
            </div>

            <div className="submit-button-container ingredient-create-button">
                <button className='create-ingredient-button button button-gradient' onClick={sendDataToBackend}>Create
                </button>
            </div>
        </div>
    )
}
