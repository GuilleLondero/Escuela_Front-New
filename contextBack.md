Visión General

Backend FastAPI único (api_escu) que expone los routers de usuarios, carreras, pagos y notificaciones y deja el CORS completamente abierto para cualquier origen (app.py (line 1)‑app.py (line 26)).
Base de datos PostgreSQL local (postgresql://postgres:1323@localhost:5432/escuela) gestionada con SQLAlchemy ORM (configs/db.py (line 1)), las tablas se crean automáticamente en el arranque (models/modelo.py (line 137)).
Para desarrollo se levanta con uvicorn app:api_escu --reload (comentado en app.py (line 29)), lo que expone el API en http://localhost:8000.
sys.tracebacklimit = 1 en el arranque significa que FastAPI sólo mostrará trazas cortas; útil saberlo cuando el front reciba errores genéricos.
Autenticación

La clase Security genera/valida JWT HS256 firmados con el secreto “cualqueira coso”; la carga sólo guarda username, iat y exp (ver auth/security.py (line 4)). Todos los endpoints protegidos esperan el encabezado Authorization: Bearer <token>.
POST /users/login valida usuario/contraseña plano, genera un token válido por 8 h y devuelve también los datos básicos del usuario (routes/user.py (line 68)). Request/response esperada:
POST /users/login
Content-Type: application/json

{"username": "admin", "password": "1234"}

HTTP/1.1 200 OK
{
  "status": "success",
  "token": "<jwt>",
  "user": {"username": "...", "first_name": "...", "last_name": "...", "email": "...", "type": "..."},
  "message": "Usuario logueado con éxito"
}
Verificación de token se ejecuta en GET /users/all, POST /users/change-password, PUT /users/update, PUT /users/reset-password/{username}, GET /users/{username} y GET /user/pagos/{username} (routes/user.py (line 16), routes/user.py (line 182), routes/user.py (line 214), routes/user.py (line 255), routes/user.py (line 281), routes/user.py (line 325)). El resto de rutas actualmente no piden token.
Modelos Principales

User: credenciales (username, password) y relaciones a UserDetail, pagos y carreras (models/modelo.py (line 8)).
UserDetail: datos personales (first_name, last_name, dni, type, email) guardados en tabla separada (models/modelo.py (line 22)).
Career: name y flag active para borrado lógico (models/modelo.py (line 38)).
Payment: referencia a usuario/carrera, amount, affected_month (DateTime), created_at y active (models/modelo.py (line 49)).
PivoteUserCareer: tabla intermedia de inscripciones (models/modelo.py (line 68)).
Notification: mensajes breves con created_at automático (models/modelo.py (line 82)).
Pydantic Inputs (models/modelo.py (line 95)‑models/modelo.py (line 132)) definen la forma de los cuerpos JSON que debe enviar el front.
Usuarios API

GET /users/all devuelve todos los usuarios con detalle personal; ojo que viene el campo password, que conviene ignorar en el front (routes/user.py (line 16)).
POST /users/add crea usuario + datos personales a partir de InputUser y responde con un string (routes/user.py (line 52)).
POST /user/addcareer asocia un usuario con una carrera mediante IDs y responde con un string descriptivo (routes/user.py (line 108)).
GET /user/career/{_username} devuelve una lista de objetos {usuario, carrera} para ese username (routes/user.py (line 127)).
GET /users/alumnos filtra usuarios cuyo type sea “alumno” y adjunta un array de nombres de carreras activas (routes/user.py (line 152)).
POST /users/change-password toma {"new_password": "..."} y actualiza la contraseña del usuario autenticado (routes/user.py (line 182)).
PUT /users/update permite actualizar first_name, last_name, email y opcionalmente new_password del usuario autenticado (routes/user.py (line 214)).
PUT /users/reset-password/{username} (uso administrativo) fija una nueva contraseña para cualquier usuario usando {"new_password": "..."} (routes/user.py (line 255)).
GET /users/{username} devuelve un usuario puntual con detalle (sin password) (routes/user.py (line 281)).
GET /user/pagos/{username} lista los pagos activos de un usuario, con fecha formateada dd/mm/YYYY, mes_afectado en español y carrera; la lista se entrega ordenada descendente por la cadena de fecha (routes/user.py (line 325)).
Carreras API

GET /career/all y GET /careers/active devuelven sólo las carreras activas como {id, name} (routes/career.py (line 9), routes/career.py (line 74)).
POST /career/add crea carreras nuevas (cuerpo {"name": "...", "active": true}) y responde con string (routes/career.py (line 55)).
PUT /careers/{id} actualiza name y active, devuelve {success: True/False} (routes/career.py (line 27)).
DELETE /careers/{id} hace baja lógica (active = False) y devuelve {success: True/False} (routes/career.py (line 44)).
Pagos API

POST /payment/add registra pagos; affected_month debe venir como string "YYYY-MM" que se parsea a fecha (routes/payment.py (line 16)).
GET /payment/user/{_username} trae los pagos activos de un usuario y arma mes_afectado con el diccionario de meses; created_at se devuelve crudo (DateTime) (routes/payment.py (line 37)).
PUT /payments/{id} permite editar todos los campos y acepta affected_month como string o date; responde {success: True/False} (routes/payment.py (line 70)).
DELETE /payment/{id} baja lógica (active = False) (routes/payment.py (line 101)).
GET /payments/active lista todos los pagos activos (cualquier usuario) ordenados por created_at descendente, con campos monto, fecha, mes_afectado, alumno, carrera (routes/payment.py (line 117)).
Notificaciones API

GET /notifications lista mensajes ordenados por fecha descendente y formatea created_at a dd/mm/YYYY (routes/notification.py (line 11)).
POST /notifications crea un mensaje; POST /notifications/add es un alias que reutiliza la misma lógica (routes/notification.py (line 29), routes/notification.py (line 45)).
PUT /notifications/{id} updatea el texto (routes/notification.py (line 51)).
DELETE /notifications/{id} elimina definitivamente la fila (routes/notification.py (line 67)).
Consideraciones Front


