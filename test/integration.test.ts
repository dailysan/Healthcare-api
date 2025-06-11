import { initializeTestEnvironment, cleanupTestEnvironment, closeTestEnvironment } from './test-env';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import request from 'supertest';
import { createTestServer } from './test-server';
import { AppModule } from '../src/app.module';
import { expectArrayResponse, expectOkResponse } from './test-helpers';

let app: INestApplication;
let server: any;
let token: string;

beforeAll(async () => {
  await initializeTestEnvironment();
  
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).compile();

  app = await createTestServer();
  
  await app.listen(3005, 'localhost');
  
  const httpServer = app.getHttpServer();
  server = request(httpServer);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
}, 30000);

afterEach(async () => {
  await cleanupTestEnvironment();
});

afterAll(async () => {
  await closeTestEnvironment();
  if (app) {
    await app.close();
  }
});

describe('Integration Tests', () => {
  describe('Auth', () => {
    it('should register a new user', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        });
      expectOkResponse(response, 201);
    });

    it('should login with valid credentials', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      expectOkResponse(response, 200);
      token = response.body.access_token;
      expect(token).toBeDefined();
    });
  });

  describe('Patients', () => {
    let patientId: number;

    it('should create a new patient', async () => {
      const response = await request(server)
        .post('/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          clinicId: 1
        });
      expectOkResponse(response, 201);
      patientId = response.body.id;
      expect(patientId).toBeDefined();
    });

    it('should get all patients', async () => {
      const response = await request(server)
        .get('/patients')
        .set('Authorization', `Bearer ${token}`);
      expectOkResponse(response, 200);
      expectArrayResponse(response);
    });

    it('should get a patient by id', async () => {
      const response = await request(server)
        .get(`/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`);
      expectOkResponse(response, 200);
      expect(response.body.id).toBe(patientId);
    });

    it('should update a patient', async () => {
      const response = await request(server)
        .put(`/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'John Updated'
        });
      expectOkResponse(response, 200);
      expect(response.body.firstName).toBe('John Updated');
    });

    it('should delete a patient', async () => {
      const response = await request(server)
        .delete(`/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`);
      expectOkResponse(response, 200);
    });
  });

  describe('Clinics', () => {
    let clinicId: number;

    it('should create a new clinic', async () => {
      const response = await request(server)
        .post('/clinics')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Clinic',
          address: '123 Test St'
        });
      expect(response.status).toBe(201);
      clinicId = response.body.id;
    });

    it('should get all clinics', async () => {
      const response = await request(server)
        .get('/clinics')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a clinic by id', async () => {
      const response = await request(server)
        .get(`/clinics/${clinicId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(clinicId);
    });

    it('should update a clinic', async () => {
      const response = await request(server)
        .put(`/clinics/${clinicId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Clinic Updated'
        });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Clinic Updated');
    });

    it('should delete a clinic', async () => {
      const response = await request(server)
        .delete(`/clinics/${clinicId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });
  });

  describe('Audit Log', () => {
    it('should get audit logs', async () => {
      const response = await request(server)
        .get('/audit-log')
        .set('Authorization', `Bearer ${token}`);
      expectOkResponse(response, 200);
      expectArrayResponse(response);
    });

    it('should filter audit logs by module', async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await request(server)
        .get('/audit-log/module/patients')
        .set('Authorization', `Bearer ${token}`);
      expectOkResponse(response, 200);
      expectArrayResponse(response);
    });
  });
});
