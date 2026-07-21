import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Bell, Volume2, Key, Save, Phone, Mail, ChevronRight, Shield, Zap, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Settings states
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Status states
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [saveKeyMessage, setSaveKeyMessage] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveApiKey = async () => {
    setIsSavingKey(true);
    setSaveKeyMessage('');
    try {
      const token = localStorage.getItem('token');
      const _envUrl = import.meta.env.VITE_API_BASE_URL;
      const API_BASE_URL = _envUrl ? (_envUrl.endsWith('/api/v1') ? _envUrl : _envUrl.replace(/\/$/, '') + '/api/v1') : 'https://kid-s-backend.onrender.com/api/v1';
      const res = await fetch(`${API_BASE_URL}/user/api-key`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ apiKey })
      });
      const data = await res.json();
      if (res.ok) {
        setSaveKeyMessage('✅ API Key saved securely!');
      } else {
        setSaveKeyMessage(`❌ Error: ${data.message || 'Failed to save'}`);
      }
    } catch (err) {
      setSaveKeyMessage('❌ Network error');
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage({ text: '', type: '' });
    
    const result = await updateProfile({ firstName, lastName, phone });
    if (result.success) {
      setProfileMessage({ text: '✅ Profile updated perfectly!', type: 'success' });
    } else {
      setProfileMessage({ text: `❌ ${result.message}`, type: 'error' });
    }
    
    setIsSavingProfile(false);
    setTimeout(() => setProfileMessage({ text: '', type: '' }), 4000);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'profile', label: 'Personal Information', icon: User },
    { id: 'settings', label: 'App Preferences', icon: Bell },
    { id: 'advanced', label: 'Advanced Integrations', icon: Key },
  ];

  return (
    <div className="w-full h-full bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
      
      {/* LEFT SIDEBAR */}
      <div className="w-full md:w-80 bg-gray-50/50 border-r border-gray-200 flex flex-col justify-between overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-kid-primary text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0">
              {user?.firstName ? user.firstName.charAt(0).toUpperCase() : <User />}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-gray-900 text-lg leading-tight truncate">{user?.firstName || 'Parent'} {user?.lastName || ''}</h2>
              <p className="text-gray-500 text-sm truncate" title={user?.email}>{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-white shadow-sm border border-gray-200 text-kid-primary font-bold' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={isActive ? 'text-kid-primary' : 'text-gray-400'} />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight size={16} className="text-kid-primary" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-8 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 text-red-600 font-bold hover:bg-red-50 p-4 rounded-xl transition-colors border border-transparent hover:border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8 md:p-12 lg:p-16 pb-24 min-h-full flex flex-col">
          
          <AnimatePresence mode="wait">
            
            {/* PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h1>
                  <p className="text-gray-500 text-lg">Manage your basic profile details and how we contact you.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="flex-1 flex flex-col">
                  <div className="space-y-8 flex-1">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">First Name</label>
                        <input 
                          type="text" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-kid-primary/20 focus:border-kid-primary outline-none transition-all text-gray-900 font-medium"
                          placeholder="e.g. Sarah"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Last Name</label>
                        <input 
                          type="text" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full p-4 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-kid-primary/20 focus:border-kid-primary outline-none transition-all text-gray-900 font-medium"
                          placeholder="e.g. Jenkins"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">Email Address</label>
                      <div className="relative">
                        <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="email" 
                          value={user?.email || ''}
                          disabled
                          className="w-full p-4 pl-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed font-medium"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly. Contact support if needed.</p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                      <div className="relative">
                        <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-4 pl-12 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-kid-primary/20 focus:border-kid-primary outline-none transition-all text-gray-900 font-medium"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Footer */}
                  <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="h-6 flex-1 w-full text-center md:text-left">
                      <AnimatePresence>
                        {profileMessage.text && (
                          <motion.p 
                            initial={{ opacity: 0, y: 5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0 }}
                            className={`font-semibold ${profileMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}
                          >
                            {profileMessage.text}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <button 
                      type="submit"
                      disabled={isSavingProfile}
                      className="w-full md:w-auto bg-kid-primary hover:bg-kid-primary-dark text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* APP PREFERENCES */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">App Preferences</h1>
                  <p className="text-gray-500 text-lg">Customize your experience on the platform.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start justify-between p-6 border border-gray-200 rounded-2xl hover:border-kid-primary/30 transition-colors">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Push Notifications</h3>
                      <p className="text-gray-500">Receive instant updates on your child's progress and new rewards.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input type="checkbox" className="sr-only peer" checked={notifications} onChange={() => setNotifications(!notifications)} />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-kid-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between p-6 border border-gray-200 rounded-2xl hover:border-kid-primary/30 transition-colors">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Sound Effects</h3>
                      <p className="text-gray-500">Play fun and engaging sounds across the dashboard.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                      <input type="checkbox" className="sr-only peer" checked={sound} onChange={() => setSound(!sound)} />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-kid-primary"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ADVANCED INTEGRATIONS */}
            {activeTab === 'advanced' && (
              <motion.div
                key="advanced"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Integrations</h1>
                  <p className="text-gray-500 text-lg">Connect external services to power up the learning experience.</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="text-kid-primary" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Google Gemini AI</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Unlock our revolutionary AI Voice Tutor and smart interactive learning features by connecting your Gemini API key. 
                    You can generate a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-kid-primary hover:underline font-semibold">Google AI Studio</a>.
                  </p>

                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-700">API Key</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Key size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="password" 
                          placeholder="sk-..." 
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="w-full p-4 pl-12 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-kid-primary/20 focus:border-kid-primary outline-none transition-all font-mono text-gray-900"
                        />
                      </div>
                      <button 
                        onClick={handleSaveApiKey}
                        disabled={isSavingKey || !apiKey}
                        className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center flex-shrink-0"
                      >
                        {isSavingKey ? 'Saving...' : 'Connect Key'}
                      </button>
                    </div>
                    <div className="h-6">
                      <AnimatePresence>
                        {saveKeyMessage && (
                          <motion.p 
                            initial={{ opacity: 0, y: 5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0 }}
                            className={`text-sm font-semibold ${saveKeyMessage.includes('✅') ? 'text-green-600' : 'text-red-500'}`}
                          >
                            {saveKeyMessage}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;