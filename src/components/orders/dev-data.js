const makeOrder = (id, dueDate, totalCost, customer, recipes) => {
    return {
        id: id,
        dueDate: dueDate,
        customer: customer,
        totalCost: totalCost,
        recipes: recipes
    }
}

const makeCustomer = (id, name) =>{
    return {
        id: id,
        name: name
    }
}

const makeRecipe = (id, name, total, quantity) =>{
    return {
        id: id,
        name: name,
        total: total,
        quantity: quantity
    }
}
export const devOrders = [
    makeOrder(
        "#1",
        Date.now(),
        480,
        makeCustomer("c1", "Hanna Wilson"),
        [
            makeRecipe("r1", "Cookie", 10, 10),
            makeRecipe("r2", "Banana cake", 180, 1),
            makeRecipe("r3", "Cherry pie", 200, 1),
        ] ),

    makeOrder(
        "#2",
        Date.now(),
        300,
        makeCustomer("c2", "Bob Thornton"),
        [
            makeRecipe("r4", "Chocolate cookie", 12, 10),
            makeRecipe("r5", "Muffin", 20, 5),
            makeRecipe("r6", "Ginger cookie", 8, 10),
        ] ),

    makeOrder(
        "#3",
        Date.now(),
        240,
        makeCustomer("c3", "Jill Anderson"),
        [
            makeRecipe("r2", "Banana cake", 180, 1),
            makeRecipe("r5", "Muffin", 20, 5),
            makeRecipe("r4", "Chocolate cookie", 12, 5),
        ] ),

    makeOrder(
        "#4",
        Date.now(),
        440,
        makeCustomer("c4", "Eva Fender"),
        [
            makeRecipe("r3", "Cherry pie", 200, 2),
            makeRecipe("r5", "Muffin", 20, 2),
        ] )
]