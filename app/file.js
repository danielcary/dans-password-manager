import * as fs from 'fs';
import * as AES from 'crypto-js/aes';
import * as SHA256 from 'crypto-js/sha256';
import { enc, lib } from 'crypto-js';
import * as scrypt from 'scryptsy';

const kdfNParams = {
    low: 2 ** 15,
    medium: 2 ** 18,
    high: 2 ** 20
};


export function hashPassword(password, strength, salt) {
    return new Promise((resolve, reject) => {
        salt = salt || lib.WordArray.random(16).toString(enc.Hex);
        let hashedPassword = scrypt(password, salt, kdfNParams[strength], 10, 1, 64);
        resolve({
            key: SHA256(hashedPassword.toString('hex')),
            salt: salt
        });
    });
}

export function openFile(filepath) {
    return JSON.parse(fs.readFileSync(filepath).toString());
}

export function decryptFile(fileData, hashedPassword) {
    return new Promise((resolve, reject) => {
        // get iv and ciphertext
        let iv = enc.Hex.parse(fileData.iv);
        let ciphertext = fileData.data;
        
        // try to decrypt with password
        let plaintext = AES.decrypt(ciphertext, hashedPassword.key, { iv: iv });
        
        // extract and return data
        resolve(JSON.parse(plaintext.toString(enc.Utf8)));
    });
};

export function saveFile(filepath, hashedPassword, jsonData, strength) {
    // stringify JSON data
    let data = JSON.stringify(jsonData);
    // generate IV
    let iv = lib.WordArray.random(32);
    // encrypted the data
    let encryptedData = AES.encrypt(data, hashedPassword.key, { iv: iv });

    // save to file
    fs.writeFileSync(filepath, JSON.stringify({
        version: 1,
        strength: strength,
        salt: hashedPassword.salt,
        iv: iv.toString(enc.Hex),
        data: encryptedData.ciphertext.toString(enc.Base64)
    }));
}