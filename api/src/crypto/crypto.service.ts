import { Injectable } from '@nestjs/common';

import { createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class CryptoService {
    algorithm: string
    password: string
    vector: string

    constructor(){
        this.algorithm = 'aes-256-cbc'
        this.password = process.env.CRYPTO_PASSWORD
        this.vector = process.env.CRYPTO_IV
    }

    async encrypt(text: string) {
        const cipher = createCipheriv(this.algorithm, this.password, this.vector);

        let crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    async decrypt(text: string) {
        const decipher = createDecipheriv(this.algorithm, this.password, this.vector);

        let decrypted = decipher.update(text, 'hex', 'utf8')
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
