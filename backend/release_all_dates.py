import sqlite3

def release_all_dates():
    conn = sqlite3.connect("app.db")
    c = conn.cursor()
    try:
        # Θέτουμε isPaid = 1 για όλες τις εγγραφές που είναι 0
        c.execute("UPDATE RentalHistory SET isPaid = 1 WHERE isPaid = 0")
        conn.commit()
        print("All booked dates are now available.")
    except Exception as e:
        print("Error:", e)
    finally:
        conn.close()

if __name__ == "__main__":
    release_all_dates()