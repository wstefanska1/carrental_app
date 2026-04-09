<h1>Car Rental App - GoCar</h1>

<h2>Opis</h2>

GoCar to mobilna aplikacja umożliwiająca wypożyczanie samochodów. Użytkownik może zalogować się na swoje konto, przeglądać listę dostępnych pojazdów oraz wypożyczyć wybrany samochód. 


<h2>Technologie</h2>

- <b>React Native</b> 
- <b>Python, Flask</b>
- <b>SQLite</b>


<h2>Zrealizowane funkcjonalności (moje kontrybucje)</h2>

<b>Baza danych</b>

Zaprojektowanie i inicjalizacja bazy SQLite z trzema tabelami: User, CarList i RentalHistory (powiązane kluczami obcymi).

<b>Backend w Pythonie (Flask)</b>

Stworzenie lokalnego serwera Flask z trzema endpointami: logowanie użytkownika (login), pobieranie dostępnych aut (get_available_cars) oraz obsługa wypożyczenia (rent_car).

<b>Integracja z aplikacją mobilną</b>

Podłączenie aplikacji do API – ekran logowania, lista samochodów (CarListScreen) oraz funkcja wypożyczenia (RentCar) komunikują się z odpowiednimi endpointami w backendzie.

<b>Profil użytkownika (UserProfile)</b>

Strona wyświetlająca dane zalogowanego użytkownika, pobierane automatycznie przez hook useEffect z endpointu get_user_profile.


<h2>Demo</h2>

<div align="center">

Login screen: 
<br/>
<img width="438" height="888" alt="Login" src="https://github.com/user-attachments/assets/ca996750-778f-4f48-b986-f41a2108f310" />
<br />

Car List: 
<br/>
<img width="410" height="849" alt="CarList" src="https://github.com/user-attachments/assets/a6763d96-93d3-4dff-bc39-3ff96c1f9ac7" />
<br />

Rental Screen: 
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
<br />

</div>



