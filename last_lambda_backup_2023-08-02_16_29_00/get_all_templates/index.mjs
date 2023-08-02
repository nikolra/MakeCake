import { DynamoDBClient, QueryCommand } from"@aws-sdk/client-dynamodb"; 
const dynamoDbClient = new DynamoDBClient();
//const smsTemplateTable = "SMS_template";

export const handler = async (event) => {
  console.log(`event: ${JSON.stringify(event)}`);
  const Email=event.context.email;
    const params = {
    TableName: "SMS_template",
    KeyConditionExpression: "konditor_email = :email",
    ExpressionAttributeValues: {
      ":email": { S: Email }
    }
  };
  try {
    const data = await dynamoDbClient.send(new QueryCommand(params));
    console.log(`data ${data}`);
    if (data.Count===0) {
      console.log(`SMS templates not found for ${Email}`);
      return [];
    }
  
    const templateNames = data.Items.map(item=>item.template_Name.S);
    console.log(`templateNames ${templateNames}`);
    return templateNames;
  } catch (error) {
    console.error("Error retrieving SMS templates:", error);
    throw error;
  }

};


