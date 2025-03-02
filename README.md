# School Administration System

This is a simple school administration system build using NestJS. It provides endpoints for registering students and teachers, and for retrieving student information.

## Prerequisites

- Node.js v23.7.0 or higher
- npm v10 or higher
- MySQL 8.4 or higher

or

- Docker

## Installation

1. Clone the repository

2. Install dependencies:

```bash
npm install
```

3. Duplicate the `.env.example` file and rename it to `.env`, change the values to match your environment.

4. Create a MySQL database and update the value with prefix `DB_` in the `.env` file.

5. Run the database migrations:

```bash
npm run build
npm run db:migrate:up
```

## Running the Application

```bash
npm run start
```

or with docker

```bash
docker-compose up --build
```

## API Documentation

### Register a student

A teacher can register multiple students. A student can also be registered to multiple teachers.

- Endpoint: `POST /api/register`
- Headers: `Content-Type: application/json`
- Success response status: HTTP 204
- Request body example:

```
{
  "teacher": "teacherken@gmail.com"
  "students":
    [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
}
```

### Get common students

A teacher can retrieve a list of students common to a given list of teachers (i.e. retrieve students who are registered to ALL of the given teachers).

- Endpoint: `GET /api/commonstudents`
- Success response status: HTTP 200
- Request example 1: `GET /api/commonstudents?teacher=teacherken%40gmail.com`
- Success response body 1:

```
{
  "students" :
    [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com",
      "student_only_under_teacher_ken@gmail.com"
    ]
}
```

- Request example 2: `GET /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com`
- Success response body 2:

```
{
  "students" :
    [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com"
    ]
}
```

### Suspend a student

- Endpoint: `POST /api/suspend`
- Headers: `Content-Type: application/json`
- Success response status: HTTP 204
- Request body example:

```
{
  "student" : "studentmary@gmail.com"
}
```

### Get students emails for notifications

A notification consists of:

- the teacher who is sending the notification, and
- the text of the notification itself.

To receive notifications from e.g. 'teacherken@gmail.com', a student:

- MUST NOT be suspended,
- AND MUST fulfill _AT LEAST ONE_ of the following:
  1. is registered with “teacherken@gmail.com"
  2. has been @mentioned in the notification

The list of students retrieved should not contain any duplicates/repetitions.

- Endpoint: `POST /api/retrievefornotifications`
- Headers: `Content-Type: application/json`
- Success response status: HTTP 200
- Request body example 1:

```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```

- Success response body 1:

```
{
  "recipients":
    [
      "studentbob@gmail.com",
      "studentagnes@gmail.com",
      "studentmiche@gmail.com"
    ]
}
```

In the example above, studentagnes@gmail.com and studentmiche@gmail.com can receive the notification from teacherken@gmail.com, regardless whether they are registered to him, because they are @mentioned in the notification text. studentbob@gmail.com however, has to be registered to teacherken@gmail.com.

- Request body example 2:

```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hey everybody"
}
```

- Success response body 2:

```
{
  "recipients":
    [
      "studentbob@gmail.com"
    ]
}
```

### Error Responses

For all the above API endpoints, error responses have:

```
{
  "message": "Some meaningful error message",
  "statusCode": 400
}
```

## Testing

To run tests:

```bash
npm run test:unit
```
