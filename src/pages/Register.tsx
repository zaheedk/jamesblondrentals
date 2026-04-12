
import RegisterForm from '@/components/auth/RegisterForm';
import PageSEO from '@/components/PageSEO';


export default function Register() {
  return (
    <div className="container mx-auto px-4 py-12">
      <PageSEO title="Register – Create Your James Blond Rentals Account" description="Create a free account with James Blond Rentals for faster bookings, rental history and exclusive member deals." canonical="/register" />
      <RegisterForm />
    </div>
  );
}
