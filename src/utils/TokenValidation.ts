const validateToken = (token: string | undefined, navigate: Function) => {
    if (!token) {
        navigate("/");
    }
}

export {
    validateToken
}