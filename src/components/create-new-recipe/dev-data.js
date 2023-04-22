const makeIngredient = (name, quantity, cost) => {
    return {
        id: cost,
        name: name,
        quantity: quantity,
        avgCost: cost,
        minCost: cost,
        maxCost: cost
    }
}

const devIngredients = [

    makeIngredient( "Cookie", 10, 10),
    makeIngredient( "Banana cake", 180, 1),
    makeIngredient( "Cherry pie", 200, 1),
    makeIngredient( "Chocolate cookie", 12, 10),
    makeIngredient( "Muffin", 20, 5),
    makeIngredient( "Ginger cookie", 8, 10),
]

module.exports = {
    devIngredients: devIngredients,
    makeIngredient: makeIngredient
}