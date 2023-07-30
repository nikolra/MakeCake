import Cookies from "js-cookie";
import {CognitoJwtVerifier} from "aws-jwt-verify";

const validateToken = async (token: string | undefined, navigate: Function) => {
    if (!token) {
        navigate("/");
        return;
    }
    const verifier = CognitoJwtVerifier.create({
        userPoolId: "us-east-1_jMM7a1PJx",
        tokenUse: "id",
        clientId: "509f2sths1o41vc95ofrt5hfff"
    });
    try {
        const decodedToken = await verifier.verify(token);
        console.log("Token is valid. Payload:", decodedToken);
        // const currentTimestampInSeconds = Math.floor(Date.now() / 1000) - 60 * 5;
        // if(decodedToken.exp < currentTimestampInSeconds) {
        //     deleteToken(navigate);
        // }
        return `${decodedToken.given_name} ${decodedToken.family_name}`;
    } catch(e) {
        console.log("Token not valid!");
        console.log(e);
        deleteToken(navigate);
    }
}

const deleteToken = (navigate: Function) => {
    navigate("/");
    Cookies.remove('makecake-token');
}

export {
    validateToken
}