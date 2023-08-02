import { CognitoIdentityProviderClient, ChangePasswordCommand } from "@aws-sdk/client-cognito-identity-provider";

const COGNITO_USER_POOL_ID = "us-east-1_jMM7a1PJx";
const COGNITO_CLIENT_ID = "509f2sths1o41vc95ofrt5hfff";
const REGION = "us-east-1";

const client = new CognitoIdentityProviderClient({ region: REGION });

export const handler = async (event) => {
  const { PreviousPassword, ProposedPassword, AccessToken } = event;
  console.log("PreviousPassword:", PreviousPassword);
  console.log("ProposedPassword:", ProposedPassword);
  try {
    const params = {
      PreviousPassword: PreviousPassword,
      ProposedPassword: ProposedPassword,
      AccessToken: AccessToken
    };

    const command = new ChangePasswordCommand(params);
    const response = await client.send(command);
    console.log('Password reset confirmed:', response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'password changed' }),
    };
  } catch (error) {
    console.error('Error changing password:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error changing password' }),
    };
  }
};
