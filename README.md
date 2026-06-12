<h1>Car Rental App - GoCar</h1>

<p>
A full-stack car rental system with backend API, database layer, and mobile client integration.
</p>

<p>
GoCar is a full-stack car rental system consisting of a mobile application, REST API backend, and SQLite database.
It supports user authentication, vehicle browsing, and rental management.
</p>

<h2>Technologies</h2>

- <b>React Native</b> 
- <b>Python, Flask</b>
- <b>SQLite</b>

<h2>Architecture</h2>

<p>
The system follows a client-server architecture with a RESTful API connecting the mobile frontend and the database layer.
</p>

<p>
Mobile App (React Native) ↔ REST API (Flask) ↔ SQLite Database
</p>

<h2>System Components</h2>

<b>Database</b>

<p>
Designed and initialized a SQLite database with three tables: User, CarList, and RentalHistory, connected via foreign key relationships.
</p>

<b>Backend (Python, Flask)</b>

<p>
Developed a local Flask server providing REST API endpoints for user authentication (login), retrieving available cars (get_available_cars), and handling car rentals (rent_car).
</p>

<p>
The API supports communication between the mobile application and the database layer.
</p>

<b>Mobile App Integration</b>

<p>
Integrated the mobile application with the backend API. The login screen, car listing (CarListScreen), and rental functionality (RentCar) communicate with corresponding endpoints.
</p>

<b>User Profile</b>

<p>
Implemented a user profile screen displaying logged-in user data, retrieved automatically via a useEffect hook from the get_user_profile endpoint.
</p>

<h2>Key Features</h2>

<ul>
  <li>User authentication system</li>
  <li>Car browsing and rental management</li>
  <li>REST API communication between frontend and backend</li>
  <li>Relational database design using SQLite</li>
</ul>

<h2>Application Demo</h2>

<div align="center">

Login screen:
<br/>
<img width="438" height="888" alt="Login" src="https://github.com/user-attachments/assets/ca996750-778f-4f48-b986-f41a2108f310" />
<br />

Car list:
<br/>
<img width="410" height="849" alt="CarList" src="https://github.com/user-attachments/assets/a6763d96-93d3-4dff-bc39-3ff96c1f9ac7" />
<br />

Rental screen:
<br/>
<img width="939" height="957" alt="Rent" src="https://github.com/user-attachments/assets/9dbf9024-76a1-4528-b0e5-716a82817982" />
<br />

Cart:
<br/>
<img width="432" height="900" alt="Cart" src="https://github.com/user-attachments/assets/0798790f-478a-4371-81b5-ab885d9a10c1" />
<br />

Booking history:
<br/>
<img width="441" height="908" alt="Bookings" src="https://github.com/user-attachments/assets/4e41129e-0d41-4577-99fc-e2b7ff71b96c" />

</div>
