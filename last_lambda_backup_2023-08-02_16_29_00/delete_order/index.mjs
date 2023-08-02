import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const seller_email=event.context.email;
  const order_id=event.payload.order_id;
  console.log(seller_email);
  console.log(order_id);

  const orderParams = {
    TableName: "orders",
    Key: {
      seller_email : { S: seller_email },
      order_id: { S: order_id }
    }
  };

  try {
    const command = new DeleteItemCommand(orderParams);
    await dynamoDbClient.send(command);
    console.log(`Order for seller '${seller_email}' with the id '${order_id}' successfully deleted`);
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
    statusCode: 550,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type'

    },
    body: JSON.stringify({
      message: 'Failed to delete item in DynamoDB table',
      error: error.message,
    })
  }
  }
};