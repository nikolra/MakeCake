import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const { smsTemplateName,konditorEmail, smsTemplateMessage } = event;
console.log(`Event: ${JSON.stringify(event)}`);
  const params = {
    TableName: "SMS_template",
    Item: {
      template_Name: { S: smsTemplateName },
      konditor_email: {S: konditorEmail},
      template_message: { S: smsTemplateMessage },
    },
  };

  try {
    await dynamoDbClient.send(new PutItemCommand(params));
    return { statusCode: 200, body: "SMS template added successfully!" };
  } catch (error) {
    console.error("Error adding SMS template:", error);
    return { statusCode: 500, body: "Internal server error" };
  }
};

