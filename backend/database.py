import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# #creating database
# def init_db():
#     conn = sqlite3.connect("app.db")
#     c = conn.cursor()
    
#     c.execute("""CREATE TABLE IF NOT EXISTS User (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         email TEXT NOT NULL UNIQUE,
#         password TEXT NOT NULL,
#         name TEXT NOT NULL,
#         surname TEXT NOT NULL,
#         dateOfBirth TEXT NOT NULL,
#         cpr TEXT NOT NULL UNIQUE,
#         isWorker INTEGER NOT NULL DEFAULT 0
#     )""")

#     c.execute("""CREATE TABLE IF NOT EXISTS CarList (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         name TEXT,
#         price TEXT,
#         image TEXT,
#         engine TEXT,
#         power TEXT,
#         transmission TEXT,
#         model TEXT,
#         year TEXT,
#         isAvailable INTEGER NOT NULL DEFAULT 1
#     )""")

#     c.execute("""CREATE TABLE IF NOT EXISTS RentalHistory (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         startDate TEXT DEFAULT (CURRENT_TIMESTAMP),
#         endDate TEXT,
#         UserId INTEGER,
#         CarId INTEGER,
#         FOREIGN KEY (UserId) REFERENCES User(id),
#         FOREIGN KEY (CarId) REFERENCES CarList(id)
#     )""")

#     #test user
#     try:
#         c.execute(
#             "INSERT INTO User (email, password, name, surname, dateOfBirth, cpr, isWorker) VALUES (?, ?, ?, ?, ?, ?, ?)",
#             ("test@example.com", "password123", "John", "Doe", "2000-01-01", "123456-7890", 0)
#         )
#     except sqlite3.IntegrityError:
#         pass

#     # Agregar algunos carros de ejemplo
#     sample_cars = [
#         ("BMW Serie 3", "$45/día", "BMWSerie3.png", "2.0L Turbo", "248 HP", "Automático", "Serie 3", "2023"),
#         ("Audi A4", "$50/día", "audi_a4.png", "2.0L TFSI", "261 HP", "Automático", "A4", "2023"),
#         ("Mercedes C-Class", "$55/día", "mercedes_c.png", "2.0L Turbo", "255 HP", "Automático", "C-Class", "2023"),
#         ("Toyota Camry", "$35/día", "toyota_camry.png", "2.5L Hybrid", "208 HP", "CVT", "Camry", "2023"),
#         ("Honda Accord", "$40/día", "honda_accord.png", "1.5L Turbo", "192 HP", "CVT", "Accord", "2023")
#     ]
    
#     for car in sample_cars:
#         try:
#             c.execute(
#                 "INSERT INTO CarList (name, price, image, engine, power, transmission, model, year, isAvailable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
#                 car + (1,)
#             )
#         except sqlite3.IntegrityError:
#             pass

#     conn.commit()
#     conn.close()

# init_db()

#login
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    c.execute("SELECT id, password FROM User WHERE email = ?", (username,))
    row = c.fetchone()
    conn.close()

    if row and row[1] == password:
        id = row[0]
        return jsonify({"success": True, "user": {"id":id,"email": username}})
    return jsonify({"success": False})

#updatePassword
@app.route("/updatePassword", methods=["POST"])
def updatePassword():
    data = request.json
    username = data.get("username")
    new_password = data.get("password")

    if not username or not new_password:
        return jsonify({"success": False, "message": "Missing username or password"}), 400
    
    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    c.execute("SELECT id FROM User WHERE email = ?", (username,))
    row = c.fetchone()
    
    if row:
        c.execute("UPDATE User SET password = ? WHERE email = ?", (new_password, username,))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    
    return jsonify({"success": False})

#register
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    name = data.get("name")
    surname = data.get("surname")
    dateOfBirth = data.get("dateOfBirth")
    cpr = data.get("cpr")

    if not username or not password or not name or not surname or not dateOfBirth or not cpr:
        return jsonify({"success": False, "message": "Missing data"}), 400

    conn = sqlite3.connect("app.db")
    c = conn.cursor()

    #see if the user exists in DB
    c.execute("SELECT id FROM User WHERE email = ?", (username,))
    if c.fetchone():
        conn.close()
        return jsonify({"success": False, "message": "User already exists"}), 400
    
    c.execute("INSERT INTO User (email, password, name, surname, dateOfBirth, cpr) VALUES (?,?,?,?,?,?)",
        (username, password, name, surname, dateOfBirth, cpr) )
    conn.commit()
    conn.close()

    return jsonify({"success": True})

