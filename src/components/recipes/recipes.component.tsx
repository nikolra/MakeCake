import React, {useEffect, useState} from 'react'
import '../dashboard-widgets/widgets.style.css'
import './recipes.style.css'
import RecipeDelegate from './recipes-delegate/recipe-delegate.component'
import {devRecipes} from "./dev-data";
import SearchField from "../search-field/search-field.component";
import NavigationButtonComponent from "../navigation-button/navigation-button.component";

interface IRecipeProps{
    className: string,
    header: string,
    description: string
}

export default function Recipes({className, header, description}: IRecipeProps) {

    const [recipes, setRecipes] = useState(devRecipes);
    const [filteredRecipes, setFilteredRecipes] = useState(recipes);
    const [searchString, setSearchString] = useState('');

    useEffect( () => {
        const filtered = recipes.filter((recipe) => {
            const name = recipe.name;

            console.log(name, searchString, name.includes(searchString))

            return name.includes(searchString);
        })
        setFilteredRecipes(filtered)
    }, [recipes, searchString])

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
                        <span>Total Cost</span>
                    </div>
                </div>
            </div>
            <div className="all-recipes-list-container">
                <div className="all-recipes-list">
                    {
                        filteredRecipes.map((recipe) => {
                            return <RecipeDelegate key={recipe.id} data={recipe} />
                        })
                    }
                </div>
            </div>
            <NavigationButtonComponent to="/recipes/new" text="Add Recipe"/>
        </div>
    )
}