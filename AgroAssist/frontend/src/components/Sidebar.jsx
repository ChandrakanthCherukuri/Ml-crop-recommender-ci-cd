import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Database, 
  Brain, 
  Users, 
  UserCog,
  Activity,
  Clipboard
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();

  const farmerLinks = [
    { to: '/farmer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/farmer/sensor-data', icon: Database, label: 'Sensor Data' },
    { to: '/farmer/add-sensor-data', icon: Activity, label: 'Add Data' },
    { to: '/farmer/ml-predictions', icon: Brain, label: 'ML Predictions' },
    { to: '/farmer/prediction-history', icon: Clipboard, label: 'History' },
  ];

  const agronomistLinks = [
    { to: '/agronomist/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/agronomist/farmers', icon: Users, label: 'My Farmers' },
    { to: '/agronomist/ml-predictions', icon: Brain, label: 'ML Predictions' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'All Users' },
    { to: '/admin/assignments', icon: UserCog, label: 'Assignments' },
    { to: '/admin/sensor-data', icon: Database, label: 'All Sensor Data' },
  ];

  const links = 
    user?.role === 'farmer' ? farmerLinks :
    user?.role === 'agronomist' ? agronomistLinks :
    user?.role === 'admin' ? adminLinks : [];

  return (
    <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
