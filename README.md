# Cloud Drive

## Description

Cloud Drive is a full-stack web application for editing, creating and sharing text documents. It tries to mimic Word and Microsoft OneDrive on a smaller scale.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Tests](#running-the-tests)
- [Features](#features)
- [Known limitations](#known-limitations)
- [AI usage declaration](#ai-usage-declaration)

## Features

- User registeration and login
- JWT-based authentication
- Creating, editing and deleting documents
- WYSIWYG document editing with React Quill
- Document list with timestamps
- Document sorting, searching and pagination
- Sharing to other editors by registered email
- Public read-only document links
- Edit locking (Possibly adding real-time collaboration later)
- PDF export
- Dark and light themes
- Cypress end-to-end testing

## Technologies

### Frontend

- React
- TypeScript
- Vite
- React Router
- Material UI
- MUI X Data Grid
- React Quill
- React PDF and react-pdf-html

React and Materia UI are used to build the interface with simple ready-to-use components. React Quill is used as the text editor for documents. React PDF and react-pdf-html are used to export the document to PDF.

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- express-validator

Node.js and Express provide the REST API. MongoDB stores users and documents. JWT is used to authenticate protected requests, and bcrypt is used to hash passwords.

### Testing

- Cypress

Cypress is used to test user authentication and document functions.

## Project structure

```text
.
├── client/                 # React frontend
│   └── src/
├── server/                 # Express backend
│   └── src/
├── cypress/
│   ├── e2e/               # End-to-end tests
│   └── support/           # Shared Cypress commands and setup
├── cypress.config.js
└── README.md
```

## Installation

### Requirements

Install the following software before running the application:

- Node.js
- npm
- MongoDB
- Git

### 1. Clone the repository

```bash
git clone git@github.com:danielpehkonen/Cloud-Drive-Project.git
cd "Final Project AWA"
```

### 2. Install dependencies

Install the root dependencies:

```bash
npm install
```

Install the frontend dependencies:

```bash
cd client
npm install
```

Install the backend dependencies:

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create `server/.env`:

```env
SECRET=replace_with_a_long_random_secret
```

Don't commit `.env` to git.

### 4. Start MongoDB

Start the MongoDB service. On many Linux systems:

```bash
sudo systemctl start mongod
```

### 5. Start the backend

Open a terminal in the `server` directory:

```bash
npm run dev
```

The backend runs by default at:

```text
http://localhost:1234
```

### 6. Start the frontend

Open another terminal in the `client` directory:

```bash
npm run dev
```

The frontend runs by default at:

```text
http://localhost:3000
```

## Running the tests

MongoDB, the backend, and the frontend must be running before the Cypress tests are started.

Run all tests in headless mode from the project root:

```bash
npx cypress run
```

Open the interactive Cypress test runner:

```bash
npx cypress open
```

The test suite contains ten end-to-end tests:

- Successful registration
- Invalid registration
- Successful login
- Invalid login
- Logout
- Document creation
- Document deletion
- Document listing
- Document locking
- Document saving

## Usage

### Registering an account

1. Open the application.
2. Select **Register** from the navigation bar.
3. Enter a valid email address, username, and strong password.
4. Select **Register**.
5. After successful registration, the application redirects to the login page.

The password must contain at least eight characters, an uppercase letter, a lowercase letter, a number, and a symbol.

### Logging in

1. Select **Login** from the navigation bar.
2. Enter the registered email address and password.
3. Select **Login**.
4. After successful login, the document drive is displayed.

### Creating a document

1. Log in.
2. Select **Create document**.
3. A new document is created and opened in the editor.

### Editing and saving a document

1. Open a document from the document list.
2. Edit the document title or content.
3. Use the formatting toolbar to format the content.
4. Open the **File** menu.
5. Select **Save**.
6. A confirmation message is displayed after a successful save.

Only one user at a time can edit the document. Lock is renewed every 30 seconds and lasts 60 seconds. In normal scenarios the lock is released when user closes the document or after the 60 second time period.



### Exporting a document as PDF

1. Open the document.
2. Open the **File** menu.
3. Select **Export PDF**.
4. The browser downloads the document as a PDF file.

### Adding another editor

1. Open a document that you own.
2. Select **Add editor**.
3. Enter the email address of an existing registered user.
4. Confirm the action.

The added user can then open and edit the document if not locked by another user.

### Sharing a public read-only link

1. Open a document that you own.
2. Select **Share**.
3. The application creates a public link and copies it to the clipboard.
4. Send the link to another person.

The recipient doesn't need to be registered or logged in to view the document.

### Searching and sorting documents

Use the search field to filter documents by name. The document table can be sorted by selecting the relevant column header. Pagination controls are displayed below the document list.

### Deleting a document

1. Locate the document in the document list.
2. Select the delete icon on its row.
3. The document is permanently removed.

The Trash tab is currently a placeholder for future updates.

### Changing the theme

Use the theme button in the navigation bar to switch between the dark and light themes recognized either by a sun or a moon icon.

### Logging out

Select **Logout** from the navigation bar.



## Implemented features and target points

| Feature | Target points |
|---|---:|
| Mandatory requirements | 25 |
| React frontend framework | 3 |
| WYSIWYG editor | 2 |
| PDF download | 3 |
| Creation and last-updated timestamps | 1 |
| Document sorting | 1 |
| Dark and light modes | 1 |
| Ten automated Cypress tests | 4 |
| Search functionality | 2 |
| Pagination | 2 |
| **Total** | **44** |



## AI usage declaration

ChatGPT was used to create the structure of README, proofreading and explaining programming concepts.


## Author

Daniel Pehkonen
