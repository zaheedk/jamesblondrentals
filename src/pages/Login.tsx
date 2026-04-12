
import LoginForm from '@/components/auth/LoginForm';
import PageSEO from '@/components/PageSEO';


export default function Login() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageSEO title="Login – James Blond Rentals Member Portal" description="Sign in to your James Blond Rentals account to manage bookings, view rental history and access member benefits." canonical="/login" />
      <LoginForm />
    </div>
  );
}
