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
                        id: ingredient.code,
                        name: ingredient.name,
                        minCost: {
                            price: ingredient.min_price,
                            supermarketName: ingredient.min_store
                        },
                        maxCost: {
                            price: ingredient.max_price,
                            supermarketName: ingredient.max_store
                        },
                        avgCost: ingredient.avg_price,
                        isManual: (ingredient.is_menual === "true") ? true : false
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

    const deleteIngredients = async (id: string) => {
        console.log(`delete ingredient called`);
        //TODO: Amit integrate with manual ingredients lambda
        const body = {
            code: id
        }
        console.log('body:', body)
        try {
            const response =
                await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/delete_mnl_ingredient',
                    body,
                    {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: "Bearer " + Cookies.get('makecake-token')
                        }
                    });
            console.log('response:', response);
            toast.success(`Ingredient deleted successfully`);
            updateIngredients();
        }
        catch (error) {
            console.error(`Error deleting ingredient`, error);
            toast.error(`Error deleting ingredient`);
        }
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