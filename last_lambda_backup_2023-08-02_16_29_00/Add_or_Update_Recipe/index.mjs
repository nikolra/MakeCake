import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
const dynamoDbClient = new DynamoDBClient();

export const handler = async (event) => {
    const { user_identifier_input, recipe_name_input, ingredient_names_input, quantities_input,recipe_price } = event;
    const new_ingredients_list_map = [];
    
    for (let i = 0; i < ingredient_names_input.length; i++) {
        const ingredientName = ingredient_names_input[i];
        let manual=false;
        try {
            const manualGetItemCommand = new GetItemCommand({
                TableName: "manual_ingredients",
                Key: {
                    user_email: { S: user_identifier_input },
                    ingredients_name: { S: ingredientName },
                },
            });
            const { Item } = await dynamoDbClient.send(manualGetItemCommand);
            if (Item) {
                new_ingredients_list_map.push({
                    M: {
                        ingredient_code: { S: "" },
                        ingredient_name: { S: ingredientName },
                        ingredient_price: Item.price,
                        is_automated_ingredient: { S: "false" },
                        quantity: { S: quantities_input[i].toString() },
                    },
                });
                manual=true;
                console.log(`Ingredient '${ingredientName}' found in manual_ingredients table.`);
            } 
        }
        catch(error)
        {
        }
        if(!manual)
        {
            try{
                const automatedGetItemCommand = new GetItemCommand({
                    TableName: "automated_ingredients",
                    Key: {
                        ingredient_name: { S: ingredientName },
                    },
                });
                const { Item: automatedItem } = await dynamoDbClient.send(automatedGetItemCommand);
                if (automatedItem) {
                    new_ingredients_list_map.push({
                        M: {
                            ingredient_code: automatedItem.ingredient_code,
                            ingredient_name: { S: ingredientName },
                            is_automated_ingredient: { S: "true" },
                            ingredient_price: automatedItem.ingredient_price,
                            quantity: { S: quantities_input[i].toString() },
                        },
                    });
                    console.log(`Ingredient '${ingredientName}' found in automated_ingredients table.`);
                } else {
                    console.log(`Ingredient '${ingredientName}' not found in any table.`);
                    return;
                }
             }
              catch (error) 
              {
                 console.error(`Error getting ingredient '${ingredientName}':`, error)
              }
      }
    }

    try {
        const getItemCommand = new GetItemCommand({
            TableName: "recipes",
            Key: {
                user_identifier: { S: user_identifier_input },
                recipe_name: { S: recipe_name_input },
            },
        });
        const { Item } = await dynamoDbClient.send(getItemCommand);
        if (Item) {
            const updateItemCommand = new UpdateItemCommand({
                TableName: "recipes",
                Key: {
                    user_identifier: { S: user_identifier_input },
                    recipe_name: { S: recipe_name_input },
                    recipe_price: {N: recipe_price}
                },
                UpdateExpression: "set ingredients = :ingredients",
                ExpressionAttributeValues: {
                    ":ingredients": { L: new_ingredients_list_map },
                },
            });
            await dynamoDbClient.send(updateItemCommand);
        }
    } catch (error) {
        console.log("recipe not exist, trying to add new item");
    }
    try {
        //console.log(JSON.stringify(new_ingredients_list_map));
        const putItemCommand = new PutItemCommand({
            TableName: "recipes",
            Item: {
                user_identifier: { S: user_identifier_input },
                recipe_name: { S: recipe_name_input },
                ingredients: { L: new_ingredients_list_map },
                recipe_price:{N:recipe_price}
            },
        });
            console.log("trying to add the recipe now")
            await dynamoDbClient.send(putItemCommand);
            console.log("recipe added")
        }
        catch (error)
        {
            console.error(`Error updating/creating recipe '${recipe_name_input}':`, error);
        }
};