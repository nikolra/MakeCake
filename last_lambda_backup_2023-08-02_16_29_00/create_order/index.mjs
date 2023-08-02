import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient();
const table_name = "orders";


export const handler = async (event) => {
  console.log('1');
  console.log(event);
  const {order_id, buyer_email, due_date, recipes,order_price } = event.payload;
  const buyer_name=event.payload.buyer_name;
  const seller_email=event.context.email
  console.log(event);
    let orderItems = recipes.map(item => ({
    M: {
      "recipe_name": { S: item.recipe_name },
      "ingredients_min_cost": { N: item.ingredients_min_cost.toString() },
      "ingredients_avg_cost": { N: item.ingredients_avg_cost.toString() },
      "ingredients_max_cost": { N: item.ingredients_max_cost.toString() },
      "recipe_quantity": { N: item.recipe_quantity.toString() },
      "default_price": {N: item.default_price.toString() },
       "recipe_price": { N: item.recipe_price.toString() }
    }
  }));
    console.log(orderItems);
  
    let item = {
    "seller_email": { S: seller_email },
    "order_id": { S: order_id },
    "buyer_name": { S: buyer_name },
    "buyer_email": { S: buyer_email },
    "due_date": { S: due_date },
    "recipes": { L: orderItems },
    "order_price": { N:order_price.toString()}
  };
  console.log(item);
  
    //console.log(`order after adjustments ${item}`);
   const params = {
    TableName: table_name,
    Item: item
   };
   const command = new PutItemCommand(params);
   
   try {
    const response = await client.send(command);
    console.log(`Successfully created item in ${table_name} table`, response);
    return {
    statusCode: 200,
     headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
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
    },
    body: JSON.stringify({
      message: 'Failed to create item in DynamoDB table',
      error: error.message,
    }),
  }
}
};
