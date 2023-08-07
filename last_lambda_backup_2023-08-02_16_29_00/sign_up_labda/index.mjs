import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

const COGNITO_USER_POOL_ID = "us-east-1_jMM7a1PJx";
const COGNITO_CLIENT_ID = "509f2sths1o41vc95ofrt5hfff";
const REGION = "us-east-1";

const client = new CognitoIdentityProviderClient({ region: REGION });

export const handler = async (event) => {
    const { email, phone_num, given_name, family_name, repeat_password, password } = event;
    console.log( email, phone_num, given_name, family_name, repeat_password, password);
    
    if (password !== repeat_password) {
        console.error("Passwords do not match.");
        throw new Error("Passwords do not match.");
    }
    
    try {
        const command = new SignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
        { Name: 'given_name', Value: given_name },
        { Name: 'family_name', Value: family_name },
        { Name: 'email', Value: email },
        { Name: 'phone_number', Value: phone_num }
        ]
        });
  
    const response = await client.send(command);
    console.log('User sign-up successful:', response);
    
    return response;
    
    } catch (error) {
        console.error('Error signing up user:', error);
        throw error;
    }
};
