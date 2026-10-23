import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Database, 
  Music, 
  FolderLock, 
  Mail, 
  ArrowLeft, 
  Clock, 
  Trash2, 
  Server, 
  CheckCircle2, 
  ExternalLink, 
  HardDrive,
  Cookie,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const effectiveDate = "October 23, 2026";
  const appName = "TaalVibe";
  const contactEmail = "priyanshsahu853@gmail.com";

  return (
    <div className="h-full w-full bg-sonora-base text-sonora-text overflow-y-auto selection:bg-sonora-primary selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute -top-20 right-1/4 w-[450px] h-[450px] bg-pink-500/15 rounded-full blur-[140px]" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-amber-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-white/80 hover:text-white border border-white/10 transition-all font-medium text-sm"
            aria-label="Go back"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-black/60 border border-white/15 p-1.5 flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="TaalVibe Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-outfit font-bold text-lg text-white tracking-tight">{appName}</span>
          </Link>

          {user ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-sonora-primary/20 hover:bg-sonora-primary/30 text-sonora-primary border border-sonora-primary/30 text-xs sm:text-sm font-semibold transition-all"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-all border border-white/10"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-sonora-primary mb-4 shadow-sm">
            <Shield size={14} className="text-sonora-primary" />
            <span>Transparency & Privacy First</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-outfit font-black tracking-tight text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-sonora-text-muted max-w-2xl mx-auto leading-relaxed">
            Learn how <strong className="text-white">{appName}</strong> collects, uses, protects, and handles your account details and Google Drive data when you use our music streaming web application.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-white/50 mt-4 font-mono">
            <Clock size={13} />
            <span>Effective Date: {effectiveDate}</span>
          </div>
        </motion.div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-sonora-surface/70 border border-white/5 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Music size={20} />
            </div>
            <h3 className="font-outfit font-semibold text-white text-base mb-1">Tailored for Audio</h3>
            <p className="text-xs text-sonora-text-muted leading-relaxed">
              We collect only the details necessary to authenticate you, build your custom playlists, store favorites, and stream tracks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sonora-surface/70 border border-white/5 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-3">
              <HardDrive size={20} />
            </div>
            <h3 className="font-outfit font-semibold text-white text-base mb-1">Strictly Read-Only Drive</h3>
            <p className="text-xs text-sonora-text-muted leading-relaxed">
              Google Drive access is strictly read-only for catalog audio streaming. We cannot create, modify, or delete your files.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sonora-surface/70 border border-white/5 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Lock size={20} />
            </div>
            <h3 className="font-outfit font-semibold text-white text-base mb-1">Encrypted & Guarded</h3>
            <p className="text-xs text-sonora-text-muted leading-relaxed">
              Passwords are salted and hashed using bcrypt. Sensitive tokens and streaming requests are guarded over HTTPS/TLS.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sonora-surface/70 border border-white/5 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Trash2 size={20} />
            </div>
            <h3 className="font-outfit font-semibold text-white text-base mb-1">Data Deletion Rights</h3>
            <p className="text-xs text-sonora-text-muted leading-relaxed">
              You own your account. You can request complete deletion of your profile, playlists, and history at any time.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-sonora-text/90">
          
          {/* Section 1 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-sonora-surface/50 border border-white/5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-bold flex items-center justify-center text-sonora-primary">
                01
              </span>
              <h2 className="text-xl font-outfit font-bold text-white">Overview & Application Features</h2>
            </div>
            <p className="text-sonora-text-muted">
              <strong className="text-white">{appName}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Application&rdquo;) is a cloud-based personal music player designed to deliver high-quality audio streaming and catalog discovery.
            </p>
            <p className="text-sonora-text-muted">
              To operate effectively, the application provides the following core features:
            </p>
            <ul className="space-y-2 text-sonora-text-muted list-disc list-inside pl-2">
              <li><strong className="text-white">Account Authentication:</strong> Email and password registration with one-time password (OTP) verification, as well as optional Google One-Tap social sign-in.</li>
              <li><strong className="text-white">Music Playback & Streaming:</strong> Real-time HTTP range-request audio streaming from our catalog storage.</li>
              <li><strong className="text-white">Custom Playlists:</strong> User-created playlists with custom ordering, descriptions, and track curation.</li>
              <li><strong className="text-white">Favorites:</strong> One-tap bookmarking to quickly access songs you love.</li>
              <li><strong className="text-white">Listening History:</strong> Playback event logging so you can resume recently played tracks.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-sonora-surface/50 border border-white/5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-bold flex items-center justify-center text-sonora-primary">
                02
              </span>
              <h2 className="text-xl font-outfit font-bold text-white">Data We Collect & Store</h2>
            </div>
            <p className="text-sonora-text-muted">
              We collect only the minimum information required to power your music streaming experience:
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h4 className="font-semibold text-white flex items-center gap-2 mb-1.5">
                  <UserCheck size={16} className="text-sonora-primary" />
                  Account & Profile Information
                </h4>
                <p className="text-xs text-sonora-text-muted leading-relaxed">
                  When you register, we store your <strong className="text-white">first name</strong>, <strong className="text-white">last name</strong>, <strong className="text-white">username</strong>, <strong className="text-white">email address</strong>, and an <strong className="text-white">encrypted password hash</strong>. If you sign in using Google, we retrieve your Google display name, email, and verified Google Account ID. We never see or store your raw Google password.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h4 className="font-semibold text-white flex items-center gap-2 mb-1.5">
                  <Music size={16} className="text-pink-400" />
                  Music Preferences & Activity
                </h4>
                <p className="text-xs text-sonora-text-muted leading-relaxed">
                  We store your created <strong className="text-white">playlists</strong> (name, description, assigned song IDs, and reorder position), songs you mark as <strong className="text-white">favorites</strong>, and your <strong className="text-white">recently played history</strong> (song ID and playback timestamp). This allows your library to stay synced across all your devices.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <h4 className="font-semibold text-white flex items-center gap-2 mb-1.5">
                  <Database size={16} className="text-purple-400" />
                  Session & Technical Logs
                </h4>
                <p className="text-xs text-sonora-text-muted leading-relaxed">
                  To keep you securely logged in, our server tracks active sessions in a <code className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">user_sessions</code> table. Standard technical request headers (IP address, user agent) are handled temporarily by our hosting providers for security and DDoS mitigation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Google OAuth & Drive */}
          <section className="p-6 sm:p-8 rounded-2xl bg-sonora-surface/50 border border-sonora-primary/20 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-sonora-primary/20 border border-sonora-primary/30 text-xs font-mono font-bold flex items-center justify-center text-sonora-primary">
                03
              </span>
              <h2 className="text-xl font-outfit font-bold text-white">Google OAuth & Google Drive Integration</h2>
            </div>
            
            <p className="text-sonora-text-muted">
              {appName} utilizes Google OAuth 2.0 to connect to the administrator's central music repository hosted on Google Drive.
            </p>

            <div className="p-4 rounded-xl bg-sonora-primary/5 border border-sonora-primary/20 space-y-3">
              <h4 className="font-semibold text-white flex items-center gap-2 text-sm">
                <FolderLock size={16} className="text-sonora-primary" />
                Actual Google OAuth Scopes Requested
              </h4>
              <ul className="space-y-2 text-xs font-mono text-sonora-text">
                <li className="p-2 rounded bg-black/50 border border-white/5">
                  <span className="text-amber-400">https://www.googleapis.com/auth/drive.readonly</span>
                  <p className="font-sans text-sonora-text-muted mt-1 font-normal">
                    Grants read-only access to file metadata and binary audio contents within the authorized Google Drive repository.
                  </p>
                </li>
                <li className="p-2 rounded bg-black/50 border border-white/5">
                  <span className="text-amber-400">https://www.googleapis.com/auth/userinfo.profile</span>
                  <p className="font-sans text-sonora-text-muted mt-1 font-normal">
                    Grants access to the connected Google user account ID to confirm connection status.
                  </p>
                </li>
              </ul>
            </div>

            <h4 className="font-semibold text-white pt-2">How Google Drive Data is Accessed & Used:</h4>
            <ul className="space-y-2 text-sonora-text-muted list-disc list-inside pl-2">
              <li><strong className="text-white">Directory Traversal:</strong> We scan only the specific music folder ID designated in the administrator settings to discover audio files (<code className="text-xs font-mono text-white/80">audio/*</code>) and playlist subfolders.</li>
              <li><strong className="text-white">Metadata Indexing:</strong> Audio files are inspected during library sync to extract ID3 tags (track title, artist, album name, genre, duration) and store them in the application catalog.</li>
              <li><strong className="text-white">Audio Streaming:</strong> When an authenticated user plays a song, our backend requests the audio binary stream from Google Drive and pipes it to the user's browser with HTTP byte-range support.</li>
            </ul>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 size={16} />
                Google API User Data & Limited Use Disclosure
              </p>
              <p className="leading-relaxed">
                {appName}'s use and transfer of information received from Google APIs will strictly adhere to the{' '}
                <a 
                  href="https://developers.google.com/terms/api-services-user-data-policy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline text-white font-medium hover:text-emerald-300"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements:
              </p>
              <ul className="list-disc list-inside pl-1 space-y-1 text-emerald-300/80 mt-1">
                <li>We do not transfer or sell Google user data or file contents to third parties, data brokers, or advertising platforms.</li>
                <li>We do not use Google Drive file contents or metadata to train generalized artificial intelligence or machine learning models.</li>
                <li>Access is strictly restricted to read-only capabilities. {appName} does not possess permissions to edit, overwrite, create, or delete files in Google Drive.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-sonora-surface/50 border border-white/5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-bold flex items-center justify-center text-sonora-primary">
                04
              </span>
              <h2 className="text-xl font-outfit font-bold text-white">Third-Party Services & Infrastructure</h2>
            </div>
            <p className="text-sonora-text-muted">
              To operate this service securely and reliably, {appName} utilizes reputable third-party cloud infrastructure providers:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <p className="font-semibold text-white">Neon PostgreSQL (AWS)</p>
                <p className="text-sonora-text-muted mt-1">Stores user profiles, playlists, favorites, song catalog metadata, and session tokens via encrypted SSL connections.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <p className="font-semibold text-white">Render.com</p>
                <p className="text-sonora-text-muted mt-1">Cloud server environment hosting the backend Node.js API and streaming proxy.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <p className="font-semibold text-white">Vercel</p>
                <p className="text-sonora-text-muted mt-1">Hosts the frontend static single-page web application and PWA assets.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <p className="font-semibold text-white">Gmail SMTP (Nodemailer)</p>
                <p className="text-sonora-text-muted mt-1">Used exclusively for sending account verification codes and transactional OTPs.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 sm:col-span-2">
                <p className="font-semibold text-white">Google Fonts CDN</p>
                <p className="text-sonora-text-muted mt-1">Serves font typography stylesheets (Inter and Outfit) directly to your web browser.</p>
              </div>
            </div>

            <p className="text-xs text-sonora-text-muted pt-1">
              We do not embed third-party advertising networks, telemetry trackers, or data-broker analytics SDKs in {appName}.
            </p>
          </section>

          {/* Section 5 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-sonora-surface/50 border border-white/5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-bold flex items-center justify-center text-sonora-primary">
                05
              </span>
              <h2 className="text-xl font-outfit font-bold text-white">Security & Protection Practices</h2>
            </div>
            <p className="text-sonora-text-muted">
              We employ industry-standard administrative, physical, and technical safeguards to keep your personal data secure:
            </p>
            <ul className="space-y-2 text-sonora-text-muted list-disc list-inside pl-2">
              <li><strong className="text-white">Password Hashing:</strong> Plaintext passwords are never saved. Every password is protected with salted bcrypt hashing (cost factor 10).</li>
              <li><strong className="text-white">Encrypted Transmission:</strong> All data transmitted between your browser and our backend is encrypted in transit using Transport Layer Security (TLS/HTTPS).</li>
              <li><strong className="text-white">Stateless JWT Authorization:</strong> Authenticated API requests require cryptographically signed JSON Web Tokens (JWT) with configured expiration periods.</li>
              <li><strong className="text-white">Database Isolation:</strong> PostgreSQL database connections require secure SSL transport (<code className="text-xs font-mono text-white/80">DB_SSL=true</code>) with restricted IP pooling.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-sonora-surface/50 border border-white/5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-bold flex items-center justify-center text-sonora-primary">
                06
              </span>
              <h2 className="text-xl font-outfit font-bold text-white">Data Retention & Account Deletion Requests</h2>
            </div>
            <p className="text-sonora-text-muted">
              We retain account data, playlists, favorites, and listening history for as long as your account remains active.
            </p>
            <p className="text-sonora-text-muted">
              You have the right to request full deletion of your account and all associated personal records at any time:
            </p>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-2 text-sm">
                <Trash2 size={16} className="text-red-400" />
                How to Request Data Deletion
              </h4>
              <p className="text-xs text-sonora-text-muted leading-relaxed">
                To delete your account and remove all personal information (profile, playlists, favorites, sessions, and listening history), send an email to:
              </p>
              <div className="p-2.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-white flex items-center justify-between">
                <span>{contactEmail}</span>
                <span className="text-[10px] text-sonora-primary uppercase tracking-wider font-semibold">Verified Contact</span>
              </div>
              <p className="text-xs text-sonora-text-muted leading-relaxed pt-1">
                Please use the subject line <strong className="text-white">&ldquo;Data Deletion Request&rdquo;</strong> from the email address registered with your account. Upon receipt, all associated database records will be permanently expunged within 30 days.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-sonora-surface/50 border border-white/5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-bold flex items-center justify-center text-sonora-primary">
                07
              </span>
              <h2 className="text-xl font-outfit font-bold text-white">Cookies & Local Storage</h2>
            </div>
            <p className="text-sonora-text-muted">
              {appName} does not use tracking, advertising, or cross-site profiling cookies. We use browser <code className="text-xs font-mono text-white/80">localStorage</code> strictly for necessary operational purposes:
            </p>
            <ul className="space-y-1.5 text-xs text-sonora-text-muted list-disc list-inside pl-2">
              <li><strong className="text-white">Authentication Token:</strong> Storing your session JWT to keep you logged in.</li>
              <li><strong className="text-white">Player State:</strong> Remembering your volume level and audio preferences.</li>
              <li><strong className="text-white">PWA Install Preference:</strong> Recording if you have dismissed or completed the mobile app install guide.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-sonora-surface/50 border border-white/5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-bold flex items-center justify-center text-sonora-primary">
                08
              </span>
              <h2 className="text-xl font-outfit font-bold text-white">Children&apos;s Privacy</h2>
            </div>
            <p className="text-sonora-text-muted">
              {appName} is intended for general audiences and is not directed at children under the age of 13. We do not knowingly collect or solicit personal information from children under 13. If we discover that a child under 13 has provided us with personal information without parental consent, we will promptly delete that information from our servers.
            </p>
          </section>

          {/* Section 9 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-sonora-surface/50 border border-white/5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-bold flex items-center justify-center text-sonora-primary">
                09
              </span>
              <h2 className="text-xl font-outfit font-bold text-white">Changes to This Privacy Policy</h2>
            </div>
            <p className="text-sonora-text-muted">
              We may update this Privacy Policy from time to time to reflect operational, technological, or legal developments. When revisions occur, the updated policy will be posted on this page with a revised <strong className="text-white">&ldquo;Effective Date&rdquo;</strong> at the top. We encourage you to review this page periodically.
            </p>
          </section>

          {/* Section 10 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-sonora-surface to-black/80 border border-white/10 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-sonora-primary/20 border border-sonora-primary/30 text-xs font-mono font-bold flex items-center justify-center text-sonora-primary">
                10
              </span>
              <h2 className="text-xl font-outfit font-bold text-white">Contact Information</h2>
            </div>
            <p className="text-sonora-text-muted">
              If you have any questions, concerns, or requests regarding this Privacy Policy or how your personal information is handled in {appName}, please contact us at:
            </p>
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white font-medium text-sm">
                <Mail size={16} className="text-sonora-primary" />
                <span>Email Support:</span>
                <a href={`mailto:${contactEmail}`} className="text-sonora-primary hover:underline font-mono text-sm ml-1">
                  {contactEmail}
                </a>
              </div>
              <div className="text-xs text-sonora-text-muted">
                <span>Application: </span>
                <strong className="text-white">{appName} Music Player</strong>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center space-y-3">
          <div className="flex items-center justify-center gap-6 text-xs text-sonora-text-muted">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>•</span>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <span>•</span>
            <Link to="/signup" className="hover:text-white transition-colors">Create Account</Link>
            <span>•</span>
            <span className="text-white font-medium">Privacy Policy</span>
          </div>
          <p className="text-xs text-white/40 font-mono">
            &copy; {new Date().getFullYear()} {appName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
