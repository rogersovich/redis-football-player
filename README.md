# Redis Football Player Management App

This is a simple command-line Node.js application that interacts with a Redis database to manage football player data. You can perform basic CRUD (Create, Read, Update, Delete) operations on player records, where each player is stored as a Redis Hash.

---

## Features

* **Get All Players**: Retrieve and display details for all players stored in Redis.
* **Get Player by ID**: Fetch and show data for a specific player using their unique ID.
* **Create New Player**: Add a new player to the database by providing an ID, name, age, and position.
* **Update Player**: Modify the `name`, `age`, or `position` of an existing player.
* **Delete Player**: Remove a player record from the database.

---

## Prerequisites

Before running this application, make sure you have the following installed:

* **Node.js**: [Download & Install Node.js](https://nodejs.org/en/download/)
* **Redis Server**: You can install Redis locally on your macOS machine using Homebrew:
    ```bash
    brew install redis
    ```
    After installation, start the Redis server:
    ```bash
    brew services start redis
    ```
    (Ensure Redis is running on the default port `6379`.)

---

## Installation

1.  **Clone this repository** (or save the provided code into a file, e.g., `app.js`).
    ```bash
    # If you have a Git repository
    git clone <your-repo-url>
    cd <your-repo-name>
    ```
    If you just saved the code, create a folder and navigate into it:
    ```bash
    mkdir redis-player-app
    cd redis-player-app
    # Then paste your code into app.js
    ```

2.  **Initialize a Node.js project** (if you haven't already):
    ```bash
    npm init -y
    ```

3.  **Install project dependencies**:
    ```bash
    npm install redis
    ```

---

## How to Run

1.  **Ensure your Redis server is running.**
    If not, start it with `brew services start redis`.

2.  **Execute the Node.js application**:
    ```bash
    node app.js
    ```

3.  **Follow the prompts** in your terminal to choose an operation (Get all, Get by ID, Create, Update, Delete).

---

## Code Structure

* `app.js`: The main application file containing all the Redis interaction logic and command-line interface.

### Key Functions:

* `getAllPlayer()`: Uses `SCAN` to safely retrieve all player keys and then `HGETALL` for each player's data.
* `getById()`: Prompts for a player ID and uses `HGETALL` to display their data.
* `editPlayer()`: Guides the user to select a player by ID, then choose a field to update, and finally provide a new value using `HSET`.
* `deletePlayer()`: Prompts for a player ID and uses `DEL` to remove the player's hash from Redis.
* `createNewPlayer()`: Prompts for a new player's ID, name, age, and position, then uses `HSET` to store the data.
* `main()`: The entry point of the application, handles connecting to Redis and presenting the main menu.

---

## Redis Data Model

Players are stored as **Redis Hashes**, using the key pattern `player:<id>`.
Each player hash contains the following fields:

* `name`: Player's full name (String)
* `age`: Player's age (String, although numerically stored in the app)
* `position`: Player's playing position (String)

**Example Redis entry:**
```
player:messi
  name: "Lionel Messi"
  age: "37"
  position: "Forward"
```

---

## Important Notes

* **Error Handling**: Basic error handling is included for Redis connection issues.
* **Input Validation**: Input validation for player fields (name, age, position) is minimal; it only checks for valid field names during an update.
* **`client.destroy()`**: The current setup calls `client.destroy()` after a single operation. If you plan to make multiple operations within one run, you might want to modify the `main` function to keep the client open longer or implement a loop.

---

Feel free to expand upon this application, add more features, or integrate it into a larger project!