#user profile
@app.route("/userprofile", methods=["GET"])
def get_user_profile():
    username = request.args.get("username")

    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    c.execute("SELECT email, name, surname, dateOfBirth, cpr FROM User WHERE email = ?", (username,))
    row = c.fetchone()
    conn.close()

    if row:
        user = {
            "email": row[0],
            "name": row[1],
            "surname": row[2],
            "dateOfBirth": row[3],
            "cpr": row[4]
        }
        return jsonify(user)
    
    return jsonify(None), 404


#car list
@app.route("/cars", methods=["GET"])
def get_available_cars():
    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    
    # once a car is paid for, it stays unavailable
    
    # Get available cars
    c.execute("SELECT id, name, price, image, engine, power, transmission, model, year, latitude, longitude, locationName FROM CarList WHERE isAvailable = 1")
    cars = c.fetchall()
    conn.close()

    cars_list = []
    for car in cars:
        cars_list.append({
            "id": car[0],
            "name": car[1],
            "price": car[2],
            "image": car[3],
            "engine": car[4],
            "power": car[5],
            "transmission": car[6],
            "model": car[7],
            "year": car[8],
            "latitude": car[9],
            "longitude": car[10],
            "locationName": car[11]
        })


    return jsonify(cars_list)

#rent car
@app.route("/rent", methods=["POST"])
def rent_car():
    data = request.json
    start_date = data.get("startDate")
    end_date = data.get("endDate")
    user_id = data.get("userId")
    car_id = data.get("carId")

    if not all([start_date, end_date, user_id, car_id]):
        return jsonify({"success": False, "message": "Missing data"}), 400

    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    try:
        c.execute(
            "INSERT INTO RentalHistory (startDate, endDate, UserId, CarId) VALUES (?, ?, ?, ?)",
            (start_date, end_date, user_id, car_id)
        )
        conn.commit()
        return jsonify({"success": True, "message": "Rental confirmed"})
    except Exception as e:
        print("DB error:", e)
        return jsonify({"success": False, "message": "Database error"}), 500
    finally:
        conn.close()

# Παράδειγμα Flask route για booked dates ενός αυτοκινήτου
@app.route("/booked-dates/<int:car_id>")
def booked_dates(car_id):
    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    c.execute("""
        SELECT startDate, endDate FROM RentalHistory
        WHERE CarId = ? AND isPaid = 0
    """, (car_id,))
    bookings = c.fetchall()
    conn.close()

    dates = []
    for start, end in bookings:
        s = datetime.strptime(start, "%Y-%m-%d")
        e = datetime.strptime(end, "%Y-%m-%d")
        while s <= e:
            dates.append(s.strftime("%Y-%m-%d"))
            s += timedelta(days=1)
    return jsonify(dates)



@app.route("/user/update", methods=["PUT"])
def update_user():
    data = request.json
    user_id = data.get("id")
    name = data.get("name", "").strip()
    surname = data.get("surname", "").strip()
    email = data.get("email", "").strip()

    if not user_id:
        return jsonify({"success": False, "message": "Missing user ID"}), 400
    if not name or not surname or not email:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    try:
        conn = sqlite3.connect("app.db")
        c = conn.cursor()
        # Προαιρετικά: έλεγξε αν υπάρχει ήδη άλλο user με ίδιο email
        c.execute("SELECT id FROM User WHERE email = ? AND id <> ?", (email, user_id))
        if c.fetchone():
            return jsonify({"success": False, "message": "Email already in use"}), 409

        c.execute("""
            UPDATE User
               SET name = ?, surname = ?, email = ?
             WHERE id = ?
        """, (name, surname, email, user_id))
        conn.commit()
        return jsonify({"success": True, "message": "Profile updated"})
    except Exception as e:
        print("DB error:", e)
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

