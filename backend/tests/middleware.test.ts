import { beforeEach, describe } from "node:test";
import { expect, jest, test } from '@jest/globals';
import { Request, Response } from 'express';
import { validateRegister } from '../src/middleware/auth';
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

app.post('/register', validateRegister, (req: Request, res: Response) => {
    res.status(201).json({ message: 'User registered successfully' });
});

// EXAMPLE TEST
// const sum = (a: any, b: any) => a + b;

// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });

// WHEN WRITING TESTS, ADD THE TEST BLOCK WITHIN ITS RESPECTIVE DESCRIBE BLOCK

// validateRegister
describe('Ensure validateRegister middleware works as expected', () => {
    let data = {
        username: 'validUsername',
        email: 'valid@email.com',
        password: 'validPassword',
    };

    const initializeData = () => {
        data.username = 'validUsername';
        data.email = 'valid@email.com';
        data.password = 'validPassword';
    };

    test('should return status 400 and related message if ANY fields are missing', async () => {
        initializeData();
        data.username = '';
        data.email = '';
        data.password = '';
        const response = await request(app).post('/register').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Please fill in all fields.'});
    });

    test('username should be at least 3 characters', async () => {
        initializeData();
        data.username = 'a';
        const response = await request(app).post('/register').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Username must be at least 3 characters.'});
    });

    test('username should be at most 100 characters', async () => {
        initializeData();
        data.username = 'a'.repeat(101);
        const response = await request(app).post('/register').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Username is too long, limit of 30 characters.'});
    });

    test('password should be at least 8 characters', async () => {
        initializeData();
        data.password = 'a';
        const response = await request(app).post('/register').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Password must be at least 8 characters.'});
    });

    test('password should be at most 100 characters', async () => {
        initializeData();
        data.password = 'a'.repeat(101);
        const response = await request(app).post('/register').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Password is too long, limit of 100 characters.'});
    });

    test('email should be at most 100 characters', async () => {
        initializeData();
        data.email = 'a'.repeat(101) + '@gmail.com';
        const response = await request(app).post('/register').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Email address is too long, limit of 100 characters.'});
    });

    test('email should be valid including @ and .', async () => {
        initializeData();
        data.email = 'invalidEmail';
        const response = await request(app).post('/register').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Please provide a valid email address.'});
    });

    test('should return status 201 with valid user', async () => {
        initializeData();
        data.username = 'validUser';
        data.email = 'valid@email.com';
        data.password = 'validPassword';
        const response = await request(app).post('/register').send(data);
        expect(response.status).toBe(201);
    });
});