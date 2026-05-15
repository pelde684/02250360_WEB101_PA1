import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { LoginForm, SignupForm } from '../../components/auth/AuthForms';
import { useAuth } from '../../contexts/authContext';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { login, register } = useAuth();

  const handleSuccess = () => {
    onClose();
  };

  // Reset tab when modal opens/closes
  const handleClose = () => {
    setActiveTab(initialTab);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={activeTab === 'login' ? 'Log in' : 'Sign up'}>
      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 text-center transition-colors ${
              activeTab === 'login' 
                ? 'border-b-2 border-blue-500 font-medium text-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Log in
          </button>
          <button
            className={`flex-1 py-2 text-center transition-colors ${
              activeTab === 'signup' 
                ? 'border-b-2 border-blue-500 font-medium text-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign up
          </button>
        </div>
      </div>

      {activeTab === 'login' ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <SignupForm onSuccess={handleSuccess} />
      )}
    </Modal>
  );
};

export default AuthModal;