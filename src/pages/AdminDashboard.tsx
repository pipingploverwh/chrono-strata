import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Shield,
  Users,
  MapPin,
  LogOut,
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface WeatherLog {
  id: string;
  latitude: number;
  longitude: number;
  location_name: string | null;
  session_id: string;
  page_source: string | null;
  user_agent: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, isLoading: authLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [weatherLogs, setWeatherLogs] = useState<WeatherLog[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchUserRoles();
      fetchWeatherLogs();
    }
  }, [user, isAdmin]);

  const fetchUserRoles = async () => {
    setIsLoadingRoles(true);
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching roles:', error);
    } else {
      setUserRoles(data || []);
    }
    setIsLoadingRoles(false);
  };

  const fetchWeatherLogs = async () => {
    setIsLoadingLogs(true);
    const { data, error } = await supabase
      .from('weather_coordinate_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching logs:', error);
    } else {
      setWeatherLogs(data || []);
    }
    setIsLoadingLogs(false);
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) return;

    setIsAddingAdmin(true);
    try {
      // Note: In production, you'd look up the user ID by email
      // For now, we'll show a message about the process
      toast({
        title: 'Admin Addition',
        description: 'To add an admin, the user must first sign up. Then use their user ID from the auth.users table.',
      });
    } finally {
      setIsAddingAdmin(false);
      setNewAdminEmail('');
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', roleId);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove role',
      });
    } else {
      toast({ title: 'Role removed' });
      fetchUserRoles();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-white mb-2">Access Denied</h1>
          <p className="text-neutral-400 mb-6">
            You don't have admin privileges to access this dashboard.
          </p>
          <Button onClick={handleSignOut} variant="outline" className="border-neutral-700 text-white">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-medium">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">{user.email}</span>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-neutral-400 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="bg-neutral-900 border border-neutral-800">
            <TabsTrigger value="roles" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black">
              <Users className="w-4 h-4 mr-2" />
              User Roles
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black">
              <MapPin className="w-4 h-4 mr-2" />
              Weather Logs
            </TabsTrigger>
          </TabsList>

          {/* User Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <h2 className="text-lg font-medium mb-4">Add New Admin</h2>
              <div className="flex gap-4">
                <Input
                  placeholder="User email address"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="max-w-md bg-neutral-800 border-neutral-700 text-white"
                />
                <Button
                  onClick={handleAddAdmin}
                  disabled={isAddingAdmin}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </Button>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-800 hover:bg-transparent">
                    <TableHead className="text-neutral-400">User ID</TableHead>
                    <TableHead className="text-neutral-400">Role</TableHead>
                    <TableHead className="text-neutral-400">Created</TableHead>
                    <TableHead className="text-neutral-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingRoles ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <Loader2 className="w-6 h-6 text-neutral-500 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : userRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-neutral-500">
                        No user roles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    userRoles.map((role) => (
                      <TableRow key={role.id} className="border-neutral-800">
                        <TableCell className="font-mono text-sm">{role.user_id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            role.role === 'admin' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-neutral-700 text-neutral-300'
                          }`}>
                            {role.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-neutral-400">
                          {new Date(role.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleRemoveRole(role.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Weather Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Weather Coordinate Logs</h2>
              <Button
                onClick={fetchWeatherLogs}
                variant="outline"
                size="sm"
                className="border-neutral-700 text-neutral-300"
              >
                Refresh
              </Button>
            </div>

            <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-800 hover:bg-transparent">
                    <TableHead className="text-neutral-400">Location</TableHead>
                    <TableHead className="text-neutral-400">Coordinates</TableHead>
                    <TableHead className="text-neutral-400">Session</TableHead>
                    <TableHead className="text-neutral-400">Page</TableHead>
                    <TableHead className="text-neutral-400">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingLogs ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="w-6 h-6 text-neutral-500 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : weatherLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                        No weather logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    weatherLogs.map((log) => (
                      <TableRow key={log.id} className="border-neutral-800">
                        <TableCell>{log.location_name || 'Unknown'}</TableCell>
                        <TableCell className="font-mono text-sm text-neutral-400">
                          {Number(log.latitude).toFixed(4)}, {Number(log.longitude).toFixed(4)}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-neutral-500">
                          {log.session_id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="text-neutral-400">
                          {log.page_source || '-'}
                        </TableCell>
                        <TableCell className="text-neutral-400">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
