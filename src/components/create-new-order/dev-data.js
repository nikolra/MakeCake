const makeRecipe = (name, quantity, ingredientsCost, totalCost = quantity * ingredientsCost * 1.5) => {
    return {
        name: name,
        quantity: quantity,
        ingredientsCost: ingredientsCost,
        totalCost: totalCost
    }
}


const devRecipes = [

    makeRecipe( "Cookie", 10, 10),
    makeRecipe( "Banana cake", 180, 1),
    makeRecipe( "Cherry pie", 200, 1),
    makeRecipe( "Chocolate cookie", 12, 10),
    makeRecipe( "Muffin", 20, 5),
    makeRecipe( "Ginger cookie", 8, 10),
]

module.exports = {
    devRecipes: devRecipes,
    makeRecipe: makeRecipe
}