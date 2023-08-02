import Cookies from 'js-cookie';

const validateToken = (token: string | undefined, navigate: Function) => {
    if (!token) {
        navigate("/");
        return false;
    }
    return true;
}

export const deleteToken = () => {
    Cookies.remove('makecake-token');
    Cookies.remove('makecake-accessToken');
}

export {
    validateToken
}