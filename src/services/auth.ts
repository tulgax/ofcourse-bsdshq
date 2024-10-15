import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, updateProfile, sendEmailVerification } from 'firebase/auth';

export const signUp = async (name: string, email: string, phone: string, location: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update user profile with additional information
  await updateProfile(user, {
    displayName: name,
  });

  // Store additional user information in localStorage
  localStorage.setItem('userProfile', JSON.stringify({
    name,
    email,
    phone,
    location,
  }));

  // Send email verification
  await sendEmailVerification(user);

  return user;
};

export const login = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  localStorage.removeItem('userProfile');
};

export const updateUserProfile = async (user: User, profileData: { displayName?: string; photoURL?: string }): Promise<void> => {
  await updateProfile(user, profileData);
};