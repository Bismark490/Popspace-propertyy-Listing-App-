import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ username: '', phone: '', avatar: '' });
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [pwErrors, setPwErrors] = useState({});
  const [profileMsg, setProfileMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [pwError, setPwError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const { data } = await api.get('/users/profile');
        if (!cancelled) setProfile({ username: data.data.username || '', phone: data.data.phone || '', avatar: data.data.avatar || '' });
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setFetching(false); }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  const handleProfileChange = (e) => { setProfile({ ...profile, [e.target.id]: e.target.value }); setProfileErrors({ ...profileErrors, [e.target.id]: '' }); setProfileMsg(''); setProfileError(''); };
  const handlePwChange = (e) => { setPwForm({ ...pwForm, [e.target.id]: e.target.value }); setPwErrors({ ...pwErrors, [e.target.id]: '' }); setPwMsg(''); setPwError(''); };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (profile.username && profile.username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (profile.avatar && !/^https?:\/\//.test(profile.avatar)) errs.avatar = 'Enter a valid URL';
    if (Object.keys(errs).length) return setProfileErrors(errs);
    setLoadingProfile(true);
    try {
      const { data } = await api.put('/users/profile', profile);
      updateUser(data.data);
      setProfileMsg('✅ Profile updated successfully!');
    } catch (err) { setProfileError(err.response?.data?.message || 'Failed to update profile'); }
    finally { setLoadingProfile(false); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.oldPassword) errs.oldPassword = 'Current password is required';
    if (!pwForm.newPassword || pwForm.newPassword.length < 6) errs.newPassword = 'New password must be at least 6 characters';
    if (pwForm.confirmNewPassword !== pwForm.newPassword) errs.confirmNewPassword = 'Passwords do not match';
    if (Object.keys(errs).length) return setPwErrors(errs);
    setLoadingPw(true);
    try {
      await api.put('/users/password', { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
      setPwMsg('✅ Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) { setPwError(err.response?.data?.message || 'Failed to change password'); }
    finally { setLoadingPw(false); }
  };

  if (fetching) return <div className="page-centered"><LoadingSpinner message="Loading profile..." /></div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {user?.avatar ? <img src={user.avatar} alt={user.username} /> : <span>{user?.username?.[0]?.toUpperCase()}</span>}
        </div>
        <div>
          <h1 className="profile-name">{user?.username}</h1>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>
      <div className="profile-sections">
        <div className="profile-card">
          <h2 className="profile-section-title">👤 Profile Settings</h2>
          {profileMsg && <div className="success-banner">{profileMsg}</div>}
          {profileError && <div className="server-error-banner"><span>⚠️</span> {profileError}</div>}
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <InputField id="username" label="Username" value={profile.username} onChange={handleProfileChange} placeholder="Your username" error={profileErrors.username} />
            <InputField id="phone" label="Phone Number" value={profile.phone} onChange={handleProfileChange} placeholder="+1 234 567 8900" />
            <InputField id="avatar" label="Avatar URL" value={profile.avatar} onChange={handleProfileChange} placeholder="https://example.com/avatar.jpg" error={profileErrors.avatar} />
            <button type="submit" className="btn btn-primary" disabled={loadingProfile} id="save-profile-btn">
              {loadingProfile ? 'Saving...' : '💾 Save Profile'}
            </button>
          </form>
        </div>
        <div className="profile-card">
          <h2 className="profile-section-title">🔐 Change Password</h2>
          {pwMsg && <div className="success-banner">{pwMsg}</div>}
          {pwError && <div className="server-error-banner"><span>⚠️</span> {pwError}</div>}
          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <InputField id="oldPassword" label="Current Password" type="password" value={pwForm.oldPassword} onChange={handlePwChange} placeholder="Current password" error={pwErrors.oldPassword} required />
            <InputField id="newPassword" label="New Password" type="password" value={pwForm.newPassword} onChange={handlePwChange} placeholder="Min. 6 characters" error={pwErrors.newPassword} required />
            <InputField id="confirmNewPassword" label="Confirm New Password" type="password" value={pwForm.confirmNewPassword} onChange={handlePwChange} placeholder="Repeat new password" error={pwErrors.confirmNewPassword} required />
            <button type="submit" className="btn btn-primary" disabled={loadingPw} id="change-password-btn">
              {loadingPw ? 'Updating...' : '🔑 Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
