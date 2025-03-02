import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AdminController } from '../../../src/modules/admin/admin.controller';
import { AdminService } from '../../../src/modules/admin/admin.service';

describe('AdminController (Hybrid)', () => {
  let app: INestApplication;
  let mockAdminService: any;

  beforeEach(async () => {
    mockAdminService = {
      registerTeacherStudent: jest.fn().mockResolvedValue({}),
      getCommonStudents: jest.fn().mockResolvedValue({ students: [] }),
      suspendStudent: jest.fn().mockResolvedValue({}),
      retrieveForNotifications: jest.fn().mockResolvedValue({ recipients: [] }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/register', () => {
    it('should register teacher and students', () => {
      return request(app.getHttpServer())
        .post('/api/register')
        .send({
          teacher: 'teacher@email.com',
          students: ['student1@email.com', 'student2@email.com'],
        })
        .expect(204)
        .expect(() => {
          expect(mockAdminService.registerTeacherStudent).toHaveBeenCalled();
        });
    });

    it('should return 400 if teacher is not provided', () => {
      return request(app.getHttpServer())
        .post('/api/register')
        .send({
          students: ['student1@email.com', 'student2@email.com'],
        })
        .expect(400);
    });

    it('should return 400 if teacher is not a valid email', () => {
      return request(app.getHttpServer())
        .post('/api/register')
        .send({
          teacher: 'invalid-email',
          students: ['student1@email.com', 'student2@email.com'],
        })
        .expect(400);
    });

    it('should return 400 if teacher email is too long', () => {
      const longEmail = 'a'.repeat(256);
      return request(app.getHttpServer())
        .post('/api/register')
        .send({
          teacher: longEmail,
          students: ['student1@email.com', 'student2@email.com'],
        })
        .expect(400);
    });

    it('should return 400 if students is not valid email', () => {
      return request(app.getHttpServer())
        .post('/api/register')
        .send({
          teacher: 'teacher@email.com',
          students: ['student1@email.com', 'invalid-email'],
        })
        .expect(400);
    });
  });

  describe('GET /api/commonstudents', () => {
    it('should get common students', () => {
      return request(app.getHttpServer())
        .get(
          '/api/commonstudents?teacher=teacher1@email.com&teacher=teacher2@email.com',
        )
        .expect(200)
        .expect(() => {
          expect(mockAdminService.getCommonStudents).toHaveBeenCalled();
        });
    });
    it('should return 400 if teacher is not provided', () => {
      return request(app.getHttpServer())
        .get('/api/commonstudents')
        .expect(400);
    });
    it('should return 400 if teacher is not a valid email', () => {
      return request(app.getHttpServer())
        .get('/api/commonstudents?teacher=invalid-email')
        .expect(400);
    });
  });

  describe('POST /api/suspend', () => {
    it('should suspend a student', () => {
      return request(app.getHttpServer())
        .post('/api/suspend')
        .send({ student: 'student@email.com' })
        .expect(204)
        .expect(() => {
          expect(mockAdminService.suspendStudent).toHaveBeenCalled();
        });
    });
    it('should return 400 if student is not provided', () => {
      return request(app.getHttpServer()).post('/api/suspend').expect(400);
    });
    it('should return 400 if student is not a valid email', () => {
      return request(app.getHttpServer())
        .post('/api/suspend')
        .send({ student: 'invalid-email' })
        .expect(400);
    });
    it('should return 400 if student email is too long', () => {
      const longEmail = 'a'.repeat(256);
      return request(app.getHttpServer())
        .post('/api/suspend')
        .send({ student: longEmail })
        .expect(400);
    });
  });

  describe('POST /api/retrievefornotifications', () => {
    it('should retrieve notifications', () => {
      return request(app.getHttpServer())
        .post('/api/retrievefornotifications')
        .send({
          teacher: 'teacher@email.com',
          notification: 'Hello @student1@email.com',
        })
        .expect(200)
        .expect(() => {
          expect(mockAdminService.retrieveForNotifications).toHaveBeenCalled();
        });
    });
    it('should return 400 if teacher is not provided', () => {
      return request(app.getHttpServer())
        .post('/api/retrievefornotifications')
        .send({
          notification: 'Hello @student1@email.com',
        })
        .expect(400);
    });
    it('should return 400 if notification is not provided', () => {
      return request(app.getHttpServer())
        .post('/api/retrievefornotifications')
        .send({
          teacher: 'teacher@email.com',
        })
        .expect(400);
    });

    it('should return 400 if teacher is not a valid email', () => {
      return request(app.getHttpServer())
        .post('/api/retrievefornotifications')
        .send({
          teacher: 'invalid-email',
          notification: 'Hello @student1@email.com',
        })
        .expect(400);
    });
  });
});
