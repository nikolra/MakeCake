import {DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {SNSClient, CreateSMSSandboxPhoneNumberCommand} from "@aws-sdk/client-sns";

const snsClient = new SNSClient({region: "us-east"});
const client = new DynamoDBClient();
const table_name = "customers_by_tenant";

export const handler = async (event, context) => {
    // console.log(`event: ${JSON.stringify(event)}`);
    // console.log(`context: ${JSON.stringify(context)}`);
    const seller_email=event.context.email;
    const name=event.payload.name;
    const phone_number=event.payload.phone_number;
    const address=event.payload.address;
    const email_address=event.payload.email_address;
    console.log(seller_email);
    console.log(name);
    console.log(phone_number);
    console.log(address);
    console.log(email_address);
    
    
    let item;
    if (address) {
        item = {
            "seller_email": {S: `${seller_email}`},
            "name": {S: `${name}`},
            "phone_number": {S: `${phone_number}`},
            "email_address": {S: `${email_address}`},
            "address": {S: `${address}`}
        };
    } else {
        item = {
            "seller_email": {S: `${seller_email}`},
            "name": {S: `${name}`},
            "phone_number": {S: `${phone_number}`},
            "email_address": {S: `${email_address}`}
        };
    }
    const params = {
        TableName: table_name,
        Item: item,
        ConditionExpression: 'attribute_not_exists(email_address)', // make sure email_address does not already exist
    };

    const command = new PutItemCommand(params);

    try {
        const response = await client.send(command);
        console.log(`Successfully created item in ${table_name} table`, response);
        // const res = await addNewCustomerToSNS(phone_number);
        return {
            statusCode: 202,
            body: response
        };
    } catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            console.error(`Item with email_address ${email_address} already exists`, err);
            return {
                statusCode: 400,
                body: JSON.stringify({message: `Item with email_address ${email_address} already exists`})
            };
        } else {
            console.error(`Error creating item in ${table_name} table`, err);
            throw err;
        }
    }
};

async function addNewCustomerToSNS(phone_number) {
    const params = {
        PhoneNumber: phone_number
    };
    const command = new CreateSMSSandboxPhoneNumberCommand(params);
    try {
        const data = await snsClient.send(command);
        console.log(data);
        console.log(`Phone number ${phone_number} has been added to the SMS Sandbox.`);
    } catch (error) {
        console.error(`Error SNS: ${error}`);
    }
}