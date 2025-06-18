import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of professionals using Verifile"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;