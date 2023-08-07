import { CognitoIdentityProviderClient, ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";

const COGNITO_USER_POOL_ID = "us-east-1_jMM7a1PJx";
const COGNITO_CLIENT_ID = "509f2sths1o41vc95ofrt5hfff";
const REGION = "us-east-1";

const client = new CognitoIdentityProviderClient({ region: REGION });

export const handler = async (event) => {
  const { email} = event;

  try {
    const params = {
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
    };
    const command = new ForgotPasswordCommand(params);
    const response = await client.send(command);
    console.log('Reset mail sent:', response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password reset mail sent' }),
    };
    
  } catch (error) {
    console.error('Error sending reset mail:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error sending reset mail' }),
    };
  }
};
