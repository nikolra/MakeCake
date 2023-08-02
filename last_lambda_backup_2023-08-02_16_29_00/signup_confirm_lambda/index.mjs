import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

const COGNITO_USER_POOL_ID = "us-east-1_jMM7a1PJx";
const COGNITO_CLIENT_ID = "509f2sths1o41vc95ofrt5hfff";
const REGION = "us-east-1";

const client = new CognitoIdentityProviderClient({ region: REGION });

export const handler = async (event) => {
  const { email, verificationCode } = event;
  console.log(email, verificationCode);

  try {
    const confirmCommand = new ConfirmSignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: verificationCode,
    });

    await client.send(confirmCommand);
    console.log('User confirmed successfully.');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User confirmed successfully' }),
    };
  } catch (error) {
    console.error('Error confirming user:', error);

    if (error.name === 'CodeMismatchException') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Incorrect verification code' }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error confirming user' }),
    };
  }
};
