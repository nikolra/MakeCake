interface IIngredient {
    id: string,
    name: string,
    quantity: number,
    avgCost: number
    minCost: ICost,
    maxCost: ICost
}

interface ICost {
    price: number,
    supermarketName: string
}

const makeIngredient = (id: string, name: string, avgCost: number, minCost: ICost, maxCost: ICost, quantity: number = 5): IIngredient => {
    return {
        id: id,
        name: name,
        minCost: minCost,
        avgCost: avgCost,
        maxCost: maxCost,
        quantity: quantity
    }
}

const makeRecipe = (id: string, name: string, avgCost: number, ingredients: IIngredient[]) => {
    return {
        id: id,
        name: name,
        avgCost: avgCost,
        ingredients: ingredients
    }
}

const ingredients = [makeIngredient(
    "#1",
    "Sugar",
    6.5,
    {
        price: 3,
        supermarketName: "Shufersal"
    },
    {
        price: 10,
        supermarketName: "Rami Levi"
    }
),

    makeIngredient(
        "#2",
        "Salt",
        3.5,
        {
            price: 2,
            supermarketName: "Shufersal"
        },
        {
            price: 5,
            supermarketName: "Rami Levi"
        }
    ),

    makeIngredient(
        "#3",
        "Chocolate",
        52,
        {
            price: 20,
            supermarketName: "Shufersal"
        },
        {
            price: 100,
            supermarketName: "Rami Levi"
        }
    ),

    makeIngredient(
        "#4",
        "Coffee",
        18,
        {
            price: 15,
            supermarketName: "Shufersal"
        },
        {
            price: 20,
            supermarketName: "Rami Levi"
        }
    )
]

export const devRecipes = [
    makeRecipe("1", "Cookie", 10, ingredients),
    makeRecipe("2", "Banana cake", 180, ingredients),
    makeRecipe("3", "Cherry pie", 200, ingredients),
    makeRecipe("4", "Chocolate cookie", 12, ingredients),
    makeRecipe("5", "Muffin", 20, ingredients),
    makeRecipe("6", "Ginger cookie", 8, ingredients),
]