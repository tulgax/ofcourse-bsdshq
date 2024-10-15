import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Upload, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, updateUserProfile } from '../services/auth';
import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  photoURL: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    location: '',
    photoURL: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else if (user) {
      // If no saved profile, use data from Firebase user
      setProfile({
        name: user.displayName || '',
        email: user.email || '',
        phone: '',
        location: '',
        photoURL: user.photoURL || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await updateUserProfile(user, {
          displayName: profile.name,
          photoURL: profile.photoURL,
        });
        localStorage.setItem('userProfile', JSON.stringify(profile));
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update profile', error);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setIsUploading(true);
      try {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setProfile(prev => ({ ...prev, photoURL: downloadURL }));
        await updateUserProfile(user, { photoURL: downloadURL });
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <img
                src={profile.photoURL || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                <Upload size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            {isUploading && <Loader className="animate-spin" />}
          </div>
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
              disabled
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1 font-medium">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="location" className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={profile.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={profile.photoURL || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Mail size={24} className="text-gray-400" />
            <p>{profile.email}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Phone size={24} className="text-gray-400" />
            <p>{profile.phone}</p>
          </div>
          <div className="flex items-center space-x-4">
            <MapPin size={24} className="text-gray-400" />
            <p>{profile.location}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;