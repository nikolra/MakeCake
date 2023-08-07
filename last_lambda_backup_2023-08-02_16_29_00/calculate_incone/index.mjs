import { DynamoDBClient ,QueryCommand  } from '@aws-sdk/client-dynamodb';
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
    console.log(`event: ${JSON.stringify(event)}`);

    const {payload, context} = event; 
    const { rangeString,} = payload;
    console.log(`rangeString: ${rangeString}`);
    const params = {
        TableName: "orders",
        KeyConditionExpression: "seller_email = :email",
        ExpressionAttributeValues: {
            ":email": { S: context.email }
        }
    };
    try {
        const ordersResponse = await dynamoDbClient.send(new QueryCommand(params));
        const orderItems = ordersResponse.Items;
        console.log(JSON.stringify(orderItems));
        const orders = orderItems.map(order => unmarshall(order));
        console.log(JSON.stringify(orders));
        return funcMap[rangeString](orders);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
    }
    // throw new Error('Something went wrong');
};

const getWeekIncome = (orders) => {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const res = {
        x: [0,0,0,0,0,0,0],//amounts
        y: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] //dates
    };
    orders.forEach(order => {
        console.log(`received order id: ${order.order_id}, order due date: ${order.due_date}`);
        const dueDate = new Date(order.due_date);
        // Check if the order's due date falls within the current week
        if (
            dueDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDayOfWeek + 1)) && // Due date is not in the past
            dueDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDayOfWeek)) // Due date is within the current week
        ) {
            // Get the day of the week for the order's due date
            const dayOfWeek = dueDate.getDay();
            console.log(`order id: ${order.order_id} added ${order.order_price} to income total`);
            // Add the order's cost to the income for that day
            res.x[dayOfWeek] += order.order_price;
        }
    });
    return res;
};

const getMonthIncome = (orders) => {
    const res = {
        x: [0,0,0,0,0],//amounts
        y: ["week 1","week 2","week 3","week 4","week 5"] //dates
       
    };
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    orders.forEach(order => {    
        console.log(`received order id: ${order.order_id}, order due date: ${order.due_date}`);
        const dueDateMonth = new Date(order.due_date).getMonth();
        const dueDateYear = new Date(order.due_date).getFullYear();
        const dueDateDay = new Date(order.due_date).getDate();
        if (currentYear === dueDateYear && currentMonth === dueDateMonth) {
            console.log(`order id: ${order.order_id} added ${order.order_price} to income total`);
            res.x[dueDateDay % 5] += order.order_price;
        }
    });
    
    return res;
    
};

const getYearIncome = (orders) => {
    const res = {
        x: [0,0,0,0,0,0,0,0,0,0,0,0],
        y: ["January","February","March","April","May","June","July","August","September","October","November","December" ]
    };
    const currentYear = new Date().getFullYear();
    orders.forEach(order => {    
        console.log(`received order id: ${order.order_id}, order due date: ${order.due_date}`);
        const dueDateMonth = new Date(order.due_date).getMonth();
        const dueDateYear = new Date(order.due_date).getFullYear();
        if (currentYear === dueDateYear) {
            console.log(`order id: ${order.order_id} added ${order.order_price} to income total`);
            res.x[dueDateMonth] += order.order_price;
        }
    });
    
    return res;

};

const funcMap = {
    "Week": getWeekIncome,
    "Month": getMonthIncome,
    "Year": getYearIncome
};