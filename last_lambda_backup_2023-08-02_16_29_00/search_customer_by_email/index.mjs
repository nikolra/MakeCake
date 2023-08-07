import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient();

export const handler = async(event, context) => {
  // console.log(`event: ${JSON.stringify(event)}`);
  // console.log(`context: ${JSON.stringify(context)}`);
  const {seller_email, email_address} = event;
  const tableName = "customers_by_tenant";

  const params = {
    TableName: tableName,
    KeyConditionExpression: "seller_email = :seller_email AND email_address = :email_address",
    ExpressionAttributeValues: {
      ":email_address": { S: email_address },
      ":seller_email": { S: seller_email },
    },
  };

  try {
    const command = new QueryCommand(params);
    const data = await client.send(command);
    return data.Items;
  } catch (err) {
    console.error(err);
    throw err;
  }
};