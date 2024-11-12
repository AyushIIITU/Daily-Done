// const crypto = require('crypto');
const crypto=require('node:crypto');

const algorithm = 'aes-256-cbc'; // AES algorithm
const iterations = 10000; // Number of iterations for PBKDF2
const keyLength = 32; // Key length in bytes (256 bits)
const digest = 'sha256'; // Hashing algorithm

// Function to derive a key from a password
function deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest);
}

// Function to encrypt data
function encryptData(data, password) {
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
    const key = deriveKey(password, salt);
    const iv = crypto.randomBytes(16); // Generate a random IV
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
        salt,
        iv: iv.toString('hex'),
        encryptedData: encrypted
    };
}

// Function to decrypt data
function decryptData(encryptedData, password, salt, iv) {
    const key = deriveKey(password, salt);
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

// Example usage
const userPassword = 'mySuperSecretPassword';
const dataToEncrypt = 'mySensitiveData';

// Encrypting the data
const encrypted = encryptData(dataToEncrypt, userPassword);
console.log('Encrypted Data:', encrypted);

// Decrypting the data
const decrypted = decryptData(encrypted.encryptedData, userPassword, encrypted.salt, encrypted.iv);
console.log('Decrypted Data:', decrypted);
