import React from 'react';
import ListYourBusiness from './ListYourBusiness';

export default function Register({ onAuthSuccess, onNavigateToLogin, user }) {
  return <ListYourBusiness onAuthSuccess={onAuthSuccess} onNavigateToLogin={onNavigateToLogin} user={user} />;
}