#get rental history for cart
@app.route("/rental-history/<int:user_id>", methods=["GET"])
def get_rental_history(user_id):
    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    
    # get unpaid rentals only
    c.execute("""
        SELECT r.id, r.startDate, r.endDate, r.CarId, 
               c.name, c.price, c.image, c.engine, c.power, c.transmission, c.model, c.year
        FROM RentalHistory r
        JOIN CarList c ON r.CarId = c.id
        WHERE r.UserId = ? AND (r.isPaid IS NULL OR r.isPaid = 0)
        ORDER BY r.id DESC
    """, (user_id,))
    
    rentals = c.fetchall()
    conn.close()

    rental_list = []
    for rental in rentals:
        rental_list.append({
            "rentalId": rental[0],
            "startDate": rental[1],
            "endDate": rental[2],
            "carId": rental[3],
            "name": rental[4],
            "price": rental[5],
            "image": rental[6],
            "engine": rental[7],
            "power": rental[8],
            "transmission": rental[9],
            "model": rental[10],
            "year": rental[11]
        })

    return jsonify(rental_list)

#get bookings (completed rentals) for bookings page
@app.route("/bookings/<int:user_id>", methods=["GET"])
def get_bookings(user_id):
    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    
    # paid rentals only
    c.execute("""
        SELECT r.id, r.startDate, r.endDate, r.CarId, 
               c.name, c.price, c.image, c.engine, c.power, c.transmission, c.model, c.year
        FROM RentalHistory r
        JOIN CarList c ON r.CarId = c.id
        WHERE r.UserId = ? AND r.isPaid = 1
        ORDER BY r.id DESC
    """, (user_id,))
    
    bookings = c.fetchall()
    conn.close()

    booking_list = []
    for booking in bookings:
        booking_list.append({
            "rentalId": booking[0],
            "startDate": booking[1],
            "endDate": booking[2],
            "carId": booking[3],
            "name": booking[4],
            "price": booking[5],
            "image": booking[6],
            "engine": booking[7],
            "power": booking[8],
            "transmission": booking[9],
            "model": booking[10],
            "year": booking[11],
            "status": "completed"
        })

    return jsonify(booking_list)


@app.route("/reset-availability/<int:rental_id>", methods=["GET"])

#move rental to completed by setting end date to past
@app.route("/pay-rental/<int:rental_id>", methods=["POST"])
def pay_rental(rental_id):
    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    
    try:
        # check if the rental exists
        c.execute("SELECT id, startDate, endDate, CarId FROM RentalHistory WHERE id = ?", (rental_id,))
        rental = c.fetchone()
        if not rental:
            return jsonify({"success": False, "message": "Rental not found"}), 404
        
        # rental paid (completed)
        c.execute("""
            UPDATE RentalHistory 
            SET isPaid = 1
            WHERE id = ?
        """, (rental_id,))
        
        conn.commit()
        return jsonify({"success": True, "message": "Payment processed successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": "Payment processing failed"}), 500
    finally:
        conn.close()

# ensure isPaid column exists
def init_db_columns():
    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    
    try:
        # Check if isPaid column exists, if not add it
        c.execute("PRAGMA table_info(RentalHistory)")
        columns = c.fetchall()
        has_ispaid = any(column[1] == 'isPaid' for column in columns)
        
        if not has_ispaid:
            c.execute("ALTER TABLE RentalHistory ADD COLUMN isPaid INTEGER DEFAULT 0")
        c.execute("PRAGMA table_info(CarList)")
        car_cols = c.fetchall()
        names = {col[1] for col in car_cols}

        if 'latitude' not in names:
            c.execute("ALTER TABLE CarList ADD COLUMN latitude REAL")
        if 'longitude' not in names:
            c.execute("ALTER TABLE CarList ADD COLUMN longitude REAL")
        if 'locationName' not in names:
            c.execute("ALTER TABLE CarList ADD COLUMN locationName TEXT")
            conn.commit()
            
    except Exception as e:
        pass
    finally:
        conn.close()

#endpoint to initialize database columns
@app.route("/init-db", methods=["POST"])
def init_db_endpoint():
    try:
        init_db_columns()
        return jsonify({"success": True, "message": "Database initialized successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

#reset everything - clear all rentals and make all cars available
@app.route("/reset-all", methods=["POST"])
def reset_all():
    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    
    try:
        # delete all rental history
        c.execute("DELETE FROM RentalHistory")
        deleted_rentals = c.rowcount
        
        # Make all cars available
        c.execute("UPDATE CarList SET isAvailable = 1")
        updated_cars = c.rowcount
        
        conn.commit()
        
        return jsonify({
            "success": True, 
            "message": f"Reset complete: Deleted {deleted_rentals} rentals, made {updated_cars} cars available"
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()

if __name__ == "__main__":
    init_db_columns()  # Initialize the database columns
    app.run(port=5000, debug=True)
