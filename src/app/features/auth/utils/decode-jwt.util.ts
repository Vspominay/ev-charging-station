import { TDecodedToken } from '@features/auth/data-access/models/decoded-token.type';

function base64UrlDecode(str: string) {
  // Replace URL-safe characters and add padding
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (str.length % 4) {
    case 0:
      break;
    case 2:
      str += '==';
      break;
    case 3:
      str += '=';
      break;
    default:
      throw new Error('Invalid base64 string');
  }

  // Decode Base64
  const decodedString = atob(str);
  // Convert string to Uint8Array
  const bytes = new Uint8Array(decodedString.length);
  for (let i = 0; i < decodedString.length; ++i) {
    bytes[i] = decodedString.charCodeAt(i);
  }
  // Decode UTF-8
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

export const decodeJWT = (token: string): TDecodedToken => {
  const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');
  const payloadJson = base64UrlDecode(payloadEncoded);

  return JSON.parse(payloadJson);
};

