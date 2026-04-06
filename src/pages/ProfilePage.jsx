import { User, Camera, LogOut, Save, Edit3, X, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

function Field({ label, value, editValue, isEditing, onChange, type = 'text', children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</label>
      {isEditing ? (
        children || (
          <input
            type={type}
            value={editValue}
            onChange={e => onChange(e.target.value)}
            className="bg-background border border-brand-blue rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 transition-all"
          />
        )
      ) : (
        <p className="text-text-primary font-medium text-sm py-2 px-3 bg-background/50 rounded-lg border border-border">
          {value || <span className="text-text-secondary italic">Not set</span>}
        </p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, setUser, logout } = useAppContext();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    dob: user?.dob || '',
    gender: user?.gender || 'Prefer not to say',
    bio: user?.bio || '',
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUser({ ...user, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUser({ ...user, ...form });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || '',
      phone: user?.phone || '',
      location: user?.location || '',
      dob: user?.dob || '',
      gender: user?.gender || 'Prefer not to say',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const set = (field) => (val) => setForm(prev => ({ ...prev, [field]: val }));

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-2xl pb-8 sm:pb-12 mx-auto md:mx-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">Your Profile</h2>
          <p className="text-text-secondary text-xs sm:text-sm mt-1">View and manage your personal information.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-1.5 text-brand-green text-sm font-medium animate-pulse">
              <CheckCircle className="w-4 h-4" />
              Saved!
            </div>
          )}
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface text-sm font-medium transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-text-primary hover:border-brand-blue hover:text-brand-blue text-sm font-medium transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Avatar Card */}
      <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden">
        {/* Background gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-brand-blue/20 via-brand-purple/10 to-transparent" />

        <div className="relative group mb-4 mt-4 z-10">
          <div className="w-28 h-28 rounded-full bg-background border-4 border-border flex items-center justify-center overflow-hidden shadow-xl">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <User className="w-12 h-12 text-text-secondary" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 w-9 h-9 bg-brand-blue rounded-full border-4 border-surface shadow-md flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
            title="Change photo"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} />
        </div>

        <h3 className="text-2xl font-bold text-text-primary z-10">{user?.name}</h3>
        <p className="text-text-secondary text-sm z-10 mt-0.5">{user?.email}</p>
        {user?.bio && <p className="text-text-secondary text-xs mt-2 max-w-xs italic z-10">"{user.bio}"</p>}
      </div>

      {/* Editable Info */}
      <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-5">
        <h4 className="text-text-primary font-bold text-base border-b border-border pb-3">Personal Information</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" value={user?.name} editValue={form.name} isEditing={isEditing} onChange={set('name')} />
          {/* Email is read-only — set from login */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</label>
            <p className="text-text-primary font-medium text-sm py-2 px-3 bg-background/50 rounded-lg border border-border flex items-center gap-2">
              {user?.email}
              <span className="text-xs bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full ml-auto shrink-0">Login email</span>
            </p>
          </div>
          <Field label="Phone Number" value={user?.phone} editValue={form.phone} isEditing={isEditing} onChange={set('phone')} type="tel" />
          <Field label="Location" value={user?.location} editValue={form.location} isEditing={isEditing} onChange={set('location')} />
          <Field label="Date of Birth" value={user?.dob} editValue={form.dob} isEditing={isEditing} onChange={set('dob')} type="date" />
          <Field label="Gender" value={user?.gender} editValue={form.gender} isEditing={isEditing} onChange={set('gender')}>
            {isEditing && (
              <select
                value={form.gender}
                onChange={e => set('gender')(e.target.value)}
                className="bg-background border border-brand-blue rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 transition-all"
              >
                {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            )}
          </Field>
        </div>

        <Field label="Bio" value={user?.bio} editValue={form.bio} isEditing={isEditing} onChange={set('bio')}>
          {isEditing && (
            <textarea
              value={form.bio}
              onChange={e => set('bio')(e.target.value)}
              rows={3}
              maxLength={120}
              className="bg-background border border-brand-blue rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 transition-all resize-none"
            />
          )}
        </Field>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h4 className="text-text-primary font-bold text-base border-b border-border pb-3 mb-4">Account</h4>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-brand-red/10 text-brand-red px-5 py-2.5 rounded-lg font-medium hover:bg-brand-red hover:text-white transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
