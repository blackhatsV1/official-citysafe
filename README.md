# CitySafe - Urban Disaster Response App

Hello guys! Please check out our live demo below, enjoy!

**Live Demo:** [https://citysafe--official--wgsml27zypcz.code.run](https://citysafe--official--wgsml27zypcz.code.run)

CitySafe is a comprehensive web-based platform designed to enhance community safety and disaster response. The system allows users to report emergencies (SOS), track nearby help stations (PNP/BFP), receive real-time weather alerts, and coordinate with responders.

## Ourr Key Features

- **SOS Reporting**: Real-time disaster reporting with geocoding (coordinates to address and vice-versa).
- **Proximity Alerts**: Automatically notifies nearby users and responders when an incident occurs.
- **Nearby Stations**: Find and route to the nearest help stations (Police, Fire) using Leaflet and Routing Machine.
- **Weather Monitoring**: Automatic weather checks and push notifications for thunderstorms, heavy rain, or extreme heat.
- **Responder Dashboard**: Dedicated interface for responders to manage and track active reports.
- **Admin Panel**: Complete control over users, responders, stations, and incident reports.
- **Push Notifications**: Real-time browser alerts for critical updates.

## APIs and Libraries

This project leverages several modern libraries and APIs to ensure safety and performance:

### Core Backend Libraries
*   **Express**: Core web framework for routing.
*   **Knex.js & MySQL2**: Database query building and stable connection management.
*   **Axios**: HTTP client for external API communication.
*   **Web-Push**: Handles browser push notification delivery.
*   **Nodemailer**: Automates email notifications via Gmail.
*   **Bcrypt**: Secure password hashing.
*   **Node-Cron**: Schedules automated daily weather checks.
*   **Dotenv**: Environment variable management.
*   **Helmet/CORS/Compression**: Security and performance optimization.
*   **Express-Session**: User session persistence.

### External APIs
*   **OpenWeatherMap API**: Real-time weather data and alerts.
*   **OpenStreetMap (Nominatim)**: Geocoding and reverse geocoding services.
*   **Gmail SMTP**: System-wide email delivery.
*   **Web Push API**: Standard browser-based notification system.

### Frontend Libraries
*   **Leaflet.js**: Interactive map rendering and geolocation.
*   **Leaflet Routing Machine**: Navigation and route calculation.
*   **Bootstrap**: Responsive UI/UX components.
*   **EJS**: Server-side HTML templating engine.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) database

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/blackhatsV1/official-citysafe.git
    cd official-citysafe
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=9000
    MYSQLHOST=your_host
    MYSQLUSER=your_user
    MYSQLPASSWORD=your_password
    MYSQLDATABASE=your_db
    MYSQLPORT=your_port
    OWM_API_KEY=your_openweathermap_api_key
    EMAIL_USER=your_gmail_address
    EMAIL_PASS=your_gmail_app_password
    VAPID_PUBLIC_KEY=your_vapid_public_key
    VAPID_PRIVATE_KEY=your_vapid_private_key
    SESSION_SECRET=a_very_strong_random_string
    NODE_ENV=development
    ```

4.  **Database Migration**
    Import the `citysafe-official-latest.sql` file into your MySQL database.

5.  **Run the application**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:9000`.

## Security

- Passwords are encrypted using **Bcrypt**.
- Authentication state is managed via **Express Session**.
- API protection implemented with **Helmet** and **Express Rate Limit**.

## License

This project is licensed under the ISC License.
