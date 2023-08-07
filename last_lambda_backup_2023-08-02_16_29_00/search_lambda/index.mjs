import { DynamoDBClient, QueryCommand, GetItemCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient();

export const handler = async(event) => {
    /* input: table_name, field_name, value output: search results from the db */
    
    var { table_name, field_name, search_value } = event.payload; 
    if(field_name == "user_email") {
        search_value = event.context.email;
    }
    const index_name = field_name + "-index";
    
    console.log(`INPUTS: table_name=${table_name}, field_name=${field_name}, search_value=${search_value}`);
    
    const is_partition_key = await isPartitionKey(table_name, field_name);
    
    console.log(is_partition_key);
    
    if(is_partition_key === true) {
        //field_name is a partition-
        
        return getByPartitionKey(table_name, field_name, search_value);
    }
    else {
        //field_name is NOT a partition-key
        
        return getByKey(table_name, field_name, search_value);
    }
};


async function isPartitionKey(table_name, field_name) {
    const params = {
    TableName: table_name
    };

    try {
        const data = await client.send(new DescribeTableCommand(params));
        const partitionKey = data.Table.KeySchema.find((schema) => schema.KeyType === 'HASH');
        return partitionKey.AttributeName === field_name;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}


async function getByPartitionKey(table_name, field_name, search_value) {
    /* input: table_name, field_name(partition-key), value output: search results from the db */
    
    const params = {
        TableName: table_name,
        Key: {
            [field_name]: { S: search_value }
        }
    };

    const command = new GetItemCommand(params);

    try {
        const response = await client.send(command);
        const item = response.Item;
        return item ? unmarshall(item) : null;
    }
    catch (err) {
        console.error(err);
    }
}



async function getByKey(table_name, field_name, search_value) {
    /* input: table_name, field_name(NOT partition-key), value output: search results from the db */
    
    const index_name = field_name + "-index";
    
    const params = {
        TableName: 'mnl_ingredients',
        IndexName: `${index_name}`,
        KeyConditionExpression: '#attr = :val',
        ExpressionAttributeNames: {
          '#attr': field_name
        },
        ExpressionAttributeValues: {
            ':val': { S: search_value }
        }
    };

    const command = new QueryCommand(params);

    try {
        const response = await client.send(command);
        const items = response.Items; // assuming there is only one item with the given name
        console.log(items);
        return items.map(item => unmarshall(item));
    }
    catch (err) {
        console.error(err);
    }
}