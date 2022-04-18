var crypto = require("crypto");

const algorithm = "aes-256-cbc";
const ENCRYPTION_KEY = process.env.key; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

exports.encrypt = (text) => {
  let key = Buffer.alloc(KEY_LENGTH);
  let iv = Buffer.alloc(IV_LENGTH);
  let temp = Buffer.from(ENCRYPTION_KEY);
  temp.copy(key);
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf-8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

exports.decrypt = (text) => {
  let key = Buffer.alloc(KEY_LENGTH);
  let iv = Buffer.alloc(IV_LENGTH);
  let temp = Buffer.from(ENCRYPTION_KEY);
  temp.copy(key);
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(text, "base64", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};
