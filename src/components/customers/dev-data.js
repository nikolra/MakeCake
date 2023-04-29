const makeCustomer = (name, phoneNumber, email, orders) => {
    return {
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        orders: orders
    }
}

const makeOrder = (id, dueDate, totalCost) => {
    return {
        id: id,
        dueDate: dueDate,
        totalCost: totalCost,
    }
}

export const devCustomers = [
    makeCustomer(
        "Nikol",
        123456,
        "123@123.com",
        [
            makeOrder(
                "#3",
                new Date().toISOString().split("T")[0],
                240
            ),
            makeOrder(
                "#1",
                new Date().toISOString().split("T")[0],
                480)
        ]
    ),

    makeCustomer(
        "Eden",
        123123,
        "123@123.com",
        [
            makeOrder(
                "#4",
                new Date().toISOString().split("T")[0],
                440
            ),
            makeOrder(
                "#3",
                new Date().toISOString().split("T")[0],
                240
            )
        ]
    ),

    makeCustomer(
        "Tomer",
        456456,
        "123@123.com",
        [
            makeOrder(
                "#2",
                new Date().toISOString().split("T")[0],
                300
            ),
            makeOrder(
                "#3",
                new Date().toISOString().split("T")[0],
                240
            )
        ]
    ),

    makeCustomer(
        "Amit",
        456123,
        "123@123.com",
        [
            makeOrder(
                "#1",
                new Date().toISOString().split("T")[0],
                480
            ),
            makeOrder(
                "#2",
                new Date().toISOString().split("T")[0],
                300
            )
        ]
    )
]