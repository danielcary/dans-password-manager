import * as fs from 'fs';
import * as AES from 'crypto-js/aes';
import * as SHA256 from 'crypto-js/sha256';
import { enc, lib } from 'crypto-js';
import * as scrypt from 'scrypt-async';

const kdfParams = {
    low: { N: 2 ** 15, r: 8, p: 1, dkLen: 64, encoding: 'hex' },
    medium: { N: 2 ** 18, r: 8, p: 1, dkLen: 64, encoding: 'hex' },
    high: { N: 2 ** 20, r: 8, p: 1, dkLen: 64, encoding: 'hex' }
};

export function hashPassword(password, strength, salt) {
    return new Promise((resolve, reject) => {
        salt = salt || lib.WordArray.random(16).toString(enc.Hex);
        scrypt(password, salt, kdfParams[strength], (hashedPassword) => {
            resolve({
                key: SHA256(hashedPassword),
                salt: salt
            });
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