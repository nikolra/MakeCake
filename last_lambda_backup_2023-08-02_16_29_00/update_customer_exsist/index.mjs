import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();
const tableName = "customers_by_tenant";

export const handler = async (event, context) => {
  // console.log(`event: ${JSON.stringify(event)}`);
  // console.log(`context: ${JSON.stringify(context)}`);
  const { email_address, name, phone_number, address, seller_email } = event;

  let updateExpression = "SET #n = :name, #p = :phone_number";
  const expressionAttributeNames = {
    "#n": "name",
    "#p": "phone_number",
  };
  const expressionAttributeValues = {
    ":name": { S: name },
    ":phone_number": { S: phone_number },
  };
  if (address) {
    updateExpression += ", #a = :address";
    expressionAttributeNames["#a"] = "address";
    expressionAttributeValues[":address"] = { S: address };
  }
  const params = {
    TableName: tableName,
    Key: {
      seller_email: {S: seller_email},
      email_address: { S: email_address },
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const command = new UpdateItemCommand(params);

  try {
    const response = await client.send(command);
    console.log(`Successfully updated customer with email ${email_address}`, response);
    return {
      statusCode: 200,
      body: JSON.stringify(response.Attributes),
    };
  } catch (err) {
    console.error(`Error updating customer with email ${email_address}`, err);
    throw err;
  }
};
