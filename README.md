# IlliniGo: An AR Campus Exploration Game

[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

An augmented reality mobile game designed to encourage University of Illinois Urbana-Champaign (UIUC) students to explore their campus. Discover and collect unique characters at various real-world locations and build your collection!

---

## Table of Contents

- [About The Project](#about-the-project)
- [Core Features](#core-features)
- [Technical Architecture](#technical-architecture-1)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Key Contributions](#key-contributions)
- [Future Enhancements](#future-enhancements)

## About The Project

Stuck in your dorm room? **IlliniGo** transforms the UIUC campus into a playground. This mobile application motivates students to get out and explore iconic locations like the Grainger Library, Green Street, and the Main Quad by turning them into habitats for unique, collectible characters.

Using their phone's camera and geolocation, players can find these characters in an augmented reality setting, "capture" them with a photo, and build a personal catalog of their discoveries.

## Core Features

-   **AR Character Discovery**: Find and interact with 3D characters overlaid on the real world through your phone's camera.
-   **Geolocation-Based Spawning**: Characters appear at specific real-world locations and times across the UIUC campus.
-   **Character Catalog**: View a gallery of all collected characters, complete with stats and the picture you took to capture them.
-   **Personal Profile**: Showcase your collection, stats, and progress.
-   **Social Sharing**: Share your profile and discoveries with friends.

## Technical Architecture

IlliniGo is a full-stack mobile application built with the MERN stack (MongoDB, Express, React, Node.js) at its core, adapted for mobile with React Native.

### Frontend

-   **Framework**: **React Native** (managed with **Expo**) was chosen for its cross-platform compatibility (iOS & Android) and the development team's prior experience with React.
-   **AR & Camera**: The `react-native-camera` library is used to access the device's camera, which serves as the view for the AR experience. Character rendering is integrated into this view.
-   **UI Components**: The application is composed of several key screens:
    -   Login/Authentication Page
    -   Home (Camera/AR View)
    -   Character Catalog
    -   Character Details Popup
    -   User Profile

### Backend

-   **Runtime & Framework**: A **Node.js** server using the **Express.js** framework acts as the application's robust middleware.
-   **Real-time Communication**: A **WebSocket server** (`ws` library) was implemented to provide instantaneous communication between the client and server. This is critical for features like real-time character spawning updates based on the user's location.
-   **API**: A RESTful API handles user authentication, data fetching for profiles and characters, and other core logic.

### Database

-   **Database**: **MongoDB** (a NoSQL database) is used for its flexibility and scalability. It stores all critical application data.
-   **Schema**:
    -   `Users` Collection: Stores user profile information, authentication details, and a reference to their collected characters.
    -   `Creatures` Collection: Contains data for each character, including their stats, 3D model information, and spawn locations/times.
-   **ODM**: **Mongoose** is used as an Object Data Modeling (ODM) library to define schemas and interact with the MongoDB database in a structured way.

## Getting Started

Follow these instructions to get a local copy up and running for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v16 or later)
-   `npm` or `yarn` package manager
-   [Expo Go](https://expo.dev/go) app on your iOS or Android device for testing.
-   A local or cloud-hosted **MongoDB** instance (e.g., MongoDB Atlas).

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/anp6/illinigo.git
    cd illinigo
    ```

2.  **Set up the Backend:**
    ```sh
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file for your environment variables
    # (copy .env.example if it exists, or create a new file)
    touch .env
    ```
    Add your MongoDB connection string to the `.env` file:
    ```
    MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    PORT=8000
    ```

3.  **Set up the Frontend:**
    ```sh
    # Navigate to the frontend directory from the root
    cd ../frontend

    # Install dependencies
    npm install
    ```

4.  **Run the Application:**
    -   **Start the backend server** (in one terminal window):
        ```sh
        cd backend
        npm start
        ```
    -   **Start the frontend client** (in a second terminal window):
        ```sh
        cd frontend
        npx expo start
        ```
    -   Scan the QR code generated by Expo with the Expo Go app on your mobile device.

## Key Contributions

This project was a collaborative effort by four team members. This documentation focuses on my personal contributions, but this project would have been possible without my teammates- who worked on the frontend UI/UX, User Authentication, Camera integration, 3D Model design, Systems integration, and more.

#### My Role: Lead Backend & Systems Architecture

My work formed the foundational backbone of the application, enabling the core gameplay loop and ensuring a stable connection between the user's device and the database.

-   **MongoDB Backend Setup**:
    -   Designed and implemented the Mongoose schemas for both the `Users` and `Creatures` collections.
    -   Established the connection to the MongoDB database and wrote the API endpoints for all CRUD (Create, Read, Update, Delete) operations related to creatures and user data.

-   **WebSocket Server for Real-Time Communication**:
    -   Built a WebSocket server from scratch using the `ws` library in Node.js.
    -   This server is crucial for pushing smooth, real-time updates to the client without requiring the user to refresh, enabling dynamic gameplay.

-   **Geolocation and Creature Spawning Logic**:
    -   Integrated the backend logic to handle geolocation data sent from the mobile client.
    -   Developed the algorithm that determines which creatures should "spawn" and "despawn" based on the user's current GPS coordinates and the time of day, making the discovery process dynamic and engaging.
       

-   **Frontend-Backend Integration**:
    -   Connected the React Native frontend to the backend services, ensuring that data flowed correctly through the WebSocket and REST API endpoints.

-   **UI/UX Design**:
    -   Helped design several UI/UX elements including the main page, catalog, creature pages, and more and created comprehensive mockups to inform the frontend development process

#### Other Contributors


-   **Frontend & UI/UX Development**: Focused on building the user-facing components in React Native, including the Character Catalog, Popup Details, and Profile Page screens.
-   **AR & Character Integration**: Worked on integrating 3D character models into the application's camera view to create the augmented reality experience.

## Future Enhancements

-   [ ] Add a wider variety of collectible characters.
-   [ ] Implement a "friends" system and leaderboards.
-   [ ] Create special events with time-limited, rare characters.
-   [ ] Improve AR tracking and character animations.
-   [ ] Add a trading system for players to exchange duplicate characters.

---
