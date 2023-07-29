import React, {useEffect, useState} from 'react'
import '../dashboard-widgets/widgets.style.css'
import './recipes.style.css'
import './dev-data';
import RecipeDelegate from './recipes-delegate/recipe-delegate.component'
import SearchField from "../search-field/search-field.component";
import NavigationButtonComponent from "../navigation-button/navigation-button.component";
import {toast, ToastContainer} from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';

interface IRecipeProps {
    className: string,
    header: string,
    description: string
}

type IngredientType = {
    id: string;
    ingredient_name: string;
    ingredient_price: number;
    //ingredient_price: number;
    //ingredient_price: number;
    ingredient_quantity: number;
};

type RecipeType = {
    recipe_id: string;
    recipe_name: string;
    recipe_price: number
    ingredients: IngredientType[];


};

export default function Recipes({className, header, description}: IRecipeProps) {
    const [recipes, setRecipes] = useState<RecipeType[]>([]);
    const [searchString, setSearchString] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const func = async () => {
            await fetchRecipes();
        }
        func();
    }, []);


    const deleteRecipe = async (id: any) => {
        try {
            const payload = {
                recipe_id: id.toString()
            };
            toast.promise(
                async () => {
                    await axios.post(`https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/delete_recipe`, payload,
                        {
                            headers: {
                                "Content-type": "application/json",
                                Authorization: "Bearer " + Cookies.get('makecake-token'),
                            }
                        });
                },
                {
                    pending: 'Loading',
                    success: {render: 'recipe deleted', autoClose: 1000},
                    error: {render: 'Error deleting recipe', autoClose: 1000}
                }
            ).then(response => {
                handleDeleteOrder(id);
            });
        } catch (error) {
            console.error(`Error deleting recipe ${id}:`, error);
        }
    }


    const handleDeleteOrder = (id: any) => {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.recipe_id !== id));
    }
    const fetchRecipes = async () => {
        try {
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_user_recipes',
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + Cookies.get('makecake-token')
                    }
                });
            const data = JSON.parse(response.data.body);
            setRecipes(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
        console.log(3);
    };

    return (
        <div className={`dashboard-widget-container all-recipes-widget ${className}`}>
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
                        <span>Ingredients Min Cost</span>
                    </div>
                    <div className="all-recipes-header-recipes-list-title-item">
                        <span>Ingredients Average Cost</span>
                    </div>
                    <div className="all-recipes-header-recipes-list-title-item">
                        <span>Ingredients Max Cost</span>
                    </div>
                    <div className="all-recipes-header-recipes-list-title-item">
                        <span>Recipe price</span>
                    </div>
                </div>
            </div>
            <div className="all-recipes-list-container">
                <div className="all-recipes-list">
                    {
                        recipes.map((recipe) => {
                            return <RecipeDelegate key={recipe.recipe_id} data={recipe} deleteDelegate={deleteRecipe}/>
                        })
                    }
                </div>
            </div>
            <NavigationButtonComponent to="/recipes/new" text="Add Recipe" fontClassName={'add-recipe-button'}
                                       spanClass={'add-recipe-span'}/>
            <ToastContainer/>
        </div>
    )
}