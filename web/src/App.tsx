import React from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LoginForm } from './components/LoginForm';
import { WorkOrderList } from './components/WorkOrderList';
import { NewWorkOrderForm } from './components/NewWorkOrderForm';

const MainApp: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [refreshKey, setRefreshKey] = React.useState(0);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Work Order Tracker</h2>
        <div>
          <span>Logged in as <strong>{user.username}</strong> ({user.role}) </span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <hr />
      <NewWorkOrderForm onCreated={() => setRefreshKey((prev) => prev + 1)} />
      <WorkOrderList key={refreshKey} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}