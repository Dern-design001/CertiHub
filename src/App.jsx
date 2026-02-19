import { useState, useEffect, useMemo } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirestore, collection, doc, onSnapshot, deleteDoc, addDoc, setDoc } from 'firebase/firestore'
import { auth, app } from './firebase'
import Auth from './components/Auth'
import './App.css'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const db = getFirestore(app)

const MOTIVATIONAL_QUOTES = [
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Your education is a dress rehearsal for a life that is yours to lead.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Push yourself, because no one else is going to do it for you.",
  "Small steps every day lead to big results.",
  "Don't stop when you're tired. Stop when you're done.",
  "Hard work beats talent when talent doesn't work hard.",
  "You are capable of more than you know.",
  "Turn your obstacles into opportunities."
]

// Platform logos and colors
const PLATFORM_INFO = {
  'AWS': { emoji: '☁️', color: '#FF9900', bg: '#FFF3E0' },
  'Google': { emoji: '🔍', color: '#4285F4', bg: '#E3F2FD' },
  'Microsoft': { emoji: '🪟', color: '#00A4EF', bg: '#E1F5FE' },
  'Coursera': { emoji: '📘', color: '#0056D2', bg: '#E3F2FD' },
  'Udemy': { emoji: '🎓', color: '#A435F0', bg: '#F3E5F5' },
  'edX': { emoji: '📚', color: '#02262B', bg: '#E0F2F1' },
  'LinkedIn': { emoji: '💼', color: '#0A66C2', bg: '#E3F2FD' },
  'Meta': { emoji: '👥', color: '#0668E1', bg: '#E3F2FD' },
  'IBM': { emoji: '💻', color: '#0F62FE', bg: '#E3F2FD' },
  'Oracle': { emoji: '🔴', color: '#F80000', bg: '#FFEBEE' },
  'Cisco': { emoji: '🌐', color: '#049FD9', bg: '#E1F5FE' },
  'CompTIA': { emoji: '🔒', color: '#C8102E', bg: '#FFEBEE' },
  'NPTEL': { emoji: '🇮🇳', color: '#FF6B35', bg: '#FFF3E0' },
  'Udacity': { emoji: '🚀', color: '#02B3E4', bg: '#E1F5FE' },
  'Pluralsight': { emoji: '📊', color: '#F15B2A', bg: '#FFF3E0' },
  'Default': { emoji: '🏆', color: '#2563eb', bg: '#dbeafe' }
}

const getPlatformInfo = (name) => {
  const key = Object.keys(PLATFORM_INFO).find(k => 
    name?.toLowerCase().includes(k.toLowerCase())
  )
  return PLATFORM_INFO[key] || PLATFORM_INFO['Default']
}

