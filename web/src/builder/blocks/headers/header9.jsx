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
  Lock,
  Building2,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  X
} from 'lucide-react';

// --- MOCK DATA ---

const BRANCHES = [
  'Ravulapalem (Head Office)',
  'Atreyapuram',
  'Amalapuram',
  'Versatile'
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'New Client Assigned', desc: 'TechFlow Solutions assigned to Ravulapalem', time: '10 min ago', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { id: 2, title: 'GST Filing Overdue', desc: 'Client: Apex Builders (Aug Return)', time: '1 hour ago', icon: AlertCircle, color: 'bg-rose-100 text-rose-600' },
  { id: 3, title: 'Payment Received', desc: '₹ 15,000 received from Green Earth NGO', time: '3 hours ago', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
];

const MOCK_STATS = [
  { label: 'Total Revenue (MTD)', value: '₹ 8,45,000', change: '+12.5%', trend: 'up', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Pending Tax Filings', value: '142', change: '-4.2%', trend: 'down', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Active Clients', value: '854', change: '+8.1%', trend: 'up', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Tasks in Review', value: '28', change: '+2', trend: 'neutral', icon: CheckSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const MOCK_TASKS = [
  { id: 1, client: 'TechFlow Solutions', service: 'GST Filing (Aug)', assignee: 'Rahul (Maker)', reviewer: 'Sneha (Checker)', status: 'Review Pending', due: '2 Days' },
  { id: 2, client: 'Green Earth NGO', service: 'Audit Report 10B', assignee: 'John (Maker)', reviewer: 'Amit (Checker)', status: 'In Progress', due: '5 Days' },
  { id: 3, client: 'Apex Builders', service: 'TDS Return Q2', assignee: 'Priya (Maker)', reviewer: 'Sneha (Checker)', status: 'Approved', due: 'Completed' },
  { id: 4, client: 'Orion Logistics', service: 'Income Tax Return', assignee: 'Rahul (Maker)', reviewer: 'Amit (Checker)', status: 'Rejected', due: 'Overdue' },
  { id: 5, client: 'Zenith Healthcare', service: 'Consultancy', assignee: 'Arjun (Maker)', reviewer: 'Sneha (Checker)', status: 'In Progress', due: '1 Day' },
];

const MOCK_CLIENTS = [
  { id: 1, name: 'TechFlow Solutions', type: 'Company', pan: 'AAECT1234M', mobile: '9876543210', status: 'Active' },
  { id: 2, name: 'Rajesh Kumar', type: 'Individual', pan: 'BKWPK5678L', mobile: '9988776655', status: 'Active' },
  { id: 3, name: 'Green Earth Foundation', type: 'Trust', pan: 'CHGPT9012K', mobile: '8877665544', status: 'Pending' },
];

const MOCK_VAULT = [
  { id: 1, client: 'TechFlow Solutions', portal: 'GST Portal', username: 'GST12345', password: 'password123', updated: '2 days ago' },
  { id: 2, client: 'TechFlow Solutions', portal: 'Income Tax', username: 'AAECT1234M', password: 'securePass!', updated: '1 week ago' },
  { id: 3, client: 'Rajesh Kumar', portal: 'Trace (TDS)', username: 'TANBLR123', password: 'myTdsPassword', updated: '1 month ago' },
];

const MOCK_INVOICES = [
  { id: 101, client: 'TechFlow Solutions', date: '01 Oct 2024', amount: '₹ 15,000', status: 'Paid' },
  { id: 102, client: 'Apex Builders', date: '05 Oct 2024', amount: '₹ 45,000', status: 'Unpaid' },
  { id: 103, client: 'Green Earth NGO', date: '10 Oct 2024', amount: '₹ 8,500', status: 'Overdue' },
];

// --- SUB-COMPONENTS ---

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
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AVR <span className="text-indigo-400">Associates</span></h1>
          <p className="text-slate-400 mt-2">Firm Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input type="email" defaultValue="admin@avrassociates.com" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
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
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In to Dashboard'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">Secured by 256-bit Encryption</p>
        </div>
      </div>
    </div>
  );
};

