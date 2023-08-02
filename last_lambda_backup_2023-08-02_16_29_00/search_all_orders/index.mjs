import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });


export const handler = async (event) => {
  const seller_email  = event.context.email;
  console.log(seller_email);
  const orderParams = {
    TableName: "orders",
    FilterExpression: "seller_email = :se",
    ExpressionAttributeValues: {
      ":se": { S: seller_email }
    }
  };

  try {
    const orders = await dynamoDbClient.send(new ScanCommand(orderParams));
    console.log(JSON.stringify(orders.Items));
    if (orders.Items.length === 0) {
      console.log(`No orders found for seller '${seller_email}'`);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'seller_email',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify(`No orders found for seller '${seller_email}'`),
      };
    }

    // Return the orders
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'seller_email',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify(orders.Items),
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'seller_email',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify('Error fetching orders: ' + error),
    };
  }
};
