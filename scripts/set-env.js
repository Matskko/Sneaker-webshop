const fs = require('fs');
const path = require('path');

// Get the environment variables
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

// Create the environment file content
const envFileContent = `
export const environment = {
  production: true,
  googleMapsApiKey: '${googleMapsApiKey}'
};
`;

// Write the file to the environment path
const envFilePath = path.resolve(__dirname, '../src/environments/environment.prod.ts');
fs.writeFileSync(envFilePath, envFileContent);

console.log('Environment file generated successfully!'); 