import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDbClient = new DynamoDBClient();
const customersTable = "customers_by_tenant";
const ordersTable = "orders";

const makeCustomer = (name, phone_number, email_address,address, orders) => {
  return {
    name: name,
    phoneNumber: phone_number,
    email: email_address,
    address: address,
    orders: orders,
  };
};

const makeOrder = (email_address, id, due_date, total_cost) => {
  return {
    email: email_address,
    id: id,
    dueDate: due_date,
    totalCost: total_cost,
  };
};

export const handler = async (event, context) => {
  console.log(`event: ${JSON.stringify(event)}`);
  // console.log(`context: ${JSON.stringify(context)}`);
  try {
    // Fetch all customers from the customers table
    const queryCommandCustomers = new QueryCommand({
        TableName: customersTable,
        KeyConditionExpression: "seller_email = :email",
        ExpressionAttributeValues: {
            ":email": { S: event.context.email }
        }
    });
    const customersResponse = await dynamoDbClient.send(queryCommandCustomers);
    const customerItems = customersResponse.Items;
    console.log(`customerItems: ${JSON.stringify(customerItems)}`);

    // Fetch all orders from the orders table
    const queryCommandOrders = new QueryCommand({
        TableName: ordersTable,
        KeyConditionExpression: "seller_email = :email",
        ExpressionAttributeValues: {
            ":email": { S: event.context.email }
        }
    });
    const ordersResponse = await dynamoDbClient.send(queryCommandOrders);
    const orderItems = ordersResponse.Items;
    console.log(`orderItems: ${JSON.stringify(orderItems)}`);
    
    // Convert DynamoDB items to JSON using the unmarshall function for customers
    const customers = customerItems.map((item) => {
      const customerData = unmarshall(item);

      const name = customerData.name;
      const phoneNumber = customerData.phone_number;
      const email = customerData.email_address;
      const address = customerData.address;

      // Filter orders for the current customer
      const customerOrders = orderItems
        .filter((orderItem) => unmarshall(orderItem).buyer_email === email)
        .map((orderItem) => {
          const orderData = unmarshall(orderItem);
          
          const emailCustomer = orderData.buyer_email;
          const orderId = orderData.order_id;
          const dueDate = orderData.due_date.split('T')[0];
          const totalCost = orderData.order_price;

          return makeOrder(emailCustomer,orderId, dueDate, totalCost);
        });

      return makeCustomer(name, phoneNumber, email,address, customerOrders);
    });

    // Return the customers as the response
    return customers;
  } catch (error) {
    console.error("Error retrieving customer details:", error);
    throw error;
  }
};

