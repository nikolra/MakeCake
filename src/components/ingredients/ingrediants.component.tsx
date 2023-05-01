import React, {useEffect, useState} from 'react'
import '../dashboard-widgets/widgets.style.css'
import './ingredients.style.css'
import IngredientDelegate from './ingredients-delegate/ingrediant-delegate.component'
import {devIngredients} from "./dev-data";
import SearchField from "../search-field/search-field.component";
import NavigationButtonComponent from "../navigation-button/navigation-button.component";

interface IIngredientProps{
    className: string,
    header: string,
    description: string
}

export default function Ingredients({className, header, description}: IIngredientProps) {

    const [ingredients, setIngredients] = useState(devIngredients);
    const [filteredIngredients, setFilteredIngredients] = useState(ingredients);
    const [searchString, setSearchString] = useState('');

    useEffect( () => {
        const filtered = ingredients.filter((ingredient) => {
            const name = ingredient.name;

            console.log(name, searchString, name.includes(searchString))

            return name.includes(searchString);
        })
        setFilteredIngredients(filtered)
    }, [ingredients, searchString])

    const updateIngredients = () => {
        console.log(`updateIngredients called`);
        //TODO: implement
    }
    return (
        <div className= {`dashboard-widget-container all-ingredients-widget ${className}`}>
            <div className="all-ingredients-header">
                <div className="all-ingredients-header-title-row">
                    <div className="all-ingredients-header-text">
                        <span className="widget-title-text">{header}</span>
                        <span className="widget-title-text-secondary">{description}</span>
                    </div>
                    <div className="all-ingredients-header-find-container">
                        <SearchField placeholder="Find" onChangeHandler={
                            (event: any) => {
                                setSearchString(event.target.value.toLowerCase())
                            }
                        }/>
                    </div>
                </div>

                <div className="all-ingredients-header-ingredients-list-title">
                    <div className="all-ingredients-header-ingredients-list-title-item">
                        <span>Ingredient ID</span>
                    </div>
                    <div className="all-ingredients-header-ingredients-list-title-item">
                        <span>Ingredient Name</span>
                    </div>
                    <div className="all-ingredients-header-ingredients-list-title-item">
                        <span>Average Price</span>
                    </div>
                </div>
            </div>
            <div className="all-ingredients-list-container">
                <div className="all-ingredients-list">
                    {
                        filteredIngredients.map((ingredient) => {
                            return <IngredientDelegate key={ingredient.id} data={ingredient} />
                        })
                    }
                </div>
            </div>
            <div className = "buttons-container-row align-right">
                <div className="update-ingredients-button-container align-right">
                    <button className='update-ingredients-button' onClick={updateIngredients}>update ingredients</button>
                </div>
                <NavigationButtonComponent to="/ingredients/new" text="Add Ingredient" fontClassName={"height-button"}/>
            </div>
        </div>
    )
}