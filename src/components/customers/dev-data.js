const makeCustomer = (name, phoneNumber, email) => {
    return {
        name: name,
        phoneNumber: phoneNumber,
        email: email
    }
}

export const devCustomers = [
    makeCustomer(
        "Nikol",
        123456,
        "123@123.com"
    ),

    makeCustomer(
        "Eden",
        123123,
        "123@123.com"
    ),

    makeCustomer(
        "Tomer",
        456456,
        "123@123.com"
    ),

    makeCustomer(
        "Amit",
        456123,
        "123@123.com"
    )
]