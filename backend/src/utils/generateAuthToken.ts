// Import the jsonwebtoken library to create and verify JWT tokens
import jwt from 'jsonwebtoken';

// Define a User interface to specify the expected shape of the user object
interface User {
  _id: string;
  name: string;
  email: string;
}

/**
 * Generates a JSON Web Token (JWT) for the given user
 * @param user - The user object containing id, name, and email
 * @returns A signed JWT as a string
 */
const generateAuthToken = (user: User): string => {
  // Retrieve the secret key from environment variables
  const jwtSecretKey = process.env.JWT_KEY;

  // Throw an error if the secret key is not set (prevents generating an invalid token)
  if (!jwtSecretKey) {
    throw new Error('JWT_KEY is not defined in environment variables');
  }

  // Create a JWT token containing user information as payload
  // This token is signed with the secret key for security
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    jwtSecretKey
  );

  // Return the generated token so it can be sent back to the client or used elsewhere
  return token;
};

// Export the function so it can be imported and used in other files
export default generateAuthToken;
