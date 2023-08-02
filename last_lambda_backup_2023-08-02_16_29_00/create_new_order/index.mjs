import { DynamoDBClient ,PutItemCommand  } from '@aws-sdk/client-dynamodb';
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });
const lambdaClient = new LambdaClient({ region: "us-east-1" })


export const handler = async (event) => {
  const { seller_email_adress, buyer_phone_number, recipe_name, recipe_price, recipe_quantity } = event;

  // Check if sizes are equal
  const areListsEqualLength = recipe_name.length === recipe_price.length && recipe_price.length === recipe_quantity.length;
  if (!areListsEqualLength)
  {
    console.log("Error: Sizes of recipe_name, recipe_price and recipe_quantity are not equal");
    throw new Error("Sizes of recipe_name, recipe_price and recipe_quantity are not equal");
  }
  console.log('passed size equal check');

  let triples = [];

  // Loop over recipes
  for(let i = 0; i < recipe_name.length; i++) {
    const params = {
      FunctionName: 'search_lambda_with_key_and_partition',
       Payload: JSON.stringify({
          table_name: "recipes",
          sort_key_name: "recipe_name",
          sort_key_value: recipe_name[i],
          partition_key_name: "user_identifier",
          partition_key_value: seller_email_adress
        })
    };
    triples.push({
      M:{
     recipe_name:{S:recipe_name[i]},
     recipe_price:{S:recipe_price[i]},
     recipe_quantity:{N:recipe_quantity[i]},
     },
    });
     console.log(params);
    try {
        
       const response = await lambdaClient.send(new InvokeCommand(params));
       const textDecoder = new TextDecoder();
       const responsePayload = JSON.parse(textDecoder.decode(response.Payload));
       console.log(responsePayload);
        if (!responsePayload) {
         throw new Error(`No item found for recipe_name=${recipe_name[i]}, user_identifier=${seller_email_adress}`);
        }
 
        console.log('Item exists:', responsePayload);
    } catch (error) {
     console.error('Error invoking Lambda function:', error);
     return;
    }
  }
      try {
        const putItemCommand = new PutItemCommand({
            TableName: "orders",
            Item: {
                seller_email_adress: { S: seller_email_adress },
                buyer_phone_number: { S: buyer_phone_number },
                recipes: { L: triples },
            },
        });
            console.log("trying to create new order")
            await dynamoDbClient.send(putItemCommand);
            console.log("order added")
        }
        catch (error)
        {
            console.error(`Error updating/creating order for customer '${buyer_phone_number}':`, error);
        }
};
                