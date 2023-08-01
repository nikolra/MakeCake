import Cookies from 'js-cookie';

const validateToken = (token: string | undefined, navigate: Function) => {
    if (!token) {
        navigate("/");
    }
}

export const deleteToken = () => {
    Cookies.remove('makecake-token');
}

export {
    validateToken
}