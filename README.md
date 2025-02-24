# 📚 Wine Encyclopedia - The Ultimate Wine Knowledge Hub 🍇🍷

**Welcome to Wine Encyclopedia!**  
This project was born out of a passion for wine and the desire to create an accessible and comprehensive digital reference for wine enthusiasts, sommeliers, and casual drinkers alike. Whether you’re looking for information on Italian wineries, pairing suggestions, or in-depth details about wine regions, this project has you covered.

<!-- ![Wine Enthusiast](https://your-image-link-here) -->

## 🎯 Purpose of the Project
**Wine Encyclopedia** was created to centralize all the available information about wineries and wines in Italy. With thousands of vineyards and a deep history of wine production, finding accurate and detailed information can be a challenge. This project aims to:
- 🏰 Gather comprehensive information on Italian wineries.
- 🗺️ Explore wine regions and appellations.
- 🍽️ Provide pairing suggestions to enhance your dining experience.
- 📚 Educate users on the nuances of wine production and varieties.

## 🛠️ Technologies Used
This project leverages modern technologies to provide a seamless and efficient experience for both developers and users:

- **Backend**:  
  ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)  
  Built with Node.js, the backend handles data aggregation, REST APIs, and the integration with wine databases.

- **Frontend**:  
  ![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)  
  The project built with Angular frontend to provide flexibility in UI design and user experience.

- **Databases**:  
  ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=white)  
  Authentication and wine data are managed by Firebase Authentication and Firebase Cloud Firestore.

- **Authentication & Security**:  
  JWT-based authentication ensures secure access for users and admins.

- **API Architecture**:  
  Utilizes both REST and GraphQL for flexible data querying.

## 🚀 Getting Started

### 1. Clone the repository
To clone the project to your local machine, open your terminal and run:

```bash
git clone https://github.com/JarvisScienz/WineEncyclopedia
```
### 2. Install dependencies
After navigating to the project folder, install the necessary dependencies for both backend and frontend:

#### For backend
```bash
cd WineEncyclopedia
npm install
```

#### For frontend 
```bash
cd WineEncyclopedia/wine-encyclopedia-frontend
npm install
```

### 3. Set up environment variables
Rename a .env.example file in the root directory of the backend and fill in the required variables (e.g., database URLs, API keys, JWT secrets). Example:

```bash
# .env file
DB_POSTGRES_URL=your_postgres_url
DB_MONGO_URL=your_mongo_url
FIREBASE_API_KEY=your_firebase_api_key
JWT_SECRET=your_jwt_secret
```

### 4. Start the project
Once the dependencies are installed and the environment variables are set, you can start the backend and frontend:

#### Start backend
```bash
npm run start
```

#### Start frontend
```bash
cd wine-encyclopedia-frontend
npm run start
```

### 5. Access the application
The frontend should be running on http://localhost:3000  
The backend on http://localhost:5000.
	
### 6. Step deploy using Firebase host

```bash
cd WineEncyclopedia/wine-encyclopedia-frontend
ng build --prod --aot
cd ..
firebase deploy
```

## 🌐 Live Demo
You can explore the live version of the Wine Encyclopedia here: https://wineencyclopedia-245f5.web.app/login

## 🔥 Features
📚 Complete Wine Database: Access a massive collection of information on Italian wines and wineries.  
🍷 Wine Pairing Suggestions: Automatically get wine recommendations based on your meal.  
🔍 Search & Filter: Easily search for specific wines or filter results by region, grape variety, or winery.  
📊 Analytics & Insights: Visualize trends in wine production, popularity, and consumer preferences.  
👤 User Profiles: Create a personalized account to save your favorite wines and track tastings.  

## 🛠️ Future Improvements
🧠 AI-Powered Pairing: Integrating AI to recommend wines based on user preferences and meal types.  
🍇 Expansion to Global Wines: Adding support for wines from other regions around the world.  
📱 Mobile App: Developing a mobile app for wine recommendations on-the-go.  

## 📝 License
This project is licensed under the MIT License. See the LICENSE file for details.

Enjoy the world of wine exploration with the Wine Encyclopedia!

**Feel free to open issues for any bugs, feature requests, or general feedback!**

## 🍇 Cheers! 🍷
