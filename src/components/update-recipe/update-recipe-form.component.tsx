import React, {useEffect, useState} from 'react';
import '../../App.css';
import './update-recipe-form.style.css';
import IngredientDelegate from "../create-new-recipe/ingredient-delegate/ingredient-delegate.component";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import InputAdornment from "@mui/material/InputAdornment";
import {deleteToken} from "../../utils/TokenValidation";

interface IRecipeProps {
    id: string
}

type IRecipeIngredientType = {
    name: string;
    minCost: number;
    avgCost: number;
    maxCost: number;
    quantity: number;
    //measurement_unit: string;
};


export default function EditRecipeForm({id}: IRecipeProps) {

    /////////////////////////////////Change only at load////////////////////////////////////
    const [recipeIngredients, setRecipeIngredients] = useState<IRecipeIngredientType[]>([]);//this is both of them merged
    const [ingredients, setIngredients] = useState<IRecipeIngredientType[]>([]);
    const [ingredientsName, setIngredientNames] = useState<string[]>([]);//this is both of them names merged
    ////////////////////////////////////Global To Order //////////////////////////////////////////
    const [recipeName, setRecipeName] = useState('');
    const [recipePrice, setRecipePrice] = useState(0);
    const [totalMinCost, setTotalMinCost] = useState(0);
    const [totalMaxCost, setTotalMaxCost] = useState(0);
    const [totalAvgCost, setTotalAvgCost] = useState(0);
    /////////////////////////////////////Change for each ingredient added ////////////////////////////////

    const [currentIngredient, setCurrentIngredient] = useState<IRecipeIngredientType>();
    const [ingredientName, setIngredientName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [minCost, setMinCost] = useState(0);
    const [avgCost, setAvgCost] = useState(0);
    const [maxCost, setMaxCost] = useState(0);

    const navigate = useNavigate();


    useEffect(() => {
        let sumMinCost = 0;
        let sumAvgCost = 0;
        let sumMaxCost = 0;

        // Calculate the sum for each ingredient in recipeIngredients
        recipeIngredients.forEach(ingredient => {
            sumMinCost += ingredient.quantity * ingredient.minCost;
            sumAvgCost += ingredient.quantity * ingredient.avgCost;
            sumMaxCost += ingredient.quantity * ingredient.maxCost;
        });

        // Update the state variables
        setTotalMinCost(sumMinCost);
        setTotalAvgCost(sumAvgCost);
        setTotalMaxCost(sumMaxCost);
    }, [recipeIngredients]);


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

    useEffect(() => {
        const func = async () => {
            await fetchIngredients();
            await fetchRecipeData();
        }
        func();
    }, []);

    function updateTableFields() {
        const ingredient = ingredients.find(ingredient => ingredient.name === ingredientName);
        setCurrentIngredient(ingredient);
        if (ingredient) {
            setQuantity(1);
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
                    name:ingredient.name,
                    code:ingredient.code,
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
        catch (error: any) {
            if(error.response.status===401)
            {
                deleteToken();
                navigate('/');
                toast.error('Login expired please login again',{autoClose:1500});
            }
            else{
                console.error('Error fetching ingredients:', error);
                toast.error(`Error fetching ingredients, please try again later`, {autoClose: 5000});
            }
        }
    }

    async function fetchRecipeData() {
        const payload = {recipe_id: id}
        try {
            const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_recipe', payload,
                {
                    headers: {
                        "content-type": "application/json",
                        "Authorization": "Bearer " + Cookies.get('makecake-token')
                    }
                }
            );
            if(response.status!==200)
                toast.error("Loading recipes failed");
            const data = JSON.parse(response.data.body)[0];
            console.log(data);
            setRecipeIngredients(data.ingredients);
            setRecipeName(data.recipe_name);
            setRecipePrice(data.recipe_price);
            setTotalMinCost(data.ingredients_min_cost);
            setTotalAvgCost(data.ingredients_avg_cost);
            setTotalMaxCost(data.ingredients_max_cost);
        } catch (error:any) {
            if(error.response.status===401)
            {
                deleteToken();
                navigate('/');
                toast.error('Login expired please login again',{autoClose:1500});
            }
            else{
                console.error('Error fetching recipes:', error);
                toast.error(`Error fetching recipes, please try again later`, {autoClose: 5000});
            }
        }
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
                    recipe_id: id.toString(),
                    recipe_name: recipeName,
                    recipe_price: recipePrice,
                    ingredients_min_cost: totalMinCost,
                    ingredients_avg_cost: totalAvgCost,
                    ingredients_max_cost: totalMaxCost,
                    ingredients: recipeIngredients
                };
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
                        toast.success('Recipe updated successfully', {autoClose: 2000});
                        navigate(`/recipes`);
                    } else {
                        toast.error('Error updating recipe');
                    }
            } catch (error:any) {
                if(error.response.status===401)
                {
                    deleteToken();
                    navigate('/');
                    toast.error('Login expired please login again',{autoClose:1500});
                }
                else{
                    console.error('Error creating new recipe:', error);
                    toast.error(`Error creating new recipe, please try again later`, {autoClose: 5000});
                }
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
                recipeIngredientFromRecipe.quantity = parseFloat((recipeIngredientFromRecipe.quantity + quantity).toFixed(3));
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
                            width: 400,
                            maxWidth: '100%',
                            m: 1
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
                                value={totalMinCost === 0 ? "" : totalMinCost.toFixed(2)}
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
                                value={totalAvgCost === 0 ? "" : totalAvgCost.toFixed(2)}
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
                                value={totalMaxCost === 0 ? "" : totalMaxCost.toFixed(2)}
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
                <button className='button button-gradient' onClick={sendDataToBackend}>Update</button>
            </div>
            <ToastContainer/>
        </div>
    )
}
