import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";

const COGNITO_USER_POOL_ID = "us-east-1_jMM7a1PJx";
const REGION = "us-east-1";

const cognito = new CognitoIdentityProvider({ region: REGION });

export const handler = async (event) => {
  const { accessToken } = event.payload;
  console.log(accessToken.slice(0, 6));
  try {
    const params = {
      AccessToken: accessToken
    };

    // Get user information
    const response = await cognito.getUser(params);
    // Extract and format user attributes
    const given_name = response.UserAttributes.find(attr => attr.Name === "family_name").Value;
    const last_name = response.UserAttributes.find(attr => attr.Name === "given_name").Value;
    const user = {
      username: `${last_name} ${given_name}`,
      email: response.UserAttributes.find(attr => attr.Name === "email").Value,
      // Add any other relevant user attributes you need
    };
    

    console.log('Current user:', user.username);
    console.log('Email:', user.email);

    return {
      statusCode: 200,
      body: user
    };
  } catch (error) {
    console.error('Error getting current user:', error);

    return {
      statusCode: 500,
      body: { error: 'Error getting current user' }
    };
  }
};