// 2. CRM Module (Dynamic Form Logic)
const CRMView = () => {
  const [view, setView] = useState('list'); // 'list' or 'add'
  const [clientType, setClientType] = useState('Individual');
  const [services, setServices] = useState({ gst: false, it: false, tds: false, pf: false });

  // Toggle Service
  const toggleService = (key) => setServices({ ...services, [key]: !services[key] });

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
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Mobile</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CLIENTS.map((client) => (
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
                  <td className="px-6 py-4 text-slate-600">{client.mobile}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    <button className="hover:text-indigo-600"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- REDESIGNED ATTRACTIVE ADD CLIENT FORM ---
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
                      key={type}
                      onClick={() => setClientType(type)}
                      className={`py-2 px-3 rounded-xl text-sm font-medium transition-all border-2 ${
                        clientType === type 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {clientType === 'Individual' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Rajesh Kumar" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Father's Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Ramesh Kumar" />
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">{clientType} Name</label>
                      <input className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder={`e.g. AVR Tech Pvt Ltd`} />
                  </div>
                )}
                
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase">{clientType === 'Individual' ? 'Date of Birth' : 'Formation Date'}</label>
                   <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input type="date" className="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase">PAN Number</label>
                   <input className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all uppercase font-mono" maxLength={10} placeholder="ABCDE1234F" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Contact */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-100/50 overflow-hidden">
             <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-700 flex items-center"><MapPin size={18} className="mr-2 text-indigo-500"/> Contact Details</h3>
             </div>
             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase">Mobile Number</label>
                   <div className="relative">
                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input className="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="98765 43210" />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input className="w-full pl-10 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="client@example.com" />
                   </div>
                </div>
                <div className="col-span-full space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase">Full Address</label>
                   <textarea className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" rows={2} placeholder="Street, City, State, Pincode" />
                </div>
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
                      key={svc} 
                      onClick={() => toggleService(key)}
                      className={`cursor-pointer rounded-xl p-3 border transition-all duration-200 relative overflow-hidden ${
                        services[key] 
                        ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-900/50' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
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

              <button className="w-full mt-6 bg-white text-indigo-900 font-bold py-3.5 rounded-xl hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center">
                 <CheckCircle2 size={18} className="mr-2"/> Onboard Client
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

// 3. Vault View
const VaultView = () => {
  const [revealed, setRevealed] = useState({});

  const toggleReveal = (id) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Credential Vault</h2>
            <p className="text-slate-500">Securely manage client portal passwords.</p>
          </div>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input type="text" placeholder="Search credentials..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_VAULT.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Shield size={20} />
                </div>
                <button className="text-slate-300 hover:text-indigo-600"><MoreVertical size={16}/></button>
              </div>
              <h3 className="font-bold text-slate-800">{item.client}</h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1 mb-4">{item.portal}</p>
              
              <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">User:</span>
                  <span className="font-mono text-slate-700 select-all">{item.username}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Pass:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-700">
                      {revealed[item.id] ? item.password : '••••••••'}
                    </span>
                    <button onClick={() => toggleReveal(item.id)} className="text-slate-400 hover:text-indigo-600">
                      {revealed[item.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

// 4. Invoices View
const InvoicesView = () => (
  <div className="space-y-6 animate-in fade-in zoom-in duration-300">
     <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Invoices</h2>
          <p className="text-slate-500">Billing and payments overview.</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center">
          <Plus size={16} className="mr-2" /> Create Invoice
        </button>
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
            {MOCK_INVOICES.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-600">#{inv.id}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{inv.client}</td>
                <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                <td className="px-6 py-4 font-bold text-slate-700">{inv.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                    inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    inv.status === 'Overdue' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                    'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-400 hover:text-indigo-600"><Download size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  </div>
);

// 5. Reports View (Dummy)
const ReportsView = () => (
   <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold text-slate-800">Firm Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-64 flex flex-col items-center justify-center text-slate-400">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Briefcase size={24}/></div>
           <p>Revenue Chart Placeholder</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-64 flex flex-col items-center justify-center text-slate-400">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><CheckSquare size={24}/></div>
           <p>Task Completion Rate Placeholder</p>
        </div>
      </div>
   </div>
);

// --- MAIN APP COMPONENT ---

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 mb-2 rounded-xl transition-all duration-200 group
      ${active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600'
      }`}
    title={collapsed ? label : ''}
  >
    <Icon size={20} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors shrink-0`} />
    <span className={`ml-3 font-medium text-sm whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
      {label}
    </span>
    {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-50" />}
  </button>
);

const StatCard = ({ stat }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${stat.bg}`}>
        <stat.icon size={22} className={stat.color} />
      </div>
      <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
        <span>{stat.change}</span>
        {stat.trend === 'up' ? <ArrowUpRight size={16} /> : stat.trend === 'down' ? <ArrowDownRight size={16} /> : null}
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
      <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Review Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Rejected': 'bg-rose-50 text-rose-700 border-rose-200',
  };
  
  const icons = {
    'Review Pending': Clock,
    'In Progress': Briefcase,
    'Approved': CheckCircle2,
    'Rejected': AlertCircle,
  };

  const Icon = icons[status] || Clock;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      <Icon size={12} className="mr-1.5" />
      {status}
    </span>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default collapsed
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Login Handler
  if (!isLoggedIn) {
    return <LoginView onLogin={() => setIsLoggedIn(true)} />;
  }

  // Dashboard View Component (Extracted for cleaner render)
  const DashboardView = () => (
    <div className="animate-in fade-in zoom-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Good Morning, Admin 👋</h1>
        <p className="text-slate-500 mt-1">Here's what's happening at <b>{selectedBranch}</b> today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {MOCK_STATS.map((stat, idx) => <StatCard key={idx} stat={stat} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Pending Tasks</h2>
                <p className="text-sm text-slate-500">Maker-Checker Workflow</p>
              </div>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">View All Tasks</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Assignee (Maker)</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_TASKS.map((task) => (
                    <tr key={task.id} className="group hover:bg-slate-50/80 transition-colors cursor-pointer">
                      <td className="px-6 py-4 font-medium text-slate-700">{task.client}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{task.service}</td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-600">{task.assignee.split(' ')[0]}</span></td>
                      <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="space-y-8">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setActiveTab('CRM')} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all border border-white/10">
                    <Users size={20} className="mb-2" /><span className="text-xs font-medium">Add Client</span>
                  </button>
                  <button onClick={() => setActiveTab('Invoices')} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all border border-white/10">
                    <FileText size={20} className="mb-2" /><span className="text-xs font-medium">New Invoice</span>
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all border border-white/10">
                    <CheckSquare size={20} className="mb-2" /><span className="text-xs font-medium">Create Task</span>
                  </button>
                  <button onClick={() => setActiveTab('Vault')} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all border border-white/10">
                    <Shield size={20} className="mb-2" /><span className="text-xs font-medium">Vault Entry</span>
                  </button>
                </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* --- SMART SIDEBAR (Auto Expand on Hover) --- */}
      <aside 
        className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white h-full border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-20 shadow-xl`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 shrink-0">
              A
            </div>
            <span className={`font-bold text-xl tracking-tight text-slate-800 transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              AVR <span className="text-indigo-600">Associates</span>
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={CheckSquare} label="Tasks (Maker-Checker)" active={activeTab === 'Tasks'} onClick={() => setActiveTab('Tasks')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={Users} label="Client CRM" active={activeTab === 'CRM'} onClick={() => setActiveTab('CRM')} collapsed={sidebarCollapsed} />
          
          <div className={`mt-8 mb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            Finance & Vault
          </div>
          <SidebarItem icon={FileText} label="Invoices & Billing" active={activeTab === 'Invoices'} onClick={() => setActiveTab('Invoices')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={Shield} label="Credential Vault" active={activeTab === 'Vault'} onClick={() => setActiveTab('Vault')} collapsed={sidebarCollapsed} />
          
          <div className={`mt-8 mb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            System
          </div>
          <SidebarItem icon={FileCheck} label="Reports" active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} collapsed={sidebarCollapsed} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} collapsed={sidebarCollapsed} />
        </div>

        <div className="p-4 border-t border-slate-100">
           <button onClick={() => setIsLoggedIn(false)} className="flex items-center w-full p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors">
              <LogOut size={20} className="shrink-0" />
              <span className={`ml-3 font-medium text-sm transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>Logout</span>
           </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>
          <div className="flex items-center gap-6">
            
            {/* Branch Selector with Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setShowBranchMenu(!showBranchMenu)}
                className="hidden md:flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors"
              >
                <Briefcase size={16} className="text-indigo-600 mr-2" />
                <span className="text-sm font-medium text-indigo-900 mr-2">{selectedBranch}</span>
                <ChevronDown size={14} className="text-indigo-400" />
              </div>
              
              {showBranchMenu && (
                <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                   {BRANCHES.map(branch => (
                     <button 
                        key={branch}
                        onClick={() => { setSelectedBranch(branch); setShowBranchMenu(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${selectedBranch === branch ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'}`}
                     >
                       {branch}
                     </button>
                   ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
              </button>

              {showNotifications && (
                 <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-500 uppercase">Notifications</span>
                       <button onClick={() => setShowNotifications(false)}><X size={14} className="text-slate-400"/></button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                       {MOCK_NOTIFICATIONS.map(notif => (
                          <div key={notif.id} className="p-3 hover:bg-slate-50 border-b border-slate-50 transition-colors flex items-start gap-3">
                             <div className={`p-2 rounded-full shrink-0 ${notif.color}`}>
                                <notif.icon size={16} />
                             </div>
                             <div>
                                <h4 className="text-sm font-semibold text-slate-800">{notif.title}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{notif.desc}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                    <div className="p-2 text-center border-t border-slate-100">
                       <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Mark all read</button>
                    </div>
                 </div>
              )}
            </div>

            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 cursor-pointer">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-indigo-600">AV</div>
            </div>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'Dashboard' && <DashboardView />}
          {activeTab === 'CRM' && <CRMView />}
          {activeTab === 'Vault' && <VaultView />}
          {activeTab === 'Invoices' && <InvoicesView />}
          {activeTab === 'Reports' && <ReportsView />}
          {activeTab === 'Tasks' && <DashboardView />}
          {activeTab === 'Settings' && <div className="text-center mt-20 text-slate-400">Settings Module Placeholder</div>}
        </div>
      </main>
    </div>
  );
}