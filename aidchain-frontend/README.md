# Aidchain Frontend

## Overview
The Aidchain frontend is a web application built using Next.js, designed to facilitate user interactions with the Aidchain platform. This application includes features for user registration, login, request management, and file uploads.

## Project Structure
The project is organized as follows:

- **app/**: Contains the main application files.
  - **globals.css**: Global CSS styles for the application.
  - **layout.jsx**: Layout component that wraps around pages.
  - **page.jsx**: Main entry point for the application.
  - **login/**: Contains the login page component.
    - **page.jsx**: Handles user login functionality.
  - **register/**: Contains the registration page component.
    - **page.jsx**: Handles user registration functionality.
  - **requests/**: Contains the requests page component.
    - **page.jsx**: Manages user requests.
  - **upload/**: Contains the upload page component.
    - **page.jsx**: Handles file uploads.

- **components/**: Contains reusable components.
  - **Navbar.jsx**: Navigation bar component.

- **public/**: Static files and assets.

- **utils/**: Utility functions.
  - **api.js**: Functions for making API calls.

- **next.config.js**: Configuration file for Next.js.

- **package.json**: npm configuration file listing dependencies and scripts.

- **postcss.config.mjs**: Configuration file for PostCSS.

## Getting Started

### Prerequisites
- Node.js (version 14 or later)
- npm (version 6 or later)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd aidchain-frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server, run:
```
npm run dev
```
The application will be available at `http://localhost:3000`.

### Building for Production
To build the application for production, run:
```
npm run build
```
Then, to start the production server:
```
npm start
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.