import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CheckSquare, 
  Shield, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  ChevronDown, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  FileCheck,
  LogOut,
  Plus,
  Eye,
  EyeOff,
  Download,
  Filter,
  Trash2,
  Building2,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  X,
  Kanban,
  List,
  AlertTriangle,
  ArrowRight,
  Save
} from 'lucide-react';

// --- INITIAL MOCK DATA (Used to seed the state) ---

const BRANCHES = [
  'Ravulapalem (Head Office)',
  'Atreyapuram',
  'Amalapuram',
  'Versatile'
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Project Update', desc: 'GST Filing for TechFlow submitted for review', time: '5 min ago', icon: CheckSquare, color: 'bg-amber-100 text-amber-600' },
  { id: 2, title: 'New Client', desc: 'Rajesh Kumar added to Ravulapalem branch', time: '1 hour ago', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { id: 3, title: 'Payment Received', desc: '₹ 15,000 received from Green Earth NGO', time: '3 hours ago', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
];

const MOCK_STATS = [
  { label: 'Total Revenue (MTD)', value: '₹ 8,45,000', change: '+12.5%', trend: 'up', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Pending Projects', value: '142', change: '-4.2%', trend: 'down', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Active Clients', value: '854', change: '+8.1%', trend: 'up', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Review Pending', value: '28', change: '+2', trend: 'neutral', icon: CheckSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const INITIAL_PROJECTS = [
  { id: 1, title: 'GST Filing (Aug)', client: 'TechFlow Solutions', assignee: 'Rahul (Maker)', reviewer: 'Sneha (Checker)', status: 'Review Pending', due: 'Today', priority: 'High' },
  { id: 2, title: 'Audit Report 10B', client: 'Green Earth NGO', assignee: 'John (Maker)', reviewer: 'Amit (Checker)', status: 'In Progress', due: '3 Days', priority: 'Medium' },
  { id: 3, title: 'TDS Return Q2', client: 'Apex Builders', assignee: 'Priya (Maker)', reviewer: 'Sneha (Checker)', status: 'Completed', due: 'Done', priority: 'Normal' },
  { id: 4, title: 'Income Tax Return', client: 'Orion Logistics', assignee: 'Rahul (Maker)', reviewer: 'Amit (Checker)', status: 'Changes Requested', due: 'Overdue', priority: 'High' },
];

const INITIAL_CLIENTS = [
  { id: 1, name: 'TechFlow Solutions', type: 'Company', pan: 'AAECT1234M', mobile: '9876543210', status: 'Active' },
  { id: 2, name: 'Rajesh Kumar', type: 'Individual', pan: 'BKWPK5678L', mobile: '9988776655', status: 'Active' },
  { id: 3, name: 'Green Earth Foundation', type: 'Trust', pan: 'CHGPT9012K', mobile: '8877665544', status: 'Pending' },
];

const INITIAL_VAULT = [
  { id: 1, client: 'TechFlow Solutions', portal: 'GST Portal', username: 'GST12345', password: 'password123', updated: '2 days ago' },
  { id: 2, client: 'TechFlow Solutions', portal: 'Income Tax', username: 'AAECT1234M', password: 'securePass!', updated: '1 week ago' },
];

const INITIAL_INVOICES = [
  { id: 101, client: 'TechFlow Solutions', date: '2024-10-01', amount: '15000', status: 'Paid' },
  { id: 102, client: 'Apex Builders', date: '2024-10-05', amount: '45000', status: 'Unpaid' },
];

// --- UTILITY COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    'Review Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Changes Requested': 'bg-rose-50 text-rose-700 border-rose-200',
    'Paid': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Unpaid': 'bg-amber-50 text-amber-600 border-amber-200',
    'Overdue': 'bg-rose-50 text-rose-600 border-rose-200',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold border ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

// --- VIEW MODULES ---

// 1. Login Component
const LoginView = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <CheckSquare className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">VR <span className="text-indigo-400">Here</span></h1>
          <p className="text-slate-400 mt-2">Practice Management Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input type="email" defaultValue="admin@vrhere.com" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input type="password" defaultValue="password" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In to Portal'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">VR Here Platform v1.2.0</p>
        </div>
      </div>
    </div>
  );
};

// 2. Project Management View (Fully Functional)
const ProjectsView = () => {
  const [viewType, setViewType] = useState('kanban'); // 'kanban' or 'list'
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', client: '', priority: 'Normal', assignee: 'Rahul (Maker)' });

  const moveProject = (id, direction) => {
    const statuses = ['In Progress', 'Review Pending', 'Completed'];
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      const currentIndex = statuses.indexOf(p.status);
      if (currentIndex === -1 && p.status === 'Changes Requested') return { ...p, status: 'In Progress' }; // Retry
      if (currentIndex === -1) return p;
      
      let newIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= 0 && newIndex < statuses.length) {
        return { ...p, status: statuses[newIndex] };
      }
      return p;
    }));
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.client) return;
    const project = {
      id: Date.now(),
      ...newProject,
      reviewer: 'Sneha (Checker)',
      status: 'In Progress',
      due: '5 Days'
    };
    setProjects([...projects, project]);
    setNewProject({ title: '', client: '', priority: 'Normal', assignee: 'Rahul (Maker)' });
    setShowAddModal(false);
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const KanbanColumn = ({ title, status, count }) => (
    <div className="flex-1 min-w-[280px] bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700">{title}</h3>
        <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">{count}</span>
      </div>
      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {projects.filter(p => p.status === status).map(project => (
          <div key={project.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative animate-in fade-in zoom-in duration-300">
             <div className="flex justify-between items-start mb-2">
               <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${project.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{project.priority}</span>
               <div className="flex gap-1">
                 <button onClick={() => deleteProject(project.id)} className="text-slate-300 hover:text-rose-500"><Trash2 size={14}/></button>
               </div>
             </div>
             <h4 className="font-bold text-slate-800 text-sm mb-1">{project.title}</h4>
             <p className="text-xs text-slate-500 mb-3">{project.client}</p>
             
             <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2">
                   {project.status !== 'In Progress' && project.status !== 'Changes Requested' && (
                     <button onClick={() => moveProject(project.id, 'back')} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600" title="Move Back"><ArrowRight size={12} className="rotate-180"/></button>
                   )}
                   <div className="text-xs font-mono text-slate-400">{project.assignee.split(' ')[0]}</div>
                   {project.status !== 'Completed' && (
                     <button onClick={() => moveProject(project.id, 'forward')} className="p-1 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-600" title="Move Forward"><ArrowRight size={12}/></button>
                   )}
                </div>
                <span className={`text-xs font-medium ${project.due === 'Overdue' ? 'text-rose-600' : 'text-slate-400'}`}>{project.due}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col animate-in fade-in zoom-in duration-300 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Project Management</h2>
          <p className="text-slate-500">Maker-Checker Workflow Overview</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setViewType('list')} className={`p-2 rounded-lg border ${viewType === 'list' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'}`}><List size={20}/></button>
           <button onClick={() => setViewType('kanban')} className={`p-2 rounded-lg border ${viewType === 'kanban' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'}`}><Kanban size={20}/></button>
           <button onClick={() => setShowAddModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
             <Plus size={18} className="mr-2" /> New Project
           </button>
        </div>
      </div>

      {viewType === 'kanban' ? (
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
           <KanbanColumn title="Execution (Maker)" status="In Progress" count={projects.filter(p=>p.status==='In Progress').length} />
           <KanbanColumn title="Review (Checker)" status="Review Pending" count={projects.filter(p=>p.status==='Review Pending').length} />
           <KanbanColumn title="Changes Requested" status="Changes Requested" count={projects.filter(p=>p.status==='Changes Requested').length} />
           <KanbanColumn title="Completed" status="Completed" count={projects.filter(p=>p.status==='Completed').length} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Project</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Maker</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-700">{project.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{project.client}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{project.assignee}</td>
                  <td className="px-6 py-4"><StatusBadge status={project.status} /></td>
                  <td className="px-6 py-4"><button onClick={() => deleteProject(project.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Project Modal Overlay */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm rounded-2xl">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-800">Create New Project</h3>
               <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Project Title</label>
                <input autoFocus value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="e.g. Audit FY24" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Client Name</label>
                <input value={newProject.client} onChange={(e) => setNewProject({...newProject, client: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="Client Name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Priority</label>
                <select value={newProject.priority} onChange={(e) => setNewProject({...newProject, priority: e.target.value})} className="w-full p-2 border rounded-lg">
                  <option>Normal</option>
                  <option>High</option>
                  <option>Low</option>
                </select>
              </div>
              <button onClick={handleAddProject} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors">Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. CRM View (Fully Functional)
const CRMView = () => {
  const [view, setView] = useState('list');
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [formData, setFormData] = useState({ name: '', type: 'Individual', pan: '', mobile: '', email: '' });
  const [services, setServices] = useState({ gst: false, it: false, tds: false, pf: false });

  const toggleService = (key) => setServices({ ...services, [key]: !services[key] });

  const handleAddClient = () => {
    if(!formData.name || !formData.pan) return;
    const newClient = {
      id: Date.now(),
      ...formData,
      status: 'Active'
    };
    setClients([...clients, newClient]);
    setView('list');
    setFormData({ name: '', type: 'Individual', pan: '', mobile: '', email: '' });
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  if (view === 'list') {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Client Directory</h2>
            <p className="text-slate-500">Manage your audit clients and their entities.</p>
          </div>
          <button onClick={() => setView('add')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5">
            <Plus size={18} className="mr-2" /> Add New Client
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">PAN/ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{client.name}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                      client.type === 'Company' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      client.type === 'Individual' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>{client.type}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{client.pan}</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span></td>
                  <td className="px-6 py-4 text-slate-400">
                    <button onClick={() => deleteClient(client.id)} className="hover:text-rose-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clients.length === 0 && <div className="p-8 text-center text-slate-400">No clients found. Add one to get started.</div>}
        </div>
      </div>
    );
  }

  // --- ATTRACTIVE ADD CLIENT FORM ---
  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-right duration-300 pb-10">
      <div className="flex items-center mb-8">
        <button onClick={() => setView('list')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all mr-4 shadow-sm">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Onboard New Client</h2>
          <p className="text-slate-500">Enter client details and configure services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card 1: Identity */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100/50 overflow-hidden">
            <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 flex items-center"><User size={18} className="mr-2 text-indigo-500"/> Client Identity</h3>
              <div className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Step 1</div>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-3">Customer Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Individual', 'Company', 'Partnership', 'Trust'].map(type => (
                    <button 
                      key={type} onClick={() => setFormData({...formData, type})}
                      className={`py-2 px-3 rounded-xl text-sm font-medium transition-all border-2 ${formData.type === type ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {formData.type === 'Individual' ? (
                  <>
                    <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Full Name</label><input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Rajesh Kumar" /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Father's Name</label><input className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Ramesh Kumar" /></div>
                  </>
                ) : (
                  <div className="col-span-2 space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">{formData.type} Name</label><input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder={`e.g. AVR Tech Pvt Ltd`} /></div>
                )}
                
                <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">{formData.type === 'Individual' ? 'Date of Birth' : 'Formation Date'}</label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="date" className="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl outline-none" /></div></div>
                <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">PAN Number</label><input value={formData.pan} onChange={(e) => setFormData({...formData, pan: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl font-mono uppercase" maxLength={10} placeholder="ABCDE1234F" /></div>
              </div>
            </div>
          </div>

          {/* Card 2: Contact */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100/50 overflow-hidden">
             <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between"><h3 className="font-bold text-slate-700 flex items-center"><MapPin size={18} className="mr-2 text-indigo-500"/> Contact Details</h3></div>
             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Mobile Number</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl outline-none" placeholder="98765 43210" /></div></div>
                <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Email Address</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl outline-none" placeholder="client@example.com" /></div></div>
                <div className="col-span-full space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Full Address</label><textarea className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl outline-none" rows={2} placeholder="Street, City, State, Pincode" /></div>
             </div>
          </div>
        </div>

        {/* Right Col: Services & Vault (Sticky) */}
        <div className="space-y-8">
           <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/20 sticky top-24">
              <h3 className="font-bold text-xl mb-1">Services & Vault</h3>
              <p className="text-indigo-200 text-sm mb-6">Enable services to unlock credential fields.</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['Income Tax', 'GST', 'TDS', 'PF & ESI', 'Audit', 'MSME'].map((svc) => {
                  const key = svc.toLowerCase().split(' ')[0];
                  return (
                    <div 
                      key={svc} onClick={() => toggleService(key)}
                      className={`cursor-pointer rounded-xl p-3 border transition-all duration-200 relative overflow-hidden ${services[key] ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-900/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                      {services[key] && <div className="absolute top-1 right-1"><CheckCircle2 size={14} className="text-white"/></div>}
                      <span className={`text-sm font-semibold ${services[key] ? 'text-white' : 'text-slate-300'}`}>{svc}</span>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Credential Fields */}
              <div className="space-y-4">
                 {services.gst && (
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                       <div className="flex items-center text-blue-300 font-bold text-xs uppercase mb-3"><Building2 size={12} className="mr-1.5"/> GST Credentials</div>
                       <input className="w-full bg-slate-900/50 border-none rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 mb-2 focus:ring-1 focus:ring-blue-400" placeholder="GST UserID" />
                       <input className="w-full bg-slate-900/50 border-none rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-blue-400" type="password" placeholder="GST Password" />
                    </div>
                 )}
                 {services.income && (
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                       <div className="flex items-center text-emerald-300 font-bold text-xs uppercase mb-3"><CreditCard size={12} className="mr-1.5"/> Income Tax</div>
                       <input className="w-full bg-slate-900/50 border-none rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 mb-2 focus:ring-1 focus:ring-emerald-400" placeholder="IT Portal Password" type="password"/>
                       <select className="w-full bg-slate-900/50 border-none rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-400">
                          <option className="text-slate-900">ITR 1</option>
                          <option className="text-slate-900">ITR 4</option>
                       </select>
                    </div>
                 )}
              </div>

              <button onClick={handleAddClient} className="w-full mt-6 bg-white text-indigo-900 font-bold py-3.5 rounded-xl hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center transform active:scale-95">
                 <CheckCircle2 size={18} className="mr-2"/> Onboard Client
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

// 4. Vault View (Fully Functional)
const VaultView = () => {
  const [vaultItems, setVaultItems] = useState(INITIAL_VAULT);
  const [revealed, setRevealed] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ client: '', portal: '', username: '', password: '' });

  const toggleReveal = (id) => setRevealed(prev => ({ ...prev, [id]: !prev[id] }));

  const addItem = () => {
     if(!newItem.client || !newItem.username) return;
     setVaultItems([...vaultItems, { id: Date.now(), ...newItem, updated: 'Just now' }]);
     setNewItem({ client: '', portal: '', username: '', password: '' });
     setShowAdd(false);
  };
  
  const deleteItem = (id) => {
    setVaultItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300 relative">
       <div className="flex justify-between items-center">
          <div><h2 className="text-2xl font-bold text-slate-800">Credential Vault</h2><p className="text-slate-500">Securely manage client portal passwords.</p></div>
          <div className="flex gap-2">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm" /></div>
            <button onClick={() => setShowAdd(true)} className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-indigo-700 transition-colors"><Plus size={16} className="mr-1"/> Add</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaultItems.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
              <button onClick={() => deleteItem(item.id)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Shield size={20} /></div>
              </div>
              <h3 className="font-bold text-slate-800">{item.client}</h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1 mb-4">{item.portal}</p>
              <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-sm"><span className="text-slate-500">User:</span><span className="font-mono text-slate-700 select-all">{item.username}</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-slate-500">Pass:</span><div className="flex items-center gap-2"><span className="font-mono text-slate-700">{revealed[item.id] ? item.password : '••••••••'}</span><button onClick={() => toggleReveal(item.id)} className="text-slate-400 hover:text-indigo-600">{revealed[item.id] ? <EyeOff size={14}/> : <Eye size={14}/>}</button></div></div>
              </div>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm rounded-2xl">
             <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-slate-100">
               <h3 className="text-lg font-bold mb-4">Add Credential</h3>
               <div className="space-y-3">
                 <input placeholder="Client Name" className="w-full p-2 border rounded" value={newItem.client} onChange={e => setNewItem({...newItem, client: e.target.value})} />
                 <input placeholder="Portal (e.g. GST)" className="w-full p-2 border rounded" value={newItem.portal} onChange={e => setNewItem({...newItem, portal: e.target.value})} />
                 <input placeholder="Username" className="w-full p-2 border rounded" value={newItem.username} onChange={e => setNewItem({...newItem, username: e.target.value})} />
                 <input placeholder="Password" className="w-full p-2 border rounded" value={newItem.password} onChange={e => setNewItem({...newItem, password: e.target.value})} />
                 <div className="flex gap-2 pt-2">
                   <button onClick={addItem} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">Save</button>
                   <button onClick={() => setShowAdd(false)} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg">Cancel</button>
                 </div>
               </div>
             </div>
          </div>
        )}
    </div>
  );
};

// 5. Invoices View (Fully Functional)
const InvoicesView = () => {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [showCreate, setShowCreate] = useState(false);
  const [newInv, setNewInv] = useState({ client: '', amount: '', date: '' });

  const createInvoice = () => {
     if(!newInv.client || !newInv.amount) return;
     setInvoices([{ id: 100 + invoices.length + 1, ...newInv, status: 'Unpaid' }, ...invoices]);
     setNewInv({ client: '', amount: '', date: '' });
     setShowCreate(false);
  };
  
  const deleteInvoice = (id) => setInvoices(prev => prev.filter(i => i.id !== id));

  return (
  <div className="space-y-6 animate-in fade-in zoom-in duration-300 relative">
     <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-slate-800">Invoices</h2><p className="text-slate-500">Billing and payments overview.</p></div>
        <button onClick={() => setShowCreate(true)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center hover:bg-slate-800 transition-colors"><Plus size={16} className="mr-2" /> Create Invoice</button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Invoice ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-600">#{inv.id}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{inv.client}</td>
                <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                <td className="px-6 py-4 font-bold text-slate-700">₹ {parseInt(inv.amount).toLocaleString()}</td>
                <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="text-slate-400 hover:text-indigo-600"><Download size={16}/></button>
                  <button onClick={() => deleteInvoice(inv.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm rounded-2xl">
             <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-slate-100">
               <h3 className="text-lg font-bold mb-4">Create Invoice</h3>
               <div className="space-y-3">
                 <input placeholder="Client Name" className="w-full p-2 border rounded" value={newInv.client} onChange={e => setNewInv({...newInv, client: e.target.value})} />
                 <input type="date" className="w-full p-2 border rounded" value={newInv.date} onChange={e => setNewInv({...newInv, date: e.target.value})} />
                 <input type="number" placeholder="Amount" className="w-full p-2 border rounded" value={newInv.amount} onChange={e => setNewInv({...newInv, amount: e.target.value})} />
                 <div className="flex gap-2 pt-2">
                   <button onClick={createInvoice} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">Generate</button>
                   <button onClick={() => setShowCreate(false)} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg">Cancel</button>
                 </div>
               </div>
             </div>
          </div>
      )}
  </div>
  );
};

// --- MAIN APP COMPONENT ---

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button onClick={onClick} className={`flex items-center w-full p-3 mb-2 rounded-xl transition-all duration-200 group ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600'}`} title={collapsed ? label : ''}>
    <Icon size={20} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors shrink-0`} />
    <span className={`ml-3 font-medium text-sm whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>{label}</span>
    {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-50" />}
  </button>
);

const StatCard = ({ stat }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${stat.bg}`}><stat.icon size={22} className={stat.color} /></div>
      <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}><span>{stat.change}</span>{stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}</div>
    </div>
    <div className="mt-4"><h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3><p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p></div>
  </div>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); 
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  if (!isLoggedIn) return <LoginView onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white h-full border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-20 shadow-xl`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 shrink-0">VR</div>
            <span className={`font-bold text-xl tracking-tight text-slate-800 transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>VR <span className="text-indigo-600">Here</span></span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={Kanban} label="Project Management" active={activeTab === 'Projects'} onClick={() => setActiveTab('Projects')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={Users} label="Client CRM" active={activeTab === 'CRM'} onClick={() => setActiveTab('CRM')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={FileText} label="Invoices & Billing" active={activeTab === 'Invoices'} onClick={() => setActiveTab('Invoices')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={Shield} label="Credential Vault" active={activeTab === 'Vault'} onClick={() => setActiveTab('Vault')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} collapsed={sidebarCollapsed} />
        </div>

        <div className="p-4 border-t border-slate-100">
           <button onClick={() => setIsLoggedIn(false)} className="flex items-center w-full p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors">
              <LogOut size={20} className="shrink-0" />
              <span className={`ml-3 font-medium text-sm transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>Logout</span>
           </button>
        </div>
      </aside>

      {/* --- CONTENT --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search projects, clients..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>
          <div className="flex items-center gap-6">
            
            {/* Branch Selector */}
            <div className="relative">
              <div onClick={() => setShowBranchMenu(!showBranchMenu)} className="hidden md:flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors">
                <Briefcase size={16} className="text-indigo-600 mr-2" />
                <span className="text-sm font-medium text-indigo-900 mr-2">{selectedBranch}</span>
                <ChevronDown size={14} className="text-indigo-400" />
              </div>
              {showBranchMenu && (
                <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                   {BRANCHES.map(branch => (
                     <button key={branch} onClick={() => { setSelectedBranch(branch); setShowBranchMenu(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${selectedBranch === branch ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'}`}>{branch}</button>
                   ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <Bell size={20} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
              </button>
              {showNotifications && (
                 <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center"><span className="text-xs font-bold text-slate-500 uppercase">Notifications</span><button onClick={() => setShowNotifications(false)}><X size={14} className="text-slate-400"/></button></div>
                    <div className="max-h-64 overflow-y-auto">
                       {notifications.map(notif => (
                          <div key={notif.id} className="p-3 hover:bg-slate-50 border-b border-slate-50 transition-colors flex items-start gap-3">
                             <div className={`p-2 rounded-full shrink-0 ${notif.color}`}><notif.icon size={16} /></div>
                             <div><h4 className="text-sm font-semibold text-slate-800">{notif.title}</h4><p className="text-xs text-slate-500 mt-0.5">{notif.desc}</p><p className="text-[10px] text-slate-400 mt-1">{notif.time}</p></div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 cursor-pointer"><div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-indigo-600">VR</div></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'Dashboard' && (
             <div className="animate-in fade-in zoom-in duration-300">
                <div className="mb-8"><h1 className="text-2xl font-bold text-slate-800">Hello, Admin 👋</h1><p className="text-slate-500">Overview for <b>{selectedBranch}</b></p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">{MOCK_STATS.map((stat, idx) => <StatCard key={idx} stat={stat} />)}</div>
                <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400"><h3 className="font-bold text-lg mb-2">Welcome to the Dashboard</h3><p className="text-sm">Select 'Project Management' to view the Kanban board or 'CRM' to onboard clients.</p></div>
             </div>
          )}
          {activeTab === 'Projects' && <ProjectsView />}
          {activeTab === 'CRM' && <CRMView />}
          {activeTab === 'Vault' && <VaultView />}
          {activeTab === 'Invoices' && <InvoicesView />}
          {activeTab === 'Settings' && <div className="text-center mt-20 text-slate-400">Settings Module Placeholder</div>}
        </div>
      </main>
    </div>
  );
}