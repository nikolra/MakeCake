import React, {useEffect, useState} from 'react'
import '../dashboard-widgets/widgets.style.css'
import './ingredients.style.css'
import IngredientDelegate from './ingredients-delegate/ingrediant-delegate.component'
import {devIngredients} from "./dev-data";
import SearchField from "../search-field/search-field.component";
import NavigationButtonComponent from "../navigation-button/navigation-button.component";
import {toast, ToastContainer} from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

interface IIngredientProps{
    className: string,
    header: string,
    description: string
}

interface IIngredientData{
    id: string,
    name: string,
    minCost: number,
    avgCost: number,
    maxCost: number,
    isManual: boolean
}

export default function Ingredients({className, header, description}: IIngredientProps) {

    const [ingredients, setIngredients] = useState<IIngredientData[]>();
    const [filteredIngredients, setFilteredIngredients] = useState(ingredients);
    const [searchString, setSearchString] = useState('');

    useEffect( () => {
        const filtered = ingredients?.filter((ingredient) => {
            const name = ingredient.name;
            console.log(name, searchString, name.includes(searchString))
            return name.includes(searchString);
        })
        setFilteredIngredients(filtered? filtered : [])
    }, [ingredients, searchString]);

    useEffect(() => {
        updateIngredients();
    }, []);

    const updateIngredients = async () => {
        console.log(`update Ingredients called`);
        //TODO: Amit integrate with automated ingredients lambda
        try {
            const response =
                await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_user',
                    {accessToken: Cookies.get('makecake-token')},
                    {
                        headers: {
                            "content-type": "application/json",
                            "Authorization": "Bearer " + Cookies.get('makecake-token')
                        }
                    });
            const responseBodyJSON = JSON.parse(response.data.body);
            const user_email = responseBodyJSON.email;
            console.log(response.data);

            const body = {
                "table_name": "mnl_ingredients",
                "field_name": "user_email",
                "search_value": user_email
            }
            console.log(body);
            try {
                const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_mnl_ingredients', body);
                const data = response.data;
                console.log('data#####:', data);
                const formattedIngredients = data.map((ingredient: any) => {
                    return {
                        id: ingredient.code.S,
                        name: ingredient.name.S,
                        minCost: {
                            price: ingredient.min_price.N,
                            supermarketName: ingredient.min_store.S
                        },
                        maxCost: {
                            price: ingredient.max_price.N,
                            supermarketName: ingredient.max_store.S
                        },
                        avgCost: ingredient.avg_price.N
                    };
                });
                setIngredients(formattedIngredients);
                console.log('formattedIngredients:', formattedIngredients);
            }
            catch (error) {
                console.error(`Error getting ingredients`, error);
                toast.error(`Error getting ingredients`);

            }
        }
        catch (error) {
            console.error(`Error getting user email`, error);
            toast.error(`Error getting user email`);
        }
    }

    const deleteIngredients = (id: string) => {
        console.log(`delete ingredient called`);
        //TODO: Amit integrate with automated ingredients lambda
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
                        filteredIngredients?.map((ingredient) => {
                            return <IngredientDelegate deleteDelegate={deleteIngredients} key={ingredient.id} data={ingredient} />
                        })
                    }
                </div>
            </div>
            <div className = "buttons-container-row align-right">
                <div className="update-ingredients-button-container align-right">
                    <button className='update-ingredients-button' onClick={updateIngredients}>update ingredients</button>
                </div>
                <NavigationButtonComponent to="/ingredients/new" text="Add Ingredient" fontClassName="update-ingredients-button-container"/>
            </div>
            <ToastContainer/>
        </div>
    )
}