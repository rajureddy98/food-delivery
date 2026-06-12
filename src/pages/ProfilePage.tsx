import { useState, useEffect } from 'react';
import { ArrowLeft, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { user, profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultAddress, setDefaultAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setDefaultAddress(profile.default_address || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { error } = await updateProfile({
      full_name: fullName,
      phone,
      default_address: defaultAddress,
    });

    setLoading(false);

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-emerald-600 text-white py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <UserIcon className="text-emerald-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-emerald-100">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Personal Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />

            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Delivery Address
              </label>
              <textarea
                value={defaultAddress}
                onChange={(e) => setDefaultAddress(e.target.value)}
                placeholder="Enter your default delivery address"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                Profile updated successfully!
              </div>
            )}

            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
