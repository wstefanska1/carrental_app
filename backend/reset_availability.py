import sqlite3

conn = sqlite3.connect("app.db")
c = conn.cursor()
c.execute("UPDATE CarList SET isAvailable = 1")
conn.commit()
conn.close()

print("All cars are now unavailable (isAvailable = 0).")