import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });
const tableName = "recipes";

export const handler = async (event) => {

const user_email = event.context.email;
const recipe_id = event.payload.recipe_id;

  const params = {
    TableName: tableName,
    KeyConditionExpression: "user_email = :user_email AND recipe_id = :recipe_id",
    ExpressionAttributeValues: {
      ":user_email": { S: user_email },
      ":recipe_id": { S: recipe_id },
    }
  };

  try {
    const recipes = await dynamoDbClient.send(new QueryCommand(params));
    const unmarshalledRecipes = recipes.Items.map(item => unmarshall(item)); // Unmarshal the returned items


    if (unmarshalledRecipes.length === 0) {
      console.log(`No orders found for seller '${user_email}'`);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'seller_email',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify(`order not found for seller '${user_email}'`),
      };
    }
    console.log(unmarshalledRecipes);

    // Return the orders
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'seller_email',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify(unmarshalledRecipes), // Return unmarshalled items
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'seller_email',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify('Error fetching orders: ' + error),
    };
  }
};
