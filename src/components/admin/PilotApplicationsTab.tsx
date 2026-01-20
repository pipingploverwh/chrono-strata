import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Building2, Mail, Calendar, Search } from 'lucide-react';

interface PilotApplication {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_title: string | null;
  industry: string;
  company_size: string;
  use_case: string;
  use_case_details: string | null;
  desired_timeline: string;
  budget_range: string | null;
  current_solution: string | null;
  status: string | null;
  priority: string | null;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  qualified: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  in_progress: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  closed_won: 'bg-green-500/20 text-green-400 border-green-500/30',
  closed_lost: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-slate-500/20 text-slate-400',
};

const PilotApplicationsTab = () => {
  const [applications, setApplications] = useState<PilotApplication[]>([]);
  const [filteredApps, setFilteredApps] = useState<PilotApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [timelineFilter, setTimelineFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique values for filters
  const industries = [...new Set(applications.map(a => a.industry))];
  const timelines = [...new Set(applications.map(a => a.desired_timeline))];

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let result = applications;

    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter);
    }
    if (industryFilter !== 'all') {
      result = result.filter(a => a.industry === industryFilter);
    }
    if (timelineFilter !== 'all') {
      result = result.filter(a => a.desired_timeline === timelineFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.company_name.toLowerCase().includes(query) ||
        a.contact_name.toLowerCase().includes(query) ||
        a.contact_email.toLowerCase().includes(query)
      );
    }

    setFilteredApps(result);
  }, [applications, statusFilter, industryFilter, timelineFilter, searchQuery]);

  const fetchApplications = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('pilot_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
    } else {
      setApplications(data || []);
    }
    setIsLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('pilot_applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setApplications(prev => 
        prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Search company, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-neutral-800 border-neutral-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="closed_won">Closed Won</SelectItem>
              <SelectItem value="closed_lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[180px] bg-neutral-800 border-neutral-700 text-white">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map(ind => (
                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timelineFilter} onValueChange={setTimelineFilter}>
            <SelectTrigger className="w-[180px] bg-neutral-800 border-neutral-700 text-white">
              <SelectValue placeholder="Timeline" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="all">All Timelines</SelectItem>
              {timelines.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={fetchApplications}
            variant="outline"
            size="sm"
            className="border-neutral-700 text-neutral-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-2xl font-bold text-white">{applications.length}</div>
          <div className="text-sm text-neutral-400">Total Applications</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-2xl font-bold text-blue-400">
            {applications.filter(a => a.status === 'new').length}
          </div>
          <div className="text-sm text-neutral-400">New This Week</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-2xl font-bold text-emerald-400">
            {applications.filter(a => a.status === 'qualified').length}
          </div>
          <div className="text-sm text-neutral-400">Qualified</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-2xl font-bold text-purple-400">
            {applications.filter(a => a.status === 'in_progress').length}
          </div>
          <div className="text-sm text-neutral-400">In Progress</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="text-neutral-400">Company</TableHead>
              <TableHead className="text-neutral-400">Contact</TableHead>
              <TableHead className="text-neutral-400">Industry</TableHead>
              <TableHead className="text-neutral-400">Use Case</TableHead>
              <TableHead className="text-neutral-400">Timeline</TableHead>
              <TableHead className="text-neutral-400">Status</TableHead>
              <TableHead className="text-neutral-400">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="w-6 h-6 text-neutral-500 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                  No pilot applications found
                </TableCell>
              </TableRow>
            ) : (
              filteredApps.map((app) => (
                <TableRow key={app.id} className="border-neutral-800">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-neutral-500" />
                      <div>
                        <div className="font-medium text-white">{app.company_name}</div>
                        <div className="text-xs text-neutral-500">{app.company_size}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-white">{app.contact_name}</div>
                      <div className="text-xs text-neutral-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {app.contact_email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                      {app.industry}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="text-neutral-300 truncate">{app.use_case}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-neutral-400">
                      <Calendar className="w-3 h-3" />
                      <span className="text-sm">{app.desired_timeline}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={app.status || 'new'} 
                      onValueChange={(val) => updateStatus(app.id, val)}
                    >
                      <SelectTrigger className={`w-[130px] h-8 text-xs border ${statusColors[app.status || 'new']} bg-transparent`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="closed_won">Closed Won</SelectItem>
                        <SelectItem value="closed_lost">Closed Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-neutral-400 text-sm">
                    {new Date(app.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PilotApplicationsTab;
