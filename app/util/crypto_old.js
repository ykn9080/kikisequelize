const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const ENCRYPTION_KEY = process.env.key; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

exports.encrypt = (message) => {
  const cipher = crypto.createCipher(
    algorithm,
    process.env.key,
    Buffer.alloc(IV_LENGTH)
  );
  var encrypted = cipher.update(message, "utf8", "base64");
  encrypted = encrypted + cipher.final("base64");
  return encrypted;
};
exports.decrypt = (encrypted) => {
  const decipher = crypto.createDecipher(
    algorithm,
    process.env.key,
    Buffer.alloc(IV_LENGTH)
  );
  if (!encrypted) encrypted = global.encdata;

  var decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted = decrypted + decipher.final("utf8");
  return decrypted;
};
