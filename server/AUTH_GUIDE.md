# Autentificare JWT - Ghid de utilizare

## Configurare

Adaugă în fișierul `.env`:
```
JWT_SECRET=secret_key_pentru_dev
```

Pentru producție, folosește un secret puternic și aleatoriu.

## Endpoint-uri de autentificare

### Login Profesor
```
POST /api/professors/login
Content-Type: application/json

{
  "email": "profesor@example.com",
  "password": "parola"
}

Răspuns:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "profesor@example.com",
    "fullName": "Nume Profesor",
    "department": "Informatică"
  }
}
```

### Login Student
```
POST /api/students/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "parola"
}

Răspuns:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "fullName": "Nume Student",
    "faculty": "Faculty of Engineering",
    "specialization": "Computer Science",
    "group": "1234"
  }
}
```

## Utilizarea Token-ului

Pentru toate request-urile autentificate, adaugă header-ul:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Rute Protejate

### Doar Profesori (necesită autentificare + rol PROFESSOR)
- `POST /api/sessions` - Creare sesiune
- `PUT /api/sessions/:id` - Actualizare sesiune
- `PUT /api/requests/:id` - Aprobare/Respingere cerere

### Doar Studenți (necesită autentificare + rol STUDENT)
- `POST /api/requests` - Creare cerere

### Publice (fără autentificare)
- `GET /api/sessions` - Listare toate sesiunile
- `GET /api/sessions/:id` - Detalii sesiune
- `GET /api/sessions/professor/:professorId` - Sesiuni profesor
- `GET /api/requests` - Listare cereri
- `GET /api/professors/:id` - Detalii profesor
- `GET /api/students/:id` - Detalii student

## Validări Suplimentare

### Creare Sesiune
- Profesorul poate crea sesiuni doar pentru el însuși
- Verificare suprapunere intervale

### Actualizare Sesiune
- Profesorul poate modifica doar sesiunile proprii

### Creare Cerere
- Studentul poate crea cereri doar pentru el însuși

### Aprobare Cerere
- Profesorul poate aproba doar cereri la sesiunile proprii
- Verificare locuri disponibile (maxSpots)
- Verificare unicitate (studentul nu poate avea multiple cereri aprobate)

## Exemplu Postman

1. **Login:**
   ```
   POST http://localhost:9000/api/professors/login
   Body: {"email": "test@test.com", "password": "password123"}
   ```

2. **Copiază token-ul din răspuns**

3. **Creare Sesiune:**
   ```
   POST http://localhost:9000/api/sessions
   Headers: Authorization: Bearer <token>
   Body: {
     "professorId": "<id-profesor>",
     "description": "Sesiune licență",
     "startTime": "2025-06-01T10:00:00Z",
     "endTime": "2025-06-01T12:00:00Z",
     "maxSpots": 5
   }
   ```

## Erori Comune

- **401 Unauthorized**: Token lipsă sau invalid
- **403 Forbidden**: Rol incorect sau acces interzis la resursa altcuiva
- **400 Bad Request**: Validare eșuată (ex: locuri depășite, student cu cerere deja aprobată)
