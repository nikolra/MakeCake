import React, {useEffect, useState} from 'react'
import '../dashboard-widgets/widgets.style.css'
import './recipes.style.css'
import './dev-data';
import RecipeDelegate from './recipes-delegate/recipe-delegate.component'
import SearchField from "../search-field/search-field.component";
import NavigationButtonComponent from "../navigation-button/navigation-button.component";
import {ToastContainer} from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom";

interface IRecipeProps {
    className: string,
    header: string,
    description: string
}

type IngredientType = {
    id: string;
    name: string;
    minCost: number;
    avgCost: number;
    maxCost: number;
    ingredient_quantity: number;
};

type RecipeType = {
    id: string;
    name: string;
    price:number
    ingredients: IngredientType[];
    totalCost: number;
};

export default function Recipes({className, header, description}: IRecipeProps) {

    const [recipes, setRecipes] = useState<RecipeType[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<RecipeType[]>([]);
    const [searchString, setSearchString] = useState('');
    const navigate = useNavigate();
    const deleteRecipe= async (id: any) => {
        try {
            let str=id.toString()
            const payload = {
                user_email: "tomer@gmail.com",
                recipe_id: str
            };
            const response = await axios.delete('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/delete_recipe', {params: payload});
            console.log(response);
            await navigate('/recipes');
        }
        catch (error)
        {
            console.error(`Error deleting recipe ${id}:`, error);
        }
    }

    const fetchRecipes = async () => {
        try {
            const payload = {user_email: 'tomer@gmail.com'};
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_user_recipes', {params:payload});
            const responseData = JSON.parse(response.data.body);
            console.log(responseData)
            const transformedRecipes = responseData.map((recipeData: any, index: number) => createRecipeFromData(recipeData, ++index));
            //console.log('setting recipes');
            setRecipes(transformedRecipes);
            //console.log(transformedRecipes);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    useEffect(() => {
        fetchRecipes();
    }, []);

    const createRecipeFromData = (recipeData: any, recipeId: number) => {
        let ingredientCounter=0;
        const ingredients = recipeData.ingredients?.L.map((ingredientData: any) => {
            const ingredientId = `${++ingredientCounter}`;
            const ingredientName = ingredientData.M.ingredient_name.S;
            const ingredientPrice= ingredientData.M.ingredient_price.N;
            const ingredientQuantity = ingredientData.M.ingredient_quantity.N;
            return { id: `${ingredientData.M.ingredient_code.S}`, name: ingredientName, minCost: ingredientPrice,avgCost:ingredientPrice,maxCost:ingredientPrice, ingredient_quantity: ingredientQuantity };
        });

        const totalCost = ingredients.reduce((total: number, ingredient: IngredientType) => {
            if (ingredient) {
                return total + (ingredient.minCost*ingredient.ingredient_quantity);
            }
            return total;
        }, 0);
        return { id: recipeId, name: recipeData.recipe_name?.S,price:recipeData.recipe_price || 0, ingredients, totalCost };
    };

    useEffect(() => {
        const filtered = recipes.filter((recipe) => recipe.name.toLowerCase().includes(searchString));
        setFilteredRecipes(filtered);
    }, [recipes, searchString]);

    return (
        <div className= {`dashboard-widget-container all-recipes-widget ${className}`}>
            <div className="all-recipes-header">
                <div className="all-recipes-header-title-row">
                    <div className="all-recipes-header-text">
                        <span className="widget-title-text">{header}</span>
                        <span className="widget-title-text-secondary">{description}</span>
                    </div>
                    <div className="all-recipes-header-find-container">
                        <SearchField placeholder="Find" onChangeHandler={
                            (event: any) => {
                                setSearchString(event.target.value.toLowerCase())
                            }
                        }/>
                    </div>
                </div>

                <div className="all-recipes-header-recipes-list-title">
                    <div className="all-recipes-header-recipes-list-title-item">
                        <span>Recipe ID</span>
                    </div>
                    <div className="all-recipes-header-recipes-list-title-item">
                        <span>Recipe Name</span>
                    </div>
                    <div className="all-recipes-header-recipes-list-title-item">
                        <span>Average Cost</span>
                    </div>
                </div>
            </div>
            <div className="all-recipes-list-container">
                <div className="all-recipes-list">
                    {
                        filteredRecipes.map((recipe) => {
                            return <RecipeDelegate key={recipe.id} data={recipe} deleteDelegate={deleteRecipe}/>
                        })
                    }
                </div>
            </div>
            <NavigationButtonComponent to="/recipes/new" text="Add Recipe" fontClassName={'add-recipe-button'} spanClass={'add-recipe-span'}/>
            <ToastContainer/>
        </div>
    )
}