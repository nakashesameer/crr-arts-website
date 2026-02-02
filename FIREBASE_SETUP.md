# Firebase Setup Guide for Comments

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" (or "Add project")
3. Enter a project name (e.g., "crr-arts-website")
4. Disable Google Analytics (optional, not needed for comments)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, click "Build" > "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode" (we'll set up security rules)
4. Select a location closest to your users (e.g., "us-east1")
5. Click "Enable"

## Step 3: Set Up Security Rules

1. In Firestore, go to the "Rules" tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /comments/{commentId} {
      // Anyone can read comments
      allow read: if true;

      // Anyone can create a comment with valid fields
      allow create: if request.resource.data.keys().hasAll(['name', 'message', 'timestamp'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() <= 100
                    && request.resource.data.message is string
                    && request.resource.data.message.size() <= 1000;

      // No one can update or delete (admin can do this in console)
      allow update, delete: if false;
    }
  }
}
```

3. Click "Publish"

## Step 4: Get Your Firebase Config

1. Go to Project Settings (gear icon) > "General"
2. Scroll down to "Your apps" and click the web icon (`</>`)
3. Register your app with a nickname (e.g., "crr-website")
4. Copy the `firebaseConfig` object

## Step 5: Update Your Code

1. Open `js/comments.js`
2. Replace the placeholder config with your actual config:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",           // Your actual API key
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

---

## Local Testing with Firebase Emulator

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v16 or later)
- Java JDK 11+ installed (required for emulator)

### Setup Emulator

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project folder:
```bash
cd crr-arts-website
firebase init
```
   - Select "Emulators" using spacebar, then press Enter
   - Select your Firebase project
   - Choose "Firestore Emulator"
   - Accept default ports (8080 for Firestore)
   - Enable the Emulator UI (default port 4000)

4. This creates `firebase.json` with emulator config

### Run Emulator

1. Start the emulator:
```bash
firebase emulators:start
```

2. Update `js/comments.js` to use emulator:
```javascript
const USE_EMULATOR = true;
```

3. Open your site with a local server:
```bash
npx serve .
```

4. View Emulator UI at http://localhost:4000 to see your test data

### Switch Back to Production

When deploying to GitHub Pages, set:
```javascript
const USE_EMULATOR = false;
```

---

## Viewing Comments (Admin)

To view/manage all comments:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to "Firestore Database"
4. Click on the "comments" collection

You can manually delete inappropriate comments from here.

---

## Cost

Firebase Firestore free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage

This is more than enough for a personal portfolio site.
