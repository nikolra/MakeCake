import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient();
const table_name = "recipes";


export const handler = async (event) => {
  console.log(JSON.stringify(event));
  console.log(`1`);
  const recipe_id=event.payload.recipe_id;
  const recipe_name=event.payload.recipe_name;
  const recipe_price=event.payload.recipe_price;
  const ingredients=event.payload.ingredients;
  const ingredients_min_cost=event.payload.ingredients_min_cost;
  const ingredients_avg_cost=event.payload.ingredients_avg_cost;
  const ingredients_max_cost=event.payload.ingredients_max_cost;

  console.log(recipe_id);
  console.log(recipe_name);
  console.log(recipe_price);
  console.log(ingredients_min_cost);
  console.log(ingredients_avg_cost);
  console.log(ingredients_max_cost);
  console.log(ingredients);
  const user_email=event.context.email;
  console.log(user_email);
    let item = {
    "user_email": { S: user_email },
    "recipe_id": { S: recipe_id },
    "recipe_name": { S: recipe_name },
    "recipe_price": { N: recipe_price.toString() },
    "ingredients_min_cost":{ N:ingredients_min_cost.toString()},
    "ingredients_avg_cost":{ N:ingredients_avg_cost.toString()},
    "ingredients_max_cost":{ N:ingredients_max_cost.toString()},
    "ingredients": { L: ingredients.map((ingredient) => ({
      M: {
        "ingredient_name": { S: ingredient.ingredient_name },
        "ingredient_code": { S: ingredient.ingredient_code },
        "minCost": { N: ingredient.minCost.toString() },
        "avgCost": { N: ingredient.avgCost.toString() },
        "maxCost": { N: ingredient.maxCost.toString() },
        "quantity": { N: ingredient.quantity.toString() },
        "measurement_unit": { S : ingredient.measurement_unit },
        "automated": { BOOL: ingredient.automated },
      }, 
    }))},
  };
console.log(`2`);
   const params = {
    TableName: table_name,
    Item: item
   };
   const command = new PutItemCommand(params);
   console.log(`3`);
   try {
    const response = await client.send(command);
    console.log(`Successfully created item in ${table_name} table`, response);
    console.log(`4`);
    return {
    statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type'
  },
  body: JSON.stringify(response),
};
   }
catch(error)
{
  console.error(`Error creating item in ${table_name} table`, error);
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify({
      message: 'Failed to create item in DynamoDB table',
      error: error.message,
      eventData: JSON.stringify('test'),
    }),
  }
}
};
