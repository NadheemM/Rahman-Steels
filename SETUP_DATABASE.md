# Database Setup

The application requires a MongoDB database to function. You have two options:

## Option 1: Use MongoDB Atlas (Cloud) - Recommended
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in/sign up.
2.  Create a new Cluster (Free Tier is fine).
3.  Click "Connect" -> "Connect your application".
4.  Copy the Connection String (URI). It looks like:
    `mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/rahman_steels?retryWrites=true&w=majority`
5.  Replace `<username>` and `<password>` with your database user credentials.
6.  Paste this URI into `server/.env` as the `MONGO_URI`.

## Option 2: Use Local MongoDB
1.  Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2.  Start the MongoDB server locally (usually runs on port 27017).
3.  The default URI `mongodb://localhost:27017/rahman_steels` should work.

## Once configured:
Restart the server:
```bash
cd server
npm run dev
```
