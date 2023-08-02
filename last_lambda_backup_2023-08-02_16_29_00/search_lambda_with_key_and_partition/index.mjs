import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient();

export const handler = async (event) => {
  const { table_name, partition_key_name, partition_key_value ,sort_key_name,sort_key_value} = event;

  console.log(`INPUTS: table_name=${table_name}, partion key=${partition_key_name}, partion key value=${partition_key_value}, sort key name=${sort_key_name}, sort key value=${sort_key_value}`);

  const params = {
    TableName: table_name,
    Key: {
      [partition_key_name]: { S: partition_key_value },
      [sort_key_name]: { S: sort_key_value }
    }
  };

  console.log('Querying DynamoDB with parameters:', params);

  const command = new GetItemCommand(params);

  try {
    const response = await client.send(command);
    const item = response.Item;
    console.log('Query results:', item);
    return item;
  } catch (err) {
    console.error('Error querying DynamoDB:', err);
    return err;
  }
};