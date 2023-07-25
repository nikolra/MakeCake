import React, {useEffect, useState} from 'react';
import '../../App.css';
import './create-new-recipe-form.style.css';
import OutlinedInputField from "../outlinedd-input-field/input-field.component";
import IngredientDelegate from "./ingredient-delegate/ingredient-delegate.component";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Cookies from "js-cookie";

export default function NewRecipeForm() {



    type IRecipeIngredientType ={
        ingredient_name: string;
        ingredient_code: string;
        minCost: number;
        avgCost: number;
        maxCost: number;
        quantity: number;
        measurement_unit:string;
        automated: boolean;
     };

/*    //const [ingredients, setIngredients] = useState<Array<{ code: any, name: any, cost: any,quantity: any, automated: any }>>([]);
    const arr: any[] = []; //TODO: Amit - delete this after integration*/

    /////////////////////////////////Change only at load////////////////////////////////////
    const [manualIngredients, setManualIngredients] = useState<IRecipeIngredientType[]>([
        {
            ingredient_name: "Flour",
            ingredient_code: "10001",
            minCost: 2,
            avgCost: 2,
            maxCost: 2,
            quantity: 0,
            measurement_unit: "gram",
            automated: false,
        },
        {
            ingredient_name: "Sugar",
            ingredient_code: "10002",
            minCost: 1.5,
            avgCost: 1.5,
            maxCost: 1.5,
            quantity: 0,
            measurement_unit: "gram",
            automated: false,
        },
        {
            ingredient_name: "Salt",
            ingredient_code: "10003",
            minCost: 0.5,
            avgCost: 0.5,
            maxCost: 0.5,
            quantity: 0,
            measurement_unit: "gram",
            automated: false,
        },
        {
            ingredient_name: "Baking Powder",
            ingredient_code: "10004",
            minCost: 1.2,
            avgCost: 1.2,
            maxCost: 1.2,
            quantity: 0,
            measurement_unit: "gram",
            automated: false,
        },
        {
            ingredient_name: "Vanilla Extract",
            ingredient_code: "10005",
            minCost: 3,
            avgCost: 3,
            maxCost: 3,
            quantity: 0,
            measurement_unit: "ml",
            automated: false,
        },
    ]);//TODO: Amit - should be initialized to all ingredients name on page load
    const [automatedIngredients, setAutomatedIngredients] = useState<IRecipeIngredientType[]>([
        {
            ingredient_name: "Olive Oil",
            ingredient_code: "10006",
            minCost: 5,
            avgCost: 6,
            maxCost: 7,
            quantity: 0,
            measurement_unit: "ml",
            automated: true,
        },
        {
            ingredient_name: "Onion",
            ingredient_code: "10007",
            minCost: 1.2,
            avgCost: 1.5,
            maxCost: 1.8,
            quantity: 0,
            measurement_unit: "gram",
            automated: true,
        },
        {
            ingredient_name: "Tomatoes",
            ingredient_code: "10008",
            minCost: 2.5,
            avgCost: 3,
            maxCost: 3.5,
            quantity: 0,
            measurement_unit: "gram",
            automated: true,
        },
        {
            ingredient_name: "Cheddar Cheese",
            ingredient_code: "10009",
            minCost: 3,
            avgCost: 3.25,
            maxCost: 3.5,
            quantity: 0,
            measurement_unit: "gram",
            automated: true,
        },
        {
            ingredient_name: "Fresh Basil",
            ingredient_code: "10010",
            minCost: 1.5,
            avgCost: 1.75,
            maxCost: 2,
            quantity: 0,
            measurement_unit: "gram",
            automated: true,
        },
    ]);
    const [recipeIngredients, setRecipeIngredients] = useState<IRecipeIngredientType[]>([]);//TODO this is both of them merged
    const [ingredients,setIngredients] = useState<IRecipeIngredientType[]>([]);
    const [ingredientsName,setIngredientNames]= useState<string[]>([]);//TODO this is both of them names merged
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
        if(recipeName==="")
        {
            setQuantity(0);
            setMinCost(0);
            setAvgCost(0);
            setMaxCost(0);
        }
    }, [ingredientName]);
    useEffect(() => {fetchManualIngredients(); }, []);
    useEffect(() => {fetchAutomatedIngredients(); }, []);
    useEffect(() => {fetchIngredientsName(); }, []);

    useEffect(() => {updateTableFields() }, [ingredientName]);


    function updateTableFields()
    {
       const ingredient = ingredients.find(ingredient=>ingredient.ingredient_name===ingredientName);
        setCurrentIngredient(ingredient);
       if(ingredient) {
           setQuantity(1);
           setMinCost(ingredient.minCost);
           setAvgCost(ingredient.avgCost);
           setMaxCost(ingredient.maxCost);
       }
    }
    function fetchIngredientsName()
    {
        const automatedNames=automatedIngredients.map((ingredient:IRecipeIngredientType)=> {return ingredient.ingredient_name})
        const manualNames = manualIngredients.map((ingredient: IRecipeIngredientType) => {return ingredient.ingredient_name+"- my"; });
        ingredients.concat(automatedIngredients);
        let manualIIngredients = manualIngredients.map((ingredient: IRecipeIngredientType) => {
            return {...ingredient, ingredient_name: ingredient.ingredient_name + "- my"};
        });
        const merged=manualIIngredients.concat(automatedIngredients);
        setIngredients(merged);
        setIngredientNames(automatedNames.concat(manualNames));
    }

    async function fetchManualIngredients()
    {
        /// get request


        //get the names of them
        //place them in ingredientsName
    }
    async function fetchAutomatedIngredients()
    {
        /// get request


        //get the names of them
        //place them in ingredientsName
    }
    function generateNumericID() {
        const min = 100000000; // Minimum 16-digit number
        const max = 999999999; // Maximum 16-digit number
        const numericID = Math.floor(Math.random() * (max - min + 1)) + min;
        return numericID.toString();
    }

    async function sendDataToBackend() {
        console.log(`Submit clicked`);
        console.log(recipePrice);
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
                const recipeData = {
                    recipe_id: generateNumericID(),
                    recipe_name: recipeName,
                    recipe_price: recipePrice,
                    ingredients_min_cost: totalMinCost,
                    ingredients_avg_cost: totalAvgCost,
                    ingredients_max_cost: totalMaxCost,
                    ingredients: recipeIngredients
                };
                try {

                    const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/new_recipe',
                        recipeData,
                        {
                            headers: {
                                "Content-type": "application/json",
                                Authorization: "Bearer " + Cookies.get('makecake-token')
                            }
                        });

                    if (response.status === 200) {
                        toast.success('Recipe created successfully', {autoClose: 2000});
                        navigate(`/recipes`);
                    } else {
                        toast.error('Error creating recipe');
                    }
                } catch (error) {
                    toast.error('Error creating recipe');
                    console.error(error);
                }
            } catch (error) {
                return error;
            }
        }
    }

    async function removeIngredient(name: string) {
        console.log(`remove name: ${name}`);
        const index = recipeIngredients.findIndex(ingredient => ingredient.ingredient_name === name);
        const newIngredients = [...recipeIngredients];
        newIngredients.splice(index, 1);
        setRecipeIngredients(newIngredients);
    }

    function addIngredient() {
        if(ingredientName === "" || !ingredientName)
            toast.error(`Please choose ingredient`);
        else if(quantity === 0 || !ingredientName)
            toast.error(`Please choose quantity greater that 0`);
        else {
            const recipeIngredientFromRecipe=recipeIngredients.find((ingredient)=>ingredient===currentIngredient);
            if(recipeIngredientFromRecipe)
                recipeIngredientFromRecipe.quantity=recipeIngredientFromRecipe.quantity+quantity;
            else if(recipeIngredients&&currentIngredient) 
            {
                setRecipeIngredients([...recipeIngredients, currentIngredient]);
                currentIngredient.quantity=quantity;
            }
            if(currentIngredient) {
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
                    <OutlinedInputField label='Recipe Name' setValueDelegate={setRecipeName} width={400}/>
                </div>
                <div className={"new-recipe-ingredient-name"}>
                    <OutlinedInputField label='Recipe Price' setValueDelegate={setRecipePrice} width={400}/>
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
                    <div className="new-recipe-ingredients-header-ingredients-list-title">
                        <div className="new-recipe-ingredients-header-list-title">
                            <span>Name</span>
                        </div>
                        <div className="new-recipe-ingredients-header-list-title">
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

                    <div className="new-recipe-ingredients-list-container">
                        <div className="new-recipe-ingredients-input">
                            <Autocomplete
                                disablePortal
                                id="comcbo-box-demo"
                                value={ingredientName}
                                onChange={(event: any, newValue: string | null) => {
                                    if(newValue)
                                        setIngredientName(newValue)
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
                                    setQuantity(e.target.value)
                                }}
                            >
                                <TextField variant="standard" id="standard-number" label={'Quantity'} type="number"
                                           defaultValue={quantity}
                                           value={quantity === 0 ? "" : quantity}
                                           inputProps={{min: 1, inputMode: "numeric", pattern: '[0-9]+'}}
                                />
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {setMinCost(e.target.value)}}
                            >
                                <TextField disabled={true} id="standard-basic" label={'Min Cost'} variant="standard" value={minCost === 0 ? "" : minCost}/>
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {setAvgCost(e.target.value)}}
                            >
                                <TextField disabled={true} id="standard-basic" label={'Avg Cost'} variant="standard" value={avgCost === 0 ? "" : avgCost}/>
                            </Box>
                            <Box
                                component="div"
                                sx={{
                                    '& > :not(style)': {m: 1, width: '25ch'},
                                }}
                                onChange={(e: any) => {setMaxCost(e.target.value)}}
                            >
                                <TextField disabled={true} id="standard-basic" label={'Max Cost'} variant="standard" value={maxCost === 0 ? "" : maxCost}/>
                            </Box>
                        </div>
                        <div className="recipes-list">
                            {
                                recipeIngredients.map((ingredient) => {
                                    return <IngredientDelegate removeDelegate={removeIngredient} key={ingredient.ingredient_name} name={ingredient.ingredient_name} quantity={(ingredient.quantity)}
                                     minCost={ingredient.minCost}  avgCost={ingredient.avgCost}     maxCost={ingredient.maxCost} measurement_unit = {ingredient.measurement_unit}
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
                                m:1
                            }}
                        >
                            <TextField
                                disabled={true}
                                id="standard-basic"
                                label={"Order Min Cost"}
                                variant="standard"
                                defaultValue={totalMinCost}
                                value={totalMinCost=== 0 ? "" : totalMinCost}
                                onChange={(e: any) => {
                                    setTotalMinCost(e.target.value)
                                }}
                            />
                        </Box>
                        <Box
                            component="div"
                            sx={{
                                width: '25ch',
                                m:1
                            }}
                        >
                            <TextField
                                disabled={true}
                                id="standard-basic"
                                label={"Order Avg Cost"}
                                variant="standard"
                                defaultValue={totalAvgCost}
                                value={totalAvgCost=== 0 ? "" : totalAvgCost}
                                onChange={(e: any) => {
                                    setTotalAvgCost(e.target.value)
                                }}
                            />
                        </Box>
                        <Box
                            component="div"
                            sx={{
                                width: '25ch',
                                m:1
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
                                    setTotalMaxCost(e.target.value)
                                }}
                            />
                        </Box>
                        <button className='button-container button-text add-item-button add-ingredient-to-recipe-button' onClick={addIngredient}>Add</button>
                        </div>
                </div>
             </div>
            <div className="submit-button-container">
                <button className='button button-gradient' onClick={sendDataToBackend}>Create</button>
            </div>
        </div>
    )
}
