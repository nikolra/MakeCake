import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const user_email=event.context.email;
  const recipe_id=event.payload.recipe_id;
  console.log(user_email);
  console.log(recipe_id);

  const orderParams = {
    TableName: "recipes",
    Key: {
      user_email: { S: user_email },
      recipe_id: { S: recipe_id }
    }
  };

  try {
    const command = new DeleteItemCommand(orderParams);
    await dynamoDbClient.send(command);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        message: 'Failed to delete item in DynamoDB table',
        error: error.message,
      })
    };
  }
};
