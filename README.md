# 🎓 CertiHub - Student Portfolio & Certification Management

A modern, professional platform for students to manage their academic records, certifications, and courses with real-time cloud sync.

![CertiHub](https://img.shields.io/badge/CertiHub-v1.0-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)

## ✨ Features

### 📊 Overview Dashboard
- Personalized greeting with user profile
- Motivational quotes
- Skill distribution analytics
- Recent achievements showcase

### 👤 Professional Profile
- Complete student identity management
- Institution and degree tracking
- Bio with customizable templates
- Social media integration (GitHub, LinkedIn)
- Profile picture upload
- **Real-time auto-save** (saves as you type!)

### 🎓 Academic Records
- Semester-by-semester tracking
- Automatic CGPA calculation
- Credits management
- Real-time GPA updates
- **Auto-saves academic data**

### 🏆 Certifications
- Platform-specific logos and colors
- Skill tags for better discoverability
- Certificate image upload
- Verification links
- Verified badges for credibility

### 📚 Courses
- Course tracking with duration
- Platform recognition (Coursera, Udemy, edX, etc.)
- Skill categorization
- Progress monitoring

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Custom CSS with modern design
- **Backend**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth (Google OAuth + Email/Password)
- **Hosting**: Vercel
- **Real-time**: Firestore real-time listeners

## 🎯 Key Highlights

- ✅ **Real-time Auto-Save**: Data saves automatically as you type (1-1.5s debounce)
- ✅ **Smart Platform Recognition**: Automatically displays logos for AWS, Google, Microsoft, etc.
- ✅ **Skill Tags**: Add skills to certifications for better portfolio presentation
- ✅ **Verification Badges**: Show verified status for certificates with links
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Secure**: Firebase security rules ensure data privacy
- ✅ **Fast**: Optimized with Vite for instant hot reload

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/certihub.git
cd certihub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
- Create a Firebase project at https://console.firebase.google.com
- Enable Firestore Database
- Enable Google Authentication
- Copy your Firebase config

4. **Configure environment variables**
Create a `.env` file in the root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5173`

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
- Go to https://vercel.com
- Click "Import Project"
- Select your GitHub repository
- Add environment variables
- Deploy!

3. **Configure Firebase**
- Add your Vercel domain to Firebase authorized domains
- Update Firestore security rules

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📁 Project Structure

```
certihub/
├── src/
│   ├── components/
│   │   ├── Auth.jsx          # Authentication component
│   │   └── Auth.css          # Auth styling
│   ├── App.jsx               # Main application
│   ├── App.css               # Main styling
│   ├── firebase.js           # Firebase configuration
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🔒 Security

- Firebase keys use environment variables in production
- Firestore security rules restrict access to authenticated users
- Each user can only access their own data
- Profile pictures stored as base64 (max 800KB)

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📊 Database Structure

```
users/
  └── {userId}/
      ├── certifications/
      │   └── {certId}/
      │       ├── title
      │       ├── issuer
      │       ├── skills
      │       ├── certificateImage
      │       └── link
      ├── courses/
      │   └── {courseId}/
      │       ├── title
      │       ├── platform
      │       ├── duration
      │       └── skills
      └── profile/
          └── main/
              ├── fullName
              ├── college
              ├── major
              ├── degree
              ├── gpa
              ├── bio
              ├── avatar
              └── semesters[]
```

## 🎨 Features in Detail

### Real-Time Auto-Save
- Debounced saving (1-1.5 seconds after typing stops)
- Visual "Saving..." indicator
- Success confirmation messages
- Automatic CGPA calculation

### Platform Recognition
Supports 15+ platforms with custom logos and colors:
- AWS, Google, Microsoft
- Coursera, Udemy, edX
- LinkedIn, Meta, IBM
- Oracle, Cisco, CompTIA
- NPTEL, Udacity, Pluralsight

### Skill Distribution Analytics
- Visual progress bars
- Top 5 skills display
- Percentage calculations
- Platform-specific colors

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Vercel for hosting
- React team for the amazing framework
- Vite for blazing fast development

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Review [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

**⭐ Star this repo if you find it helpful!**
