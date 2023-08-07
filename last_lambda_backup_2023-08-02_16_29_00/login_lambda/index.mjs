import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const COGNITO_USER_POOL_ID = "us-east-1_jMM7a1PJx";
const COGNITO_CLIENT_ID = "509f2sths1o41vc95ofrt5hfff";
const REGION = "us-east-1";

const client = new CognitoIdentityProviderClient({ region: REGION });

export const handler = async (event) => {
    const { email, password } = event;
    console.log("Email:", email);
    console.log("Password:", password);
    try {
    const initiateAuthCommand = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
        USERNAME: email,
        PASSWORD: password
        }
    });
    
    const response = await client.send(initiateAuthCommand);
    console.log(`response: ${JSON.stringify(response)}`);
    const accessToken = response.AuthenticationResult.AccessToken;
    const idToken = response.AuthenticationResult.IdToken;
    //return token;
    
    return {
        statusCode: 200,
        body: {accessToken, idToken}
    };
    
    } catch (error) {
    console.error("Error authenticating user:", error);
    return {
        statusCode: 500,
        body: "Error authenticating user"
    };
    }
};
