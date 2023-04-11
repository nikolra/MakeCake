const makeIngredient = (id, name, avgCost, minCost, maxCost) => {
    return {
        id: id,
        name: name,
        minCost: minCost,
        avgCost: avgCost,
        maxCost: maxCost
    }
}

export const devIngredients = [
    makeIngredient(
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
        ),
]