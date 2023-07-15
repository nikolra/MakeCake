import React, {useState} from 'react';
import '../../App.css';
import './create-new-ingredient-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import NumericInputField from "../numeric-input-field/input-field.component";
import {useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {toast, ToastContainer} from "react-toastify";

export default function NewIngredientForm() {

    const [ingredientName, setIngredientName] = useState();
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [code, setCode] = useState("");
    const [isValidCode, setIsValidCode] = useState(false);
    const [minPriceStore, setMinPriceStore] = useState();
    const [maxPriceStore, setMaxPriceStore] = useState();
    const navigate = useNavigate();

    async function sendDataToBackend() {
        console.log(`Submit clicked`);
        if(!isValidCode)
            toast.error(`Please enter a valid email address`);
        navigate('/ingredients');
        //TODO: Amit integrate create new ingredient (manual?)
    }

    const codeValidator = (barcode: string) => {
        return /^-?\d+$/.test(barcode);

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
                    <Box
                        component="div"
                        sx={{
                            width: 195,
                            maxWidth: '100%',
                            m: '0 0 6px 0',
                            border: !isValidCode ? '1px solid #ff0000': "",
                            ':focus-within': {
                                border: !isValidCode ?'1px solid #ff0000' :  "",
                                "border-radius": "4px"
                            }
                        }}
                    >
                        <TextField fullWidth id="outlined-basic" label={"Ingredient Code"} variant="outlined" defaultValue={code}
                                   onChange={(e: any) => {
                                       const value = e.target.value
                                       setIsValidCode(codeValidator(value));
                                       setCode(value)
                                   }}/>
                    </Box>
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
            <ToastContainer/>
        </div>
    )
}
