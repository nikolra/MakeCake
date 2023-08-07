import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

export async function handler(event) {
  const seller_email = event.context.email;
  console.log(seller_email);

  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 30);

  const sixDaysAgoString = sixDaysAgo.toISOString().split('T')[0];

  const params = {
    TableName: 'orders',
    FilterExpression: 'seller_email = :se AND due_date >= :dd',
    ExpressionAttributeValues: {
      ':se': { S: seller_email },
      ':dd': { S: sixDaysAgoString }
    }
  };

  try {
    const data = await dynamoDbClient.send(new ScanCommand(params));
    const Items = data.Items;
    console.log(Items);

    if (Items.length === 0) {
      console.log(`No orders found for seller '${seller_email}' in the last week`);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'seller_email',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify(`No orders found for seller '${seller_email}' in the last week`),
      };
    }

    // Count orders for each buyer
    const buyerCounts = Items.reduce((counts, item) => {
      counts[item.buyer_email.S] = (counts[item.buyer_email.S] || 0) + 1;
      return counts;
    }, {});

    // Sort buyers by order count and take the top X buyers
    const topBuyers = Object.entries(buyerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, count]) => ({ email, count }));

    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'seller_email',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify(topBuyers),
    };

  } catch (error) {
    console.error(error);
    return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'seller_email',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        },
        body: JSON.stringify('Error fetching data from DynamoDB'),
    };
  }
};
