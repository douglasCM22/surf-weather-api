import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class AuthService {

     public static async encryptPassword(password: string, salt = 10): Promise<string> {
        return await bcrypt.hash(password, salt);
    }
    
    public static async comparePassword(
        password: string,
        hash: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    public static generateToken(payload: object): string {

        return jwt.sign(payload, 'test', {
            expiresIn: 100000000,
        })
    }
    
}