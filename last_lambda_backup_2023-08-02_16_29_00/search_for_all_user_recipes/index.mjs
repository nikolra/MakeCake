import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

const tableName = "recipes";

export const handler = async (event) => {
  const user_email = event.context.email;
  //console.log(user_email);

  const params = {
    TableName: tableName,
    KeyConditionExpression: "user_email = :email",
    ExpressionAttributeValues: {
      ":email": { S: user_email }
    }
  };

  try {
    const recipesResponse = await dynamoDbClient.send(new QueryCommand(params));
    const recipesItems = recipesResponse.Items;
    const recipes = recipesItems.map(item => unmarshall(item));
    const responseBody = JSON.stringify(recipes);
    console.log(responseBody);
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'user_identifier',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: responseBody,
    };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'user_identifier',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify('Error fetching recipes: ' + error),
    };
  }
};
