import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import prisma from '../../db/index.js';
dotenv.config();

class AuthHandler {


    static async verifyLogin(email, password) {
        const _user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!_user) {
            return { status: false, message: 'User does not exist' };
        }
        const isMatch = await bcrypt.compare(password, _user.password);
        if (!isMatch) {
            return { status: false, message: 'Incorrect password' };
        }
        const token = jwt.sign({ id: _user.id, name: _user.name, email: _user.email }, process.env.JWT_SECRET, { expiresIn: '4h' });
        return { status: true, token };
    }

    static async verifyToken(req, res, next) {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/login');
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.redirect('/login');
        }
    }

    static async register(name, email, password) {
        console.log(name , email, password);

        
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const _user = await prisma.user.create({
                    data: {
                        name: name,
                        email: email,
                        password: hashedPassword
                    }
                });
            
          if(!_user)  return { status: false, message: 'User registration failed' };
            const token = jwt.sign({ id: _user.id, name: _user.name, email: _user.email }, process.env.JWT_SECRET, { expiresIn: '4h' });
            return { status: true, token };
        } catch (error) {
            console.log(error);
            return { status: false, message: 'User registration failed' }
        }
    }
}

export default AuthHandler;