import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient();
const table_name = "mnl_ingredients";

export const handler = async(event) => {
    /* input: code(str), new_name(str), new_price(num), user_email(str) output: success / error */
    
    const { code, new_name, new_min_price, new_min_store, new_max_price, new_max_store } = event.payload;

    console.log(`INPUTS: code=${code}, new_name=${new_name}, 
        new_min_price=${new_min_price}, new_min_store=${new_min_store}, new_max_price=${new_max_price}, new_max_store=${new_max_store}`);
        
    let new_avg_price = (parseFloat(new_min_price) + parseFloat(new_max_price)) / 2;
    new_avg_price = new_avg_price.toFixed(2);
    
    console.log(new_avg_price);
    const params = {
        TableName: `${table_name}`,
        Key: {
            'code': { S: `${code}` }
        },
        UpdateExpression: 'SET #name = :new_name, #avg_price = :new_avg_price, #min_price = :new_min_price, #min_store = :new_min_store, #max_price = :new_max_price, #max_store = :new_max_store',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#avg_price': 'avg_price',
            '#min_price': 'min_price',
            '#min_store': 'min_store',
            '#max_price': 'max_price',
            '#max_store': 'max_store'
        },
        ExpressionAttributeValues: {
            ':new_name': { S: new_name },
            ':new_avg_price': { N: `${new_avg_price.toString()}` },
            ':new_min_price': { N: `${new_min_price}` },
            ':new_min_store': { S: `${new_min_store}` },
            ':new_max_price': { N: `${new_max_price}` },
            ':new_max_store': { S: `${new_max_store}` }
        }
    };
    
    const command = new UpdateItemCommand(params);
    
    try {
        const response = await client.send(command);
        console.log(response);
        return response;
    }
    catch (err) {
        console.error(err);
        return err;
    }

};

