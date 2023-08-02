import { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";

const COGNITO_USER_POOL_ID = "us-east-1_jMM7a1PJx";
const COGNITO_CLIENT_ID = "509f2sths1o41vc95ofrt5hfff";
const REGION = "us-east-1";

const client = new CognitoIdentityProviderClient({ region: REGION });

export const handler = async (event) => {
  const { email, verificationCode, newPassword } = event;
  console.log('email:', email);
  console.log('Password reset confirmed:', newPassword);

  try {
    const params = {
      ClientId: COGNITO_CLIENT_ID,
      ConfirmationCode: verificationCode,
      Password: newPassword,
      Username: email,
    };

    const command = new ConfirmForgotPasswordCommand(params);
    const response = await client.send(command);
    console.log('Password reset confirmed:', response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password reset confirmed' }),
    };
  } catch (error) {
    console.error('Error confirming password reset:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error confirming password reset' }),
    };
  }
};
