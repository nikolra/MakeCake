import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient();
const table_name = "mnl_ingredients";

export const handler = async(event) => {
    /* input: code(str) output: success / error */
    
    const { code } = event.payload; 

    console.log(`INPUTS: code=${code}`);
    
    const params = {
        TableName: `${table_name}`,
        Key: {
            'code': { S: code }
        }
    };
    
    const command = new DeleteItemCommand(params);
    
    try {
        const response = await client.send(command);
        console.log(response);
        return {
            status: 200,
            data: response
            };
    }
    catch (err) {
        console.error(err);
        return {
            status: 500,
            data: err
        };
    }

};