// Bio templates
const BIO_TEMPLATES = [
  {
    name: "The Student Researcher",
    template: "Passionate [Major] student at [University] with a keen interest in [Field]. Currently exploring [Research Area] and building expertise in [Skills]. Eager to contribute to innovative projects and collaborate with like-minded professionals."
  },
  {
    name: "The Tech Enthusiast",
    template: "Technology enthusiast pursuing [Degree] in [Major] at [University]. Specialized in [Tech Stack] with hands-on experience in [Projects]. Always learning, always building. Expected graduation: [Year]."
  },
  {
    name: "The Creative Professional",
    template: "[Degree] candidate at [University] combining creativity with technical skills. Experienced in [Skills] and passionate about [Interest]. Looking to leverage my background in [Field] to create impactful solutions."
  }
]

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')
  const [certs, setCerts] = useState([])
  const [courses, setCourses] = useState([])
  const [profile, setProfile] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formType, setFormType] = useState('certification')
  const [previewImage, setPreviewImage] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const showSaving = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Firestore Listeners
  useEffect(() => {
    if (!user || !db) return

    console.log('Setting up Firestore listeners for user:', user.uid)
    console.log('Database path: users/' + user.uid + '/profile/main')

    const certsRef = collection(db, 'users', user.uid, 'certifications')
    const coursesRef = collection(db, 'users', user.uid, 'courses')
    const profileRef = doc(db, 'users', user.uid, 'profile', 'main')

    const unsubCerts = onSnapshot(certsRef, (snap) => {
      console.log('Certifications updated:', snap.size, 'items')
      const certsData = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      console.log('Certifications data:', certsData)
      setCerts(certsData)
    }, (error) => {
      console.error('Error listening to certifications:', error)
    })

    const unsubCourses = onSnapshot(coursesRef, (snap) => {
      console.log('Courses updated:', snap.size, 'items')
      const coursesData = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      console.log('Courses data:', coursesData)
      setCourses(coursesData)
    }, (error) => {
      console.error('Error listening to courses:', error)
    })

    const unsubProfile = onSnapshot(profileRef, (snap) => {
      console.log('Profile snapshot exists:', snap.exists())
      if (snap.exists()) {
        const profileData = snap.data()
        console.log('Profile data loaded:', profileData)
        setProfile(profileData)
      } else {
        console.log('No profile document found - will be created on first save')
        setProfile(null)
      }
    }, (error) => {
      console.error('Error listening to profile:', error)
    })

    return () => {
      console.log('Cleaning up Firestore listeners')
      unsubCerts()
      unsubCourses()
      unsubProfile()
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleAddEntry = async (formData) => {
    if (!user || !db) {
      console.error('User or DB not available:', { user: !!user, db: !!db })
      alert('Not authenticated or database not initialized')
      return
    }
    const col = formType === 'certification' ? 'certifications' : 'courses'
    const ref = collection(db, 'users', user.uid, col)
    const fullPath = `users/${user.uid}/${col}`
    
    try {
      console.log('Adding entry to:', fullPath)
      console.log('Form data:', formData)
      const docRef = await addDoc(ref, { ...formData, createdAt: new Date().toISOString() })
      console.log('Entry added successfully with ID:', docRef.id)
      console.log('Full document path:', `${fullPath}/${docRef.id}`)
      setIsFormOpen(false)
      showSuccess(`${formType === 'certification' ? 'Certification' : 'Course'} added successfully! 🎉`)
    } catch (e) {
      console.error('Error adding entry:', e)
      console.error('Error code:', e.code)
      console.error('Error message:', e.message)
      alert(`Failed to save: ${e.message}`)
    }
  }

  const updateProfile = async (data) => {
    if (!user || !db) {
      console.error('User or DB not available:', { user: !!user, db: !!db })
      alert('Not authenticated or database not initialized')
      return
    }
    const ref = doc(db, 'users', user.uid, 'profile', 'main')
    const fullPath = `users/${user.uid}/profile/main`
    
    try {
      showSaving()
      console.log('Updating profile at:', fullPath)
      console.log('Profile data:', data)
      await setDoc(ref, data, { merge: true })
      console.log('Profile updated successfully!')
      showSuccess('Profile saved! ✓')
    } catch (e) {
      console.error('Error updating profile:', e)
      console.error('Error code:', e.code)
      console.error('Error message:', e.message)
      alert(`Failed to update profile: ${e.message}`)
    }
  }

  const deleteEntry = async (id, type) => {
    if (!user || !db) return
    if (!confirm('Are you sure you want to delete this item?')) return
    const col = type === 'certification' ? 'certifications' : 'courses'
    try {
      console.log('Deleting:', `users/${user.uid}/${col}/${id}`)
      await deleteDoc(doc(db, 'users', user.uid, col, id))
      console.log('Deleted successfully')
      showSuccess('Item deleted successfully!')
    } catch (e) {
      console.error('Error deleting:', e)
      alert(`Failed to delete: ${e.message}`)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontSize: '1.5rem',
        color: '#6b7280'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Initializing Certihub...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Auth onAuthSuccess={setUser} />
  }

  return (
    <div className="app">
      {/* Saving Indicator */}
      {isSaving && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 999,
          background: '#3b82f6',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          fontWeight: 600,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{ 
            width: '16px', 
            height: '16px', 
            border: '3px solid rgba(255,255,255,0.3)', 
            borderTop: '3px solid white', 
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          Saving...
        </div>
      )}

      {/* Success Message Toast */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 1000,
          background: '#10b981',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
          fontWeight: 700,
          fontSize: '0.875rem',
          animation: 'slideIn 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>✓</span>
          {successMessage}
        </div>
      )}

      {/* Mobile Menu Toggle */}
      <button 
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-2xl"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="logo">
          <div className="logo-icon">🎓</div>
          <h1 className="logo-text">CERTIHUB</h1>
        </div>

        <nav className="nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveSection('overview'); setIsSidebarOpen(false); }}
          >
            <span className="nav-icon">📊</span>
            OVERVIEW
          </button>
          <button 
            className={`nav-item ${activeSection === 'professional' ? 'active' : ''}`}
            onClick={() => { setActiveSection('professional'); setIsSidebarOpen(false); }}
          >
            <span className="nav-icon">👤</span>
            PROFESSIONAL ID
          </button>
          <button 
            className={`nav-item ${activeSection === 'academics' ? 'active' : ''}`}
            onClick={() => { setActiveSection('academics'); setIsSidebarOpen(false); }}
          >
            <span className="nav-icon">🎯</span>
            ACADEMICS
          </button>
          <button 
            className={`nav-item ${activeSection === 'certifications' ? 'active' : ''}`}
            onClick={() => { setActiveSection('certifications'); setIsSidebarOpen(false); }}
          >
            <span className="nav-icon">🏆</span>
            CERTIFICATIONS
          </button>
          <button 
            className={`nav-item ${activeSection === 'courses' ? 'active' : ''}`}
            onClick={() => { setActiveSection('courses'); setIsSidebarOpen(false); }}
          >
            <span className="nav-icon">📚</span>
            SKILL COURSES
          </button>
        </nav>

        <div className="user-profile">
          <div 
            className="user-avatar" 
            onClick={() => { setActiveSection('professional'); setIsSidebarOpen(false); }}
            style={{ cursor: 'pointer' }}
            title="View Profile"
          >
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
            ) : user.photoURL ? (
              <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
            ) : (
              user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="user-info" style={{ flex: 1, cursor: 'pointer' }} onClick={() => { setActiveSection('professional'); setIsSidebarOpen(false); }}>
            <div className="user-name">{profile?.fullName || user.displayName || 'Growth Scholar'}</div>
            <div className="user-status">VERIFIED</div>
          </div>
          <button 
            onClick={handleSignOut}
            style={{
              background: '#fee2e2',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              fontWeight: 700,
              color: '#dc2626',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dc2626'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fee2e2'
              e.currentTarget.style.color = '#dc2626'
            }}
            title="Sign Out"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeSection === 'overview' && <OverviewSection user={user} certs={certs} courses={courses} profile={profile} onPreview={setPreviewImage} />}
        {activeSection === 'professional' && <ProfessionalSection profile={profile} onSave={updateProfile} user={user} />}
        {activeSection === 'academics' && <AcademicsSection profile={profile} onSave={updateProfile} />}
        {activeSection === 'certifications' && <CertificationsSection items={certs} onDelete={deleteEntry} onPreview={setPreviewImage} setFormOpen={() => { setFormType('certification'); setIsFormOpen(true); }} />}
        {activeSection === 'courses' && <CoursesSection items={courses} onDelete={deleteEntry} onPreview={setPreviewImage} setFormOpen={() => { setFormType('course'); setIsFormOpen(true); }} user={user} profile={profile} certs={certs} />}
      </main>

      {isFormOpen && (
        <Modal onClose={() => setIsFormOpen(false)}>
          <EntryForm type={formType} onSubmit={handleAddEntry} onCancel={() => setIsFormOpen(false)} />
        </Modal>
      )}

      {previewImage && (
        <ImageModal url={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </div>
  )
}

// Overview Section with motivational quotes and stats
function OverviewSection({ user, certs, courses, profile, onPreview }) {
  const randomQuote = useMemo(() => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  }, [])

  // Calculate skill distribution
  const skillDistribution = useMemo(() => {
    const skills = {}
    certs.forEach(cert => {
      const platform = cert.issuer || 'Other'
      skills[platform] = (skills[platform] || 0) + 1
    })
    courses.forEach(course => {
      const platform = course.platform || 'Other'
      skills[platform] = (skills[platform] || 0) + 1
    })
    return Object.entries(skills).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [certs, courses])

  return (
    <div className="section">
      <div className="section-header">
        <h2>Personal Hub</h2>
        <p className="subtitle">GROWTH & VALIDATION</p>
      </div>

      <div className="hero-card">
        <div className="hero-avatar">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '24px', objectFit: 'cover' }} />
          ) : user.photoURL ? (
            <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '24px', objectFit: 'cover' }} />
          ) : (
            user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
          )}
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Hi, {profile?.fullName?.split(' ')[0] || user.displayName?.split(' ')[0] || 'Growth Mindset'}!</h1>
          <p className="hero-text">
            You've successfully logged <span style={{ fontWeight: 800 }}>{certs.length} certifications</span> and <span style={{ fontWeight: 800 }}>{courses.length} courses</span>. Keep pushing forward!
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span className="stat-icon" style={{ fontSize: '2rem' }}>💬</span>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Motivation</h3>
          </div>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, fontStyle: 'italic', color: '#475569', lineHeight: 1.6 }}>
            "{randomQuote}"
          </p>
        </div>
        
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="stat-icon" style={{ fontSize: '2rem' }}>📊</span>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill Distribution</h3>
          </div>
          {skillDistribution.length > 0 ? (
            <div style={{ width: '100%' }}>
              {skillDistribution.map(([skill, count]) => {
                const info = getPlatformInfo(skill)
                const percentage = ((count / (certs.length + courses.length)) * 100).toFixed(0)
                return (
                  <div key={skill} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{info.emoji}</span>
                        {skill}
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748b' }}>{count}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: info.color, borderRadius: '4px', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No data yet. Start adding achievements!</p>
          )}
        </div>
        
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="stat-icon" style={{ fontSize: '2rem' }}>🏆</span>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Wins</h3>
          </div>
          {certs.length > 0 ? (
            <div style={{ width: '100%' }}>
              {certs.slice(0, 2).map(cert => {
                const info = getPlatformInfo(cert.issuer)
                return (
                  <div key={cert.id} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: info.bg, borderRadius: '12px', cursor: 'pointer', border: `2px solid ${info.color}20` }}
                    onClick={() => cert.certificateImage && onPreview(cert.certificateImage)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{info.emoji}</span>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{cert.title}</p>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginLeft: '2rem' }}>{cert.issuer}</p>
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" 
                        style={{ fontSize: '0.75rem', color: info.color, fontWeight: 700, marginLeft: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}
                        onClick={(e) => e.stopPropagation()}>
                        ✓ Verify Certificate
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>No achievements yet</p>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Add your first certification to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Professional Section with profile picture upload
function ProfessionalSection({ profile, onSave, user }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    college: '',
    major: '',
    degree: '',
    gradYear: '',
    bio: '',
    github: '',
    linkedin: '',
    avatar: ''
  })
  const [saveTimeout, setSaveTimeout] = useState(null)

  useEffect(() => {
    if (profile) setForm({ ...form, ...profile })
  }, [profile])

  // Auto-save function with debounce
  const autoSave = (updatedForm) => {
    if (saveTimeout) clearTimeout(saveTimeout)
    const timeout = setTimeout(() => {
      console.log('Auto-saving profile...')
      onSave(updatedForm)
    }, 1000) // Save after 1 second of no typing
    setSaveTimeout(timeout)
  }

  const updateField = (field, value) => {
    const updatedForm = { ...form, [field]: value }
    setForm(updatedForm)
    if (editing) {
      autoSave(updatedForm)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 800 * 1024) {
      alert("Image exceeds 800KB. Please choose a smaller file.")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      const updatedForm = { ...form, avatar: reader.result }
      setForm(updatedForm)
      onSave(updatedForm) // Save immediately when avatar changes
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
    setEditing(false)
  }

  const toggleEdit = () => {
    if (editing) {
      // Save when exiting edit mode
      onSave(form)
    }
    setEditing(!editing)
  }

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2>Profile</h2>
          <p className="subtitle">GROWTH & VALIDATION</p>
        </div>
        {!editing ? (
          <button onClick={toggleEdit} className="btn-secondary">MODIFY IDENTITY</button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={toggleEdit} className="btn-secondary">Done Editing</button>
          </div>
        )}
      </div>

      <div className="profile-card">
        <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              border: '4px solid #e2e8f0',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {form.avatar ? (
                <img src={form.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '4rem', fontWeight: 800, color: '#cbd5e1' }}>
                  {form.fullName?.charAt(0) || user.displayName?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            {editing && (
              <label style={{ 
                position: 'absolute', 
                bottom: '-10px', 
                right: '-10px', 
                background: '#2563eb', 
                color: 'white', 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
              }}>
                📷
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>GROWTH IDENTITY</h2>
            <p className="profile-subtitle">PERSONAL VALIDATION PROFILE</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-field">
            <label>FULL NAME</label>
            {editing ? (
              <input 
                type="text" 
                value={form.fullName} 
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="John Doe"
                minLength={3}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '1rem', fontWeight: 600 }}
              />
            ) : (
              <div className="field-value">{form.fullName || '—'}</div>
            )}
          </div>
          <div className="profile-field">
            <label>BASE INSTITUTION</label>
            {editing ? (
              <>
                <input 
                  type="text" 
                  value={form.college} 
                  onChange={(e) => updateField('college', e.target.value)}
                  placeholder="e.g., MIT, Stanford, IIT Delhi"
                  list="institutions"
                  minLength={3}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '1rem', fontWeight: 600 }}
                />
                <datalist id="institutions">
                  <option value="MIT" />
                  <option value="Stanford University" />
                  <option value="Harvard University" />
                  <option value="IIT Delhi" />
                  <option value="IIT Bombay" />
                  <option value="IIT Madras" />
                  <option value="University of California, Berkeley" />
                  <option value="Carnegie Mellon University" />
                </datalist>
              </>
            ) : (
              <div className="field-value">{form.college || '—'}</div>
            )}
          </div>
          <div className="profile-field">
            <label>CORE MAJOR</label>
            {editing ? (
              <input 
                type="text" 
                value={form.major} 
                onChange={(e) => updateField('major', e.target.value)}
                placeholder="Major"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '1rem', fontWeight: 600 }}
              />
            ) : (
              <div className="field-value">{form.major || '—'}</div>
            )}
          </div>
          <div className="profile-field">
            <label>CURRENT DEGREE</label>
            {editing ? (
              <input 
                type="text" 
                value={form.degree} 
                onChange={(e) => updateField('degree', e.target.value)}
                placeholder="B.Sc / M.Sc"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '1rem', fontWeight: 600 }}
              />
            ) : (
              <div className="field-value">{form.degree || '—'}</div>
            )}
          </div>
          <div className="profile-field">
            <label>GRADUATION YEAR</label>
            {editing ? (
              <input 
                type="text" 
                value={form.gradYear} 
                onChange={(e) => updateField('gradYear', e.target.value)}
                placeholder="2027"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '1rem', fontWeight: 600 }}
              />
            ) : (
              <div className="field-value">{form.gradYear || '—'}</div>
            )}
          </div>
          <div className="profile-field">
            <label>CURRENT CGPA</label>
            <div className="field-value">{profile?.gpa || '—'}</div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ABOUT ME
            </label>
            {editing && (
              <select 
                onChange={(e) => {
                  if (e.target.value) {
                    updateField('bio', e.target.value)
                  }
                }}
                style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="">Use Template</option>
                {BIO_TEMPLATES.map((template, idx) => (
                  <option key={idx} value={template.template}>{template.name}</option>
                ))}
              </select>
            )}
          </div>
          {editing ? (
            <textarea 
              value={form.bio} 
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Share your academic goals and passion..."
              style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '2px solid #e2e8f0', fontSize: '0.95rem', minHeight: '120px', fontFamily: 'inherit', resize: 'vertical' }}
            />
          ) : (
            <p style={{ color: '#64748b', lineHeight: 1.7 }}>{form.bio || 'Add your bio to introduce yourself professionally.'}</p>
          )}
        </div>

        <div className="sync-section">
          <h3>SYNC SOCIALS</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {editing ? (
              <>
                <input 
                  type="url" 
                  value={form.github} 
                  onChange={(e) => updateField('github', e.target.value)}
                  placeholder="GitHub URL"
                  className="sync-btn"
                  style={{ flex: 1, minWidth: '200px', textAlign: 'left' }}
                />
                <input 
                  type="url" 
                  value={form.linkedin} 
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  placeholder="LinkedIn URL"
                  className="sync-btn"
                  style={{ flex: 1, minWidth: '200px', textAlign: 'left' }}
                />
              </>
            ) : (
              <>
                {form.github ? (
                  <a href={form.github} target="_blank" rel="noopener noreferrer" className="sync-btn">🔗 GitHub</a>
                ) : (
                  <button className="sync-btn">NO GITHUB</button>
                )}
                {form.linkedin ? (
                  <a href={form.linkedin} target="_blank" rel="noopener noreferrer" className="sync-btn">🔗 LinkedIn</a>
                ) : (
                  <button className="sync-btn">NO LINKEDIN</button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Academics Section with CGPA calculator
function AcademicsSection({ profile, onSave }) {
  const [semesters, setSemesters] = useState([])
  const [saveTimeout, setSaveTimeout] = useState(null)

  useEffect(() => {
    if (profile?.semesters) {
      setSemesters(profile.semesters)
    }
  }, [profile])

  const calculateCGPA = (sems) => {
    const validSems = sems.filter(s => s.sgpa && s.credits)
    if (validSems.length === 0) return '0.00'
    const totalPoints = validSems.reduce((acc, curr) => acc + (parseFloat(curr.sgpa) * parseFloat(curr.credits)), 0)
    const totalCredits = validSems.reduce((acc, curr) => acc + parseFloat(curr.credits), 0)
    return (totalPoints / totalCredits).toFixed(2)
  }

  // Auto-save function with debounce
  const autoSave = (updatedSemesters) => {
    if (saveTimeout) clearTimeout(saveTimeout)
    const timeout = setTimeout(() => {
      console.log('Auto-saving academic records...')
      onSave({ semesters: updatedSemesters, gpa: calculateCGPA(updatedSemesters) })
    }, 1500) // Save after 1.5 seconds of no typing
    setSaveTimeout(timeout)
  }

  const addSemester = () => {
    const nextSemNum = semesters.length + 1
    const newSemesters = [...semesters, { id: Date.now(), number: nextSemNum, sgpa: '', credits: '' }]
    setSemesters(newSemesters)
    autoSave(newSemesters)
  }

  const removeSemester = (id) => {
    const newSemesters = semesters.filter(s => s.id !== id)
    setSemesters(newSemesters)
    autoSave(newSemesters)
  }

  const updateSemester = (id, field, value) => {
    const newSemesters = semesters.map(s => s.id === id ? { ...s, [field]: value } : s)
    setSemesters(newSemesters)
    autoSave(newSemesters)
  }

  const handleManualSave = () => {
    onSave({ semesters, gpa: calculateCGPA(semesters) })
  }

  const currentCGPA = useMemo(() => calculateCGPA(semesters), [semesters])

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2>Academic Records</h2>
          <p className="subtitle">GROWTH & VALIDATION • Auto-saves as you type</p>
        </div>
        <button onClick={handleManualSave} className="btn-primary">💾 SAVE NOW</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
        <div className="academics-card">
          <div className="academics-header">
            <div>
              <h2>ACADEMIC PROGRESS</h2>
              <p className="subtitle">VERIFIED SEMESTER RESULTS</p>
            </div>
          </div>

          <div className="semester-section">
            <div className="semester-header">
              <span className="semester-icon">🎯</span>
              <h3>SEMESTER LOG</h3>
              <button onClick={addSemester} className="btn-add">+ NEW SEMESTER</button>
            </div>

            {semesters.length === 0 ? (
              <div className="empty-state">
                <p>ACADEMIC DATA EMPTY</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Semester</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>CGPA</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Credits</th>
                      <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesters.map((sem, index) => (
                      <tr key={sem.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.875rem' }}>Semester {index + 1}</td>
                        <td style={{ padding: '1rem' }}>
                          <input 
                            type="number" 
                            step="0.01"
                            value={sem.sgpa}
                            onChange={(e) => updateSemester(sem.id, 'sgpa', e.target.value)}
                            placeholder="0.00"
                            style={{ width: '100px', padding: '0.5rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '0.875rem', fontWeight: 600 }}
                          />
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <input 
                            type="number"
                            value={sem.credits}
                            onChange={(e) => updateSemester(sem.id, 'credits', e.target.value)}
                            placeholder="0"
                            style={{ width: '100px', padding: '0.5rem', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '0.875rem', fontWeight: 600 }}
                          />
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <button 
                            onClick={() => removeSemester(sem.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.25rem' }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', 
          padding: '2.5rem', 
          borderRadius: '24px', 
          color: 'white', 
          textAlign: 'center',
          minWidth: '200px',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)'
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '1rem' }}>
            Cumulative GPA
          </p>
          <h2 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '0.5rem' }}>{currentCGPA}</h2>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8 }}>
            {semesters.filter(s => s.sgpa && s.credits).length} SEMESTERS
          </p>
        </div>
      </div>
    </div>
  )
}

// Certifications Section
function CertificationsSection({ items, onDelete, onPreview, setFormOpen }) {
  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2>Certs</h2>
          <p className="subtitle">GROWTH & VALIDATION</p>
        </div>
        <button onClick={setFormOpen} className="btn-primary">+ RECORD WIN</button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state-large">
          <div className="empty-icon">📄</div>
          <h2>ARCHIVES EMPTY</h2>
          <p>DOCUMENT YOUR SUCCESS TO START YOUR WALL OF FAME.</p>
          <button onClick={setFormOpen} style={{ marginTop: '1.5rem', padding: '1rem 2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
            + Add Your First Certificate
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {items.map(item => {
            const platformInfo = getPlatformInfo(item.issuer)
            return (
              <div key={item.id} style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '24px', 
                border: `2px solid ${platformInfo.color}20`,
                borderLeft: `4px solid ${platformInfo.color}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                {item.link && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    ✓ Verified
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    background: platformInfo.bg, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: `2px solid ${platformInfo.color}30`
                  }}>
                    {item.certificateImage ? (
                      <img 
                        src={item.certificateImage} 
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => onPreview(item.certificateImage)}
                      />
                    ) : (
                      <span style={{ fontSize: '2.5rem' }}>{platformInfo.emoji}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1e293b' }}>{item.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{platformInfo.emoji}</span>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: platformInfo.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.issuer}
                      </p>
                    </div>
                    {item.skills && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                        {item.skills.split(',').slice(0, 3).map((skill, idx) => (
                          <span key={idx} style={{ 
                            padding: '0.25rem 0.75rem', 
                            background: platformInfo.bg, 
                            color: platformInfo.color, 
                            borderRadius: '8px', 
                            fontSize: '0.7rem', 
                            fontWeight: 700,
                            border: `1px solid ${platformInfo.color}30`
                          }}>
                            #{skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    {item.month} {item.year}
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" 
                        style={{ padding: '0.5rem 1rem', background: platformInfo.bg, color: platformInfo.color, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        onClick={(e) => e.stopPropagation()}>
                        🔗 Verify
                      </a>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(item.id, 'certification')
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', opacity: 0.5, transition: 'opacity 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Courses Section
function CoursesSection({ items, onDelete, onPreview, setFormOpen, user, profile, certs }) {
  
  const generatePDF = async () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPos = 20

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace) => {
      if (yPos + requiredSpace > pageHeight - 20) {
        doc.addPage()
        yPos = 20
        return true
      }
      return false
    }

    // Header with profile
    doc.setFillColor(37, 99, 235)
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('CERTIHUB PORTFOLIO', pageWidth / 2, 20, { align: 'center' })
    doc.setFontSize(10)
    doc.text('Growth & Validation Profile', pageWidth / 2, 30, { align: 'center' })

    yPos = 50

    // Profile Section
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('PROFESSIONAL PROFILE', 20, yPos)
    yPos += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    const profileData = [
      ['Full Name', profile?.fullName || user.displayName || 'N/A'],
      ['Email', user.email || 'N/A'],
      ['Institution', profile?.college || 'N/A'],
      ['Major', profile?.major || 'N/A'],
      ['Degree', profile?.degree || 'N/A'],
      ['Graduation Year', profile?.gradYear || 'N/A'],
      ['CGPA', profile?.gpa || 'N/A']
    ]

    doc.autoTable({
      startY: yPos,
      head: [],
      body: profileData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [240, 240, 240], cellWidth: 50 },
        1: { cellWidth: 'auto' }
      }
    })

    yPos = doc.lastAutoTable.finalY + 15

    // Bio Section
    if (profile?.bio) {
      checkPageBreak(30)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('ABOUT ME', 20, yPos)
      yPos += 8
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const bioLines = doc.splitTextToSize(profile.bio, pageWidth - 40)
      doc.text(bioLines, 20, yPos)
      yPos += bioLines.length * 5 + 10
    }

    // Social Links
    if (profile?.github || profile?.linkedin) {
      checkPageBreak(20)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('SOCIAL LINKS', 20, yPos)
      yPos += 8
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      if (profile?.github) {
        doc.textWithLink('GitHub: ' + profile.github, 20, yPos, { url: profile.github })
        yPos += 6
      }
      if (profile?.linkedin) {
        doc.textWithLink('LinkedIn: ' + profile.linkedin, 20, yPos, { url: profile.linkedin })
        yPos += 6
      }
      yPos += 10
    }

    // Academic Records
    if (profile?.semesters && profile.semesters.length > 0) {
      checkPageBreak(40)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('ACADEMIC RECORDS', 20, yPos)
      yPos += 10

      const semesterData = profile.semesters.map((sem, idx) => [
        `Semester ${idx + 1}`,
        sem.sgpa || 'N/A',
        sem.credits || 'N/A'
      ])

      doc.autoTable({
        startY: yPos,
        head: [['Semester', 'SGPA', 'Credits']],
        body: semesterData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 4 }
      })

      yPos = doc.lastAutoTable.finalY + 15
    }

    // Certifications Section
    if (certs && certs.length > 0) {
      checkPageBreak(40)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('CERTIFICATIONS', 20, yPos)
      yPos += 10

      for (const cert of certs) {
        checkPageBreak(50)
        
        // Add certificate image if available
        if (cert.certificateImage) {
          try {
            const imgData = cert.certificateImage
            doc.addImage(imgData, 'JPEG', 20, yPos, 60, 40)
          } catch (e) {
            console.log('Could not add image:', e)
          }
        }

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(cert.title || 'Untitled', cert.certificateImage ? 85 : 20, yPos + 5)
        
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(`Issuer: ${cert.issuer || 'N/A'}`, cert.certificateImage ? 85 : 20, yPos + 12)
        doc.text(`Date: ${cert.month || ''} ${cert.year || ''}`, cert.certificateImage ? 85 : 20, yPos + 18)
        
        if (cert.skills) {
          doc.text(`Skills: ${cert.skills}`, cert.certificateImage ? 85 : 20, yPos + 24)
        }
        
        if (cert.link) {
          doc.setTextColor(37, 99, 235)
          doc.textWithLink('Verify Certificate', cert.certificateImage ? 85 : 20, yPos + 30, { url: cert.link })
          doc.setTextColor(0, 0, 0)
        }

        yPos += cert.certificateImage ? 50 : 40
      }
    }

    // Skill Courses Section
    if (items && items.length > 0) {
      checkPageBreak(40)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('SKILL COURSES', 20, yPos)
      yPos += 10

      for (const course of items) {
        checkPageBreak(50)
        
        // Add course image if available
        if (course.certificateImage) {
          try {
            const imgData = course.certificateImage
            doc.addImage(imgData, 'JPEG', 20, yPos, 60, 40)
          } catch (e) {
            console.log('Could not add image:', e)
          }
        }

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(course.title || 'Untitled', course.certificateImage ? 85 : 20, yPos + 5)
        
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(`Platform: ${course.platform || 'N/A'}`, course.certificateImage ? 85 : 20, yPos + 12)
        doc.text(`Date: ${course.month || ''} ${course.year || ''}`, course.certificateImage ? 85 : 20, yPos + 18)
        
        if (course.skills) {
          doc.text(`Skills: ${course.skills}`, course.certificateImage ? 85 : 20, yPos + 24)
        }
        
        if (course.link) {
          doc.setTextColor(37, 99, 235)
          doc.textWithLink('View Course', course.certificateImage ? 85 : 20, yPos + 30, { url: course.link })
          doc.setTextColor(0, 0, 0)
        }

        yPos += course.certificateImage ? 50 : 40
      }
    }

    // Footer
    const totalPages = doc.internal.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(
        `Generated from Certihub - Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }

    // Save the PDF
    const fileName = `${profile?.fullName || 'Portfolio'}_Certihub_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2>Skill Courses</h2>
          <p className="subtitle">GROWTH & VALIDATION</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={generatePDF} 
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            📄 EXPORT PDF
          </button>
          <button onClick={setFormOpen} className="btn-primary">+ ADD COURSE</button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state-large">
          <div className="empty-icon">📚</div>
          <h2>NO COURSES YET</h2>
          <p>Start adding courses to track your learning journey.</p>
          <button onClick={setFormOpen} style={{ marginTop: '1.5rem', padding: '1rem 2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
            + Add Your First Course
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {items.map(item => {
            const platformInfo = getPlatformInfo(item.platform)
            return (
              <div key={item.id} style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '24px', 
                border: `2px solid ${platformInfo.color}20`,
                borderLeft: `4px solid ${platformInfo.color}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                {item.link && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    ✓ Verified
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    background: platformInfo.bg, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: `2px solid ${platformInfo.color}30`
                  }}>
                    {item.certificateImage ? (
                      <img 
                        src={item.certificateImage} 
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => onPreview(item.certificateImage)}
                      />
                    ) : (
                      <span style={{ fontSize: '2.5rem' }}>{platformInfo.emoji}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1e293b' }}>{item.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{platformInfo.emoji}</span>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: platformInfo.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.platform}
                      </p>
                    </div>
                    {item.skills && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                        {item.skills.split(',').slice(0, 3).map((skill, idx) => (
                          <span key={idx} style={{ 
                            padding: '0.25rem 0.75rem', 
                            background: platformInfo.bg, 
                            color: platformInfo.color, 
                            borderRadius: '8px', 
                            fontSize: '0.7rem', 
                            fontWeight: 700,
                            border: `1px solid ${platformInfo.color}30`
                          }}>
                            #{skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⏱️ {item.duration}
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" 
                        style={{ padding: '0.5rem 1rem', background: platformInfo.bg, color: platformInfo.color, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        onClick={(e) => e.stopPropagation()}>
                        🔗 Verify
                      </a>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(item.id, 'course')
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', opacity: 0.5, transition: 'opacity 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Entry Form for adding certifications and courses
function EntryForm({ type, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    platform: '',
    month: 'January',
    year: '2025',
    duration: '',
    link: '',
    certificateImage: '',
    skills: ''
  })
  const [error, setError] = useState(null)

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const currentYear = new Date().getFullYear()
  const years = Array.from({length: 12}, (_, i) => (currentYear - i).toString())
  
  const platforms = ['AWS', 'Google', 'Microsoft', 'Coursera', 'Udemy', 'edX', 'LinkedIn', 'Meta', 'IBM', 'Oracle', 'Cisco', 'CompTIA', 'NPTEL', 'Udacity', 'Pluralsight', 'Other']

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 800 * 1024) {
      setError("Picture exceeds 800KB. Try a smaller file.")
      return
    }
    setError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, certificateImage: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title.length < 3) {
      setError("Title must be at least 3 characters")
      return
    }
    if ((type === 'certification' && formData.issuer.length < 2) || (type === 'course' && formData.platform.length < 2)) {
      setError("Platform/Issuer must be at least 2 characters")
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ 
          padding: '1rem', 
          borderRadius: '16px', 
          background: type === 'certification' ? '#fef3c7' : '#dbeafe',
          fontSize: '2rem'
        }}>
          {type === 'certification' ? '🏆' : '📚'}
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Add {type === 'certification' ? 'Certification' : 'Course'}
          </h2>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Document your success
          </p>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', border: '2px solid #fecaca', borderRadius: '12px', marginBottom: '1.5rem', color: '#dc2626', fontSize: '0.875rem', fontWeight: 700 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Title *
          </label>
          <input 
            type="text"
            required
            minLength={3}
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="e.g. AWS Solutions Architect Associate"
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', fontWeight: 600 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              {type === 'certification' ? 'Issuing Body *' : 'Platform *'}
            </label>
            <select
              required
              value={type === 'certification' ? formData.issuer : formData.platform}
              onChange={(e) => setFormData({...formData, [type === 'certification' ? 'issuer' : 'platform']: e.target.value})}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="">Select Platform</option>
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {type === 'course' ? (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Duration *
              </label>
              <input 
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g. 10 Weeks"
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', fontWeight: 600 }}
              />
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Date Completed *
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  value={formData.month}
                  onChange={(e) => setFormData({...formData, month: e.target.value})}
                  style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.875rem', fontWeight: 700 }}
                >
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select 
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.875rem', fontWeight: 700 }}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Skills/Tags (comma-separated)
          </label>
          <input 
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
            placeholder="e.g. Python, AWS, Cloud Computing"
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', fontWeight: 600 }}
          />
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem', fontWeight: 600 }}>
            Add relevant skills to make your profile more searchable
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '20px', border: '2px dashed #cbd5e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'white', borderRadius: '12px', fontSize: '1.5rem' }}>📤</div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Image Upload</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Proof of achievement (Max 800KB)</p>
              </div>
            </div>
            {formData.certificateImage && (
              <button 
                type="button"
                onClick={() => setFormData({...formData, certificateImage: ''})}
                style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', background: '#fee2e2', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
              >
                Clear
              </button>
            )}
          </div>
          <div style={{ position: 'relative', height: '160px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
            {formData.certificateImage ? (
              <img src={formData.certificateImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🖼️</div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase' }}>Select Picture</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Verification Link * (Highly Recommended)
          </label>
          <input 
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({...formData, link: e.target.value})}
            placeholder="https://..."
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', fontWeight: 600 }}
          />
          <p style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '0.5rem', fontWeight: 700 }}>
            ✓ Adding a verification link increases credibility by 10x
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button 
          type="button"
          onClick={onCancel}
          style={{ flex: 1, padding: '1rem', background: '#f1f5f9', border: 'none', borderRadius: '16px', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', color: '#64748b' }}
        >
          Cancel
        </button>
        <button 
          type="submit"
          style={{ flex: 1, padding: '1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '16px', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}
        >
          Save Data
        </button>
      </div>
    </form>
  )
}

// Modal Component
function Modal({ children, onClose }) {
  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 100, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1.5rem', 
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{ 
        background: 'white', 
        width: '100%', 
        maxWidth: '600px', 
        borderRadius: '32px', 
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', 
        padding: '2.5rem', 
        maxHeight: '90vh', 
        overflowY: 'auto' 
      }}>
        {children}
      </div>
      <div style={{ position: 'absolute', inset: 0, zIndex: -1 }} onClick={onClose} />
    </div>
  )
}

// Image Modal Component
function ImageModal({ url, onClose }) {
  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 150, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem', 
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(8px)'
    }}>
      <button 
        onClick={onClose}
        style={{ 
          position: 'absolute', 
          top: '2rem', 
          right: '2rem', 
          background: 'rgba(255, 255, 255, 0.1)', 
          color: 'white', 
          border: 'none', 
          width: '50px', 
          height: '50px', 
          borderRadius: '50%', 
          fontSize: '1.5rem', 
          cursor: 'pointer',
          backdropFilter: 'blur(8px)'
        }}
      >
        ✕
      </button>
      <img 
        src={url} 
        alt="Preview" 
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%', 
          borderRadius: '24px', 
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9)',
          objectFit: 'contain'
        }} 
      />
      <div style={{ position: 'absolute', inset: 0, zIndex: -1, cursor: 'zoom-out' }} onClick={onClose} />
    </div>
  )
}

export default App
