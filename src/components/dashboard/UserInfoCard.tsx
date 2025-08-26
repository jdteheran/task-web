import type { User } from '../../types/auth';

interface UserInfoCardProps {
  user: User;
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Información del Usuario
      </h3>
      <div className="space-y-2 text-left">
        <div className="flex justify-between">
          <span className="text-gray-600">ID:</span>
          <span className="font-mono text-sm">{user.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Usuario:</span>
          <span className="font-semibold">{user.username}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Email:</span>
          <span>{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Creado:</span>
          <span className="text-sm">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserInfoCard;