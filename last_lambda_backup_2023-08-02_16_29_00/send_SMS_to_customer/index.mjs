import {DynamoDBClient, PutItemCommand, GetItemCommand} from "@aws-sdk/client-dynamodb";
import {SNSClient, PublishCommand} from "@aws-sdk/client-sns";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDbClient = new DynamoDBClient({region: "us-east-1"});
const snsClient = new SNSClient({region: "us-east-1"});

export const handler = async (event, context) => {
    // console.log(`event: ${JSON.stringify(event)}`);
    // console.log(`context: ${JSON.stringify(context)}`);
    const {customerEmailAddress, smsTemplateName, konditorEmail, } = event;
    const customer = await getCustomer(customerEmailAddress, konditorEmail);

    const smsTemplateMessage = await getSMSTemplateMessage(smsTemplateName, konditorEmail);
    const message = smsTemplateMessage.replace("{{name}}", customer.name);
    try {
        await snsClient.send(new PublishCommand({
            PhoneNumber: customer.phone_number,
            Message: message
        }));
        return {statusCode: 200, body: "SMS sent successfully! Message: " + message};
    } catch (error) {
        console.error("Error sending SMS:", error);
        return {statusCode: 500, body: "Internal server error"};
    }
};

async function getCustomer(customerEmailAddress, seller_email) {
    const params = {
        TableName: "customers_by_tenant",
        Key: {
            email_address: {S: customerEmailAddress},
            seller_email: { S: seller_email }
        }
    };
    try {
        const data = await dynamoDbClient.send(new GetItemCommand(params));
        console.log(`Data: ${JSON.stringify(data)}`);
        return unmarshall(data.Item);
    } catch (error) {
        console.error("Error retrieving customer data:", error);
        throw error;
    }
}

async function getSMSTemplateMessage(smsTemplateName, konditorEmail) {
    const params = {
        TableName: "SMS_template",
        Key: {
            template_Name: {S: smsTemplateName},
            konditor_email: {S: konditorEmail}
        }
    };
    console.log(`params:${JSON.stringify(params)}`);
    try {
        const data = await dynamoDbClient.send(new GetItemCommand(params));
        if (!data.Item || !data.Item.template_message) {
            throw new Error(`Template message not found for template '${smsTemplateName}'`);
        }
        return data.Item.template_message.S;
    } catch (error) {
        console.error("Error retrieving SMS template message:", error);
        throw error;
    }
}

