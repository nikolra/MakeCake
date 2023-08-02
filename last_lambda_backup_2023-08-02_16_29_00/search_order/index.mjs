import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {

const seller_email = event.context.email;
const order_id = event.payload.order_id;
console.log(seller_email);
console.log(order_id);

  // Check if the order exists first
  const orderParams = {
    TableName: "orders",
    KeyConditionExpression: "seller_email = :seller_email AND order_id = :order_id",
    ExpressionAttributeValues: marshall({
      ":seller_email": seller_email,
      ":order_id": order_id
    })
  };
  
   try {
    const order = await dynamoDbClient.send(new QueryCommand(orderParams));
    const unmarshalledOrder = order.Items.map(item => unmarshall(item)); // Unmarshal the returned items

    if (unmarshalledOrder.length === 0) {
      console.log(`No orders found for seller '${seller_email}'`);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'seller_email',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify(`order not found for seller '${seller_email}'`),
      };
    }
    console.log(unmarshalledOrder);

    // Return the orders
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'seller_email',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify(unmarshalledOrder), // Return unmarshalled items
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
