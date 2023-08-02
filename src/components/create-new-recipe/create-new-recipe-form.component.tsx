import React, {useEffect, useState} from 'react';
import '../../App.css';
import './create-new-recipe-form.style.css';
import IngredientDelegate from "./ingredient-delegate/ingredient-delegate.component";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Cookies from "js-cookie";
import InputAdornment from "@mui/material/InputAdornment";
import {deleteToken} from "../../utils/TokenValidation";

export default function NewRecipeForm() {

    type IRecipeIngredientType ={
        name: string;
        minCost: number;
        avgCost: number;
        maxCost: number;
        quantity: number;
        //measurement_unit:string;
     };

    /////////////////////////////////Change only at load////////////////////////////////////
    const [ingredients, setIngredients] = useState<IRecipeIngredientType[]>([]);
    const [recipeIngredients, setRecipeIngredients] = useState<IRecipeIngredientType[]>([]);//this is both of them mergd
    const [ingredientsName,setIngredientNames]= useState<string[]>([]);//this is both of them names merged
    ////////////////////////////////////Global To Order //////////////////////////////////////////
    const [recipeName, setRecipeName] = useState('');
    const [recipePrice, setRecipePrice] = useState(0);
    const [totalMinCost, setTotalMinCost] = useState(0);
    const [totalMaxCost, setTotalMaxCost] = useState(0);
    const [totalAvgCost, setTotalAvgCost] = useState(0);
    /////////////////////////////////////Change for each ingredient added ////////////////////////////////
    const [currentIngredient,setCurrentIngredient] = useState<IRecipeIngredientType>();
    const [ingredientName, setIngredientName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [minCost, setMinCost] = useState(0);
    const [avgCost, setAvgCost] = useState(0);
    const [maxCost, setMaxCost] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const func = async () => {
            await fetchIngredients();
        }
        func();
    }, []);
    useEffect(() => {
        if(recipeName==="")
        {
            setQuantity(0);
            setMinCost(0);
            setAvgCost(0);
            setMaxCost(0);
        }
        updateTableFields()
    }, [ingredientName]);

    function updateTableFields() {
       const ingredient = ingredients.find(ingredient=>ingredient.name===ingredientName);
        setCurrentIngredient(ingredient);
       if(ingredient) {
           setQuantity(1);
           setIngredientName(ingredient.name);
           setMinCost(ingredient.minCost);
           setAvgCost(ingredient.avgCost);
           setMaxCost(ingredient.maxCost);
       }
    }

    async function fetchIngredients() {
        const body = {
            "table_name": "mnl_ingredients",
            "field_name": "user_email"
        }
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
            const data = response.data;
            console.log('data#####:', data);
            const formattedIngredients = data.map((ingredient: any) => {
                return {
                    name: ingredient.name,
                    minCost: ingredient.min_price,
                    maxCost: ingredient.max_price,
                    avgCost: ingredient.avg_price,
                    quantity: 2
                };
            });
            console.log('formattedIngredients#####:', formattedIngredients);
            setIngredients(formattedIngredients);
            const names = formattedIngredients.map((ingredient: any) => ingredient.name);
            setIngredientNames(names);
        }
        catch (error) {
            console.error(`Error fetching ingredients`, error);
            toast.error(`Error fetching ingredients`);
        }
    }

    function generateNumericID() {
        const min = 100000000; // Minimum 16-digit number
        const max = 999999999; // Maximum 16-digit number
        const numericID = Math.floor(Math.random() * (max - min + 1)) + min;
        return numericID.toString();
    }

    async function sendDataToBackend() {
        console.log(`Submit clicked`);
        if (recipeName === "") {
            toast.error("Please enter recipe name");
        } else if (recipeIngredients.length === 0)
            toast.error("Please add at least ingredient to the recipe");
        else if (isNaN(Number(recipePrice)))
            toast.error("Recipe price must be a number");
        else if (recipePrice === 0 || recipePrice.toString() === "0" || recipePrice.toString() === "") {
            toast.error("Recipe price can't be 0");
        } else {
            try {
                const payload = {
                    recipe_id: generateNumericID(),
                    recipe_name: recipeName,
                    recipe_price: recipePrice,
                    ingredients_min_cost: totalMinCost,
                    ingredients_avg_cost: totalAvgCost,
                    ingredients_max_cost: totalMaxCost,
                    ingredients: recipeIngredients
                };

                try {
                    const response = await axios.post(
                        'https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/new_recipe',
                        payload,
                        {
                            headers: {
                                "content-type": "application/json",
                                "Authorization": "Bearer " + Cookies.get('makecake-token')
                            }
                        }
                    );
                    if (response.status === 200) {
                        //TODO: Tomer - success message appears when creation failed -> Need to fix the lambda
                        toast.success('Recipe created successfully', { autoClose: 2000 });
                        navigate(`/recipes`);
                    } else {
                        toast.error('Error creating recipe');
                    }
                } catch (error:any) {
                    if(error.response.status===401)
                    {
                        deleteToken();
                        navigate('/');
                        toast.error('Login expired please login again',{autoClose:1500});
                    }
                    else
                        console.error('Error fetching orders:', error);
                }
            }catch (error:any) {
                if(error.response.status===401)
                {
                    deleteToken();
                    navigate('/');
                    toast.error('Login expired please login again',{autoClose:1500});
                }
                else
                    console.error('Error fetching orders:', error);
            }
        }
    }

    async function removeIngredient(name: string) {
        const index = recipeIngredients.findIndex(ingredient => ingredient.name === name);
        const ingredient = recipeIngredients[index];
        setTotalMinCost(totalMinCost-ingredient.minCost*ingredient.quantity);
        setTotalAvgCost(totalAvgCost-ingredient.avgCost*ingredient.quantity);
        setTotalMaxCost(totalMaxCost-ingredient.maxCost*ingredient.quantity);
        const newIngredients = [...recipeIngredients];
        newIngredients.splice(index, 1);
        setRecipeIngredients(newIngredients);
    }

    function addIngredient() {
        if (ingredientName === "" || !ingredientName)
            toast.error(`Please choose ingredient`);
        else if (quantity === 0 || !ingredientName)
            toast.error(`Please choose quantity greater that 0`);
        else {
            const recipeIngredientFromRecipe = recipeIngredients.find((ingredient) => ingredient.name === currentIngredient?.name);    /// check if the ingredient exist in the recipe
            if (recipeIngredientFromRecipe) {
                recipeIngredientFromRecipe.quantity = recipeIngredientFromRecipe.quantity + quantity;
            }
            else if (recipeIngredients && currentIngredient) {
                setRecipeIngredients([...recipeIngredients, currentIngredient]);
                currentIngredient.quantity = quantity;
            }
            if (currentIngredient) {
                setTotalMinCost(quantity * currentIngredient.minCost + totalMinCost);
                setTotalAvgCost(quantity * currentIngredient.avgCost + totalAvgCost);
                setTotalMaxCost(quantity * currentIngredient.maxCost + totalMaxCost);
            }
        }
        setIngredientName('');
        setMaxCost(0);
        setQuantity(0);
        setMinCost(0);
        setAvgCost(0);
    }


    return (
        <div className="dashboard-widget-container new-recipe-widget all-recipes-container inputs-container">
            <div className="new-recipe-input-fields">
                <div className={"new-recipe-ingredient-name"}>
                    <Box
                        component="div"
                        sx={{
                            width: 400,
                            maxWidth: '100%',
                            m: 1
                        }}
                    >
                        <TextField disabled={false} fullWidth id="outlined-basic" label={"Recipe Name"}
                                   variant="outlined" defaultValue={recipeName}
                                   value={recipeName}
                                   onChange={(e: any) => {
                                       setRecipeName(e.target.value)
                                   }}/>
                    </Box>

                </div>

                <div className={"new-recipe-price"}>
                    <Box
                        component="div"
                        sx={{
                            width: 255,
                            maxWidth: '100%',
                            m: '0 0 6px 0'
                        }}
                    >
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            label="Recipe Price"
                            variant="outlined"
                            value={recipePrice === 0 ? "" : recipePrice}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const inputValue = e.target.value;
                                // Ensure only positive numeric input is allowed (excluding zero and negative values)
                                if (/^\d*\.?\d*$/.test(inputValue) && inputValue !== "." && inputValue !== "0") {
                                    setRecipePrice(Number(inputValue));
                                }
                            }}
                            // Set inputMode to 'numeric' to display a numeric keyboard on mobile devices
                            inputMode="numeric"
                            // Display the dollar sign ($) at the start of the input field to indicate the currency
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                            }}
                        />
                    </Box>

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
                                    if (newValue)
                                        setIngredientName(newValue);
                                    else setIngredientName("");

                                }}
                                options={ingredientsName}
                                sx={{width: 235, padding: "8px 0 0 0"}}
                                renderInput={(params) => <TextField {...params} label={"Name"} variant="standard"/>}
                            />
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setQuantity(Number(e.target.value))
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Quantity'} type="number"
                                           defaultValue={quantity} value={quantity === 0 ? "" : quantity}
                                           inputProps={{min: 0, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setMinCost(e.target.value)
                                }}
                            >
                                <TextField disabled={true} id="standard-basic" label={'Min Cost'} variant="standard"
                                           value={minCost === 0 ? "" : minCost*quantity}/>
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setAvgCost(e.target.value)
                                }}
                            >
                                <TextField disabled={true} id="standard-basic" label={'Avg Cost'} variant="standard"
                                           value={avgCost === 0 ? "" : avgCost*quantity}/>
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {
                                    setMaxCost(e.target.value)
                                }}
                            >
                                <TextField disabled={true} id="standard-basic" label={'Max Cost'} variant="standard"
                                           value={maxCost === 0 ? "" : maxCost*quantity}/>
                            </Box>
                        </div>
                        <div className="recipes-list">
                            {
                                recipeIngredients.map((ingredient) => {
                                    return <IngredientDelegate removeDelegate={removeIngredient}
                                                               key={ingredient.name}
                                                               name={ingredient.name}
                                                               quantity={ingredient.quantity}
                                                               minCost={ingredient.minCost}
                                                               avgCost={ingredient.avgCost}
                                                               maxCost={ingredient.maxCost}
                                                               //measurement_unit={ingredient.measurement_unit}
                                    />
                                })
                            }
                        </div>
                    </div>
                    <div className="ingredient-delegate-container">
                        <div/>
                        <div/>
                        <Box
                            component="div"
                            sx={{
                                width: '25ch',
                                m: 1
                            }}
                        >
                            <TextField
                                disabled={true}
                                id="standard-basic"
                                label={"Order Min Cost"}
                                variant="standard"
                                defaultValue={totalMinCost}
                                value={totalMinCost === 0 ? "" : totalMinCost}
                                onChange={(e: any) => {
                                    setTotalMinCost(Number(e.target.value))
                                }}
                            />
                        </Box>
                        <Box
                            component="div"
                            sx={{
                                width: '25ch',
                                m: 1
                            }}
                        >
                            <TextField
                                disabled={true}
                                id="standard-basic"
                                label={"Order Avg Cost"}
                                variant="standard"
                                defaultValue={totalAvgCost}
                                value={totalAvgCost === 0 ? "" : totalAvgCost}
                                onChange={(e: any) => {
                                    setTotalAvgCost(Number(e.target.value))
                                }}
                            />
                        </Box>
                        <Box
                            component="div"
                            sx={{
                                width: '25ch',
                                m: 1
                            }}
                        >
                            <TextField
                                disabled={true}
                                id="standard-basic"
                                label={"Order Max Cost"}
                                variant="standard"
                                defaultValue={totalMaxCost}
                                value={totalMaxCost === 0 ? "" : totalMaxCost}
                                onChange={(e: any) => {
                                    setTotalMaxCost(Number(e.target.value))
                                }}
                            />
                        </Box>

                        <button className='button-container button-text add-item-button add-ingredient-to-recipe-button'
                                onClick={addIngredient}>Add Ingredient
                        </button>
                    </div>
                </div>
            </div>

            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Create</button>
            </div>
            <ToastContainer/>
        </div>
    )
}
