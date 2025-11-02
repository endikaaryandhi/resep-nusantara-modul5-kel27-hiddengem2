// src/components/common/LoadingSpinner.jsx
import { Loader } from 'lucide-react';

export default function LoadingSpinner({ text = 'Memuat...' }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="text-center">
        <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-600 text-lg font-medium">{text}</p>
      </div>
    </div>
  );
}