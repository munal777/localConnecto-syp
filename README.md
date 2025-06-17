# 🌍 LocalConnecto – Connect Locally. Share Freely. Trade Easily.

LocalConnecto is a full-stack web application that allows users to share, buy, and sell items locally. The platform includes features contact sellers directly through their linked WhatsApp numbers, image uploads using Cloudinary, Google sign-in, and sending welcome emails upon registration.

## Project Structure

```
localConnecto-syp/
├── backend/
│   ├── localconnecto_project/
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
```

## 🚀 Features

- 🔍 Search & filter items based on categories, price, and location
- 📦 List items for sale or for free
- 🖼️ Image upload using Cloudinary
- 💬 WhatsApp integration for direct user communication
- 🔐 JWT authentication and Google Sign-in
- ✉️ OTP-based password change functionality using Redis
- ⚙️ Asynchronous email sending (OTP & welcome emails) with Celery
- 📱 Responsive user interface

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- JavaScript
- TailwindCSS

### Backend

- Django & Django REST Framework
- dj-rest-auth
- djangorestframework-simplejwt
- allauth (Google OAuth)
- Redis (Caching OTPs)
- Celery with Redis (Task queue for asynchronous email sending)
- SendGrid (Emails)
- Cloudinary (Image uploads)

### ⚙️ Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/munal777/localConnecto-syp.git
   cd localConnecto-syp
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (if not already created):
   ```
   python -m venv venv

   # On Windows
   venv\Scripts\activate

   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with the following configuration:
   ```
   # SendGrid Configuration
   SENDGRID_API_KEY=your_sendgrid_api_key
   DEFAULT_FROM_EMAIL=your_email@example.com

   # Google Sign-in
   CLIENT_ID=your_google_client_id
   SECRET=your_google_client_secret

   # Cloudinary Configuration
   CLOUD_NAME=your_cloud_name
   API_KEY=your_api_key
   API_SECRET=your_api_secret
   ```
   
4. Start Redis using Docker:
   ```
   docker run -d --name redis -p 6379:6379 redis:latest
   ```
   
5. Navigate to the project and Run the Django Server and Celery Worker (in separate terminals):
   ```
   cd localconnecto_project
   terminal 1:
   python manage.py runserver
   terminal 2:
   celery -A localconnecto_project worker --loglevel=info --pool=solo
   ```
   The backend server will start at `http://localhost:8000/`

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install

   ```

3. Create a `.env` file in the frontend directory with appropriate configurations:
   ```
   VITE_API_URL=http://localhost:8000/
   ```

4. Start the development server:
   ```
   npm run dev
   
   ```
   The frontend application will be available at `http://localhost:5173/`

## Acknowledgments

- SendGrid for email services
- Cloudinary for image storage solutions
- Redis (via Docker) for caching and task queue backend
- Celery for asynchronous task execution
- Google for authentication services
