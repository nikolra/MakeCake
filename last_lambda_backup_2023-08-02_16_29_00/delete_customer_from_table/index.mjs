
import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient();
const table_name = "customers_by_tenant";

export const handler = async(event, context) => {
    /* input: code(str) output: success / error */
    console.log(`event: ${JSON.stringify(event)}`);
    // console.log(`context: ${JSON.stringify(context)}`);
    const seller_email=event.context.email;
    const email_address=event.payload.email_address;

    console.log(`INPUTS: email_address=${email_address}`);
    
    const params = {
        TableName: `${table_name}`,
        Key: {
            'email_address': { S: email_address },
            'seller_email': { S: seller_email }
        }
    };
    
    const command = new DeleteItemCommand(params);
    
    try {
        const response = await client.send(command);
        console.log(response);
        return response;
    }
    catch (err) {
        console.error(err);
        throw err;
    }

};

