import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient();
const table_name = "mnl_ingredients";

export const handler = async (event) => {
  /* input: code(num), name(str), price(num), user_email(str) output: success / error */
  const { code, name, min_price, min_store, max_price, max_store } = event.payload;
  
  let avg_price = (parseFloat(min_price) + parseFloat(max_price)) / 2;
  avg_price = avg_price.toFixed(2);

  console.log(`INPUTS: email=${event.context.email}, code=${code}, name=${name}, avg_price=${avg_price}, min_price=${min_price}, min_store=${min_store}, max_price=${max_price}, max_store=${max_store}`);

  const item = {
    "code": { S: `${code}` },
    "name": { S: `${name}` },
    "avg_price": { N: `${avg_price.toString()}` },
    "min_price": { N: `${min_price}` },
    "min_store": { S: `${min_store}` },
    "max_price": { N: `${max_price}` },
    "max_store": { S: `${max_store}` },
    "user_email": { S: `${event.context.email}` },
    "is_menual": { S: "true" }
  };

  const params = {
    TableName: table_name,
    Item: item,
    ConditionExpression: 'attribute_not_exists(code)', // make sure code does not already exist
  };

  const command = new PutItemCommand(params);

  try {
    const response = await client.send(command);
    console.log(`Successfully created item in ${table_name} table`, response);
    return response;
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      console.error(`Item with code ${code} already exists`, err);
      throw err;
    } else {
      console.error(`Error creating item in ${table_name} table`, err);
      throw err;
    }
  }
};
