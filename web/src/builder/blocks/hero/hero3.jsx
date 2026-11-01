import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, FileText, CheckSquare, Shield, Settings, Bell, Search, 
  Menu, ChevronDown, MoreVertical, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, 
  AlertCircle, Briefcase, LogOut, Plus, Eye, EyeOff, Download, Trash2, Building2, 
  User, CreditCard, MapPin, Phone, Mail, Calendar, ChevronRight, X, Kanban, List, 
  ArrowRight, PieChart, ChevronLeft, Layers, FileInput, MessageSquare, Anchor, 
  Globe, Factory, Stamp, HardHat, DollarSign, FolderOpen, BookOpen, Truck, BarChart
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// --- SERVICE CATALOG (From your Doc) ---
const SERVICE_CATALOG = {
  'Industrial Support': [
    'Machinery Sourcing (Import)', 'Vendor Verification', 'Turnkey Setup', 'Feasibility Analysis'
  ],
  'Certification (ISO)': [
    'ISO 9001 (Quality)', 'ISO 14001 (Env)', 'ISO 45001 (Safety)', 'ISO 27001 (InfoSec)', 'HACCP/GMP', 'CE Marking'
  ],
  'Taxation & Audit': [
    'GST Registration', 'GST Monthly Returns', 'Income Tax Filing', 'Statutory Audit', 'Tax Audit (3CD)', 'Internal Audit'
  ],
  'Business Registration': [
    'Pvt Ltd Company', 'LLP Registration', 'MSME (Udyam)', 'Import Export Code (IEC)', 'Startup India'
  ],
  'Licensing': [
    'FSSAI License', 'Trade License', 'Labour License', 'Pollution Control (PCB)', 'Factory License'
  ],
  'Govt Portals': [
    'GeM Seller Reg', 'TReDS Reg', 'RERA Reg', 'AP/TS Single Window'
  ],
  'Consultancy & Loans': [
    'DPR Preparation', 'CMA Data', 'Term Loan / Working Capital', 'Mudra Loan', 'Subsidy Guidance'
  ]
};

const BRANCHES = ['Ravulapalem (Head Office)', 'Atreyapuram', 'Amalapuram', 'Versatile'];

// --- INITIAL MOCK DATA ---

const INITIAL_PROJECTS = [
  { id: 1, title: 'ISO 9001 Implementation', client: 'TechFlow Solutions', progress: 45, budget: 80000, billed: 40000, received: 20000, status: 'In Progress', type: 'Certification' },
  { id: 2, title: 'Pvt Ltd Incorporation', client: 'Green Earth NGO', progress: 80, budget: 25000, billed: 15000, received: 15000, status: 'Review', type: 'Registration' },
  { id: 3, title: 'DPR for Food Processing', client: 'Apex Foods', progress: 10, budget: 150000, billed: 0, received: 0, status: 'In Progress', type: 'Consultancy' },
];

const INITIAL_TASKS = [
  { id: 101, name: 'Documentation Phase', assignee: 'Rahul (Maker)', status: 'Completed', start: '2024-10-01', end: '2024-10-05', duration: '5 days', dependency: '-' },
  { id: 102, name: 'Gap Analysis', assignee: 'Rahul (Maker)', status: 'Completed', start: '2024-10-02', end: '2024-10-03', duration: '2 days', dependency: '101' },
  { id: 103, name: 'System Implementation', assignee: 'Arjun (Maker)', status: 'In Progress', start: '2024-10-06', end: '2024-10-20', duration: '14 days', dependency: '102' },
  { id: 104, name: 'Internal Audit', assignee: 'Sneha (Checker)', status: 'Pending', start: '2024-10-21', end: '2024-10-25', duration: '5 days', dependency: '103' },
];

const INITIAL_SCOPE = [
  { id: 1, item: 'Consultancy Charges', qty: 1, rate: 50000, amount: 50000 },
  { id: 2, item: 'Documentation Kit', qty: 1, rate: 15000, amount: 15000 },
  { id: 3, item: 'Certification Body Fee', qty: 1, rate: 15000, amount: 15000 },
];

const INITIAL_PAYMENTS = [
  { id: 1, date: '2024-10-01', type: 'Advance', mode: 'Bank Transfer', amount: 20000, status: 'Received' },
  { id: 2, date: '2024-10-15', type: 'Milestone 1', mode: 'Cheque', amount: 20000, status: 'Pending' },
];

// --- COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-slate-100 text-slate-600',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Review': 'bg-amber-100 text-amber-700 border-amber-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Received': 'bg-emerald-100 text-emerald-800',
  };
  return <span className={`px-2 py-1 rounded-md text-xs font-bold border ${styles[status] || 'bg-slate-100'}`}>{status}</span>;
};

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button 
    onClick={onClick}
    className={`flex items-center w-full p-3 mb-1 rounded-xl transition-all duration-200 group relative
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

// 1. PROJECT WIZARD
const ProjectWizard = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-[900px] h-[650px] rounded-3xl shadow-2xl flex overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Sidebar */}
        <div className="w-1/3 bg-slate-900 p-8 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
          <div><h2 className="text-3xl font-bold mb-2">Create Project</h2><p className="text-slate-400">Select services from your extensive catalog.</p></div>
          <div className="space-y-6 relative z-10">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex items-center gap-4 ${step === i ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step === i ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-600 text-slate-400'}`}>{i}</div>
                <div><p className="font-bold text-sm">{i === 1 ? 'Client & Type' : i === 2 ? 'Select Services' : ' commercials'}</p><p className="text-xs text-slate-400">{i === 1 ? 'Basic Details' : i === 2 ? 'Scope Definition' : 'Budgeting'}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 p-10 flex flex-col bg-slate-50">
          <div className="flex-1 overflow-y-auto pr-2">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-slate-800">Project Basics</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2"><label className="text-xs font-bold text-slate-500 uppercase">Project Title</label><input className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. ISO 9001 Certification" /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Client</label><input className="w-full p-3 border border-slate-200 rounded-xl bg-white" placeholder="Search Client..." /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Branch</label><select className="w-full p-3 border border-slate-200 rounded-xl bg-white"><option>Ravulapalem</option><option>Versatile</option></select></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Start Date</label><input type="date" className="w-full p-3 border border-slate-200 rounded-xl bg-white" /></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase">Deadline</label><input type="date" className="w-full p-3 border border-slate-200 rounded-xl bg-white" /></div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-slate-800">Select Scope of Work</h3>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {Object.keys(SERVICE_CATALOG).map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300'}`}>{cat}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(SERVICE_CATALOG[selectedCategory] || SERVICE_CATALOG['Industrial Support']).map(service => (
                    <label key={service} className="flex items-center p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 transition-all">
                      <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" /><span className="ml-3 text-sm font-medium text-slate-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-slate-800">Fees Structure</h3>
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-sm text-indigo-800 mb-4 flex items-start"><AlertCircle size={16} className="mr-2 mt-0.5 shrink-0"/><span>Standard rates applied. Adjust as needed.</span></div>
                <div className="space-y-3">
                   <div className="flex gap-2"><input className="flex-1 p-2 border rounded-lg bg-white" placeholder="Fee Description" /><input className="w-24 p-2 border rounded-lg bg-white" placeholder="Qty" /><input className="w-32 p-2 border rounded-lg bg-white" placeholder="Rate" /><button className="p-2 bg-indigo-600 text-white rounded-lg"><Plus size={18}/></button></div>
                   <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg"><span className="text-sm font-medium">Consultancy Charges</span><span className="font-bold">₹ 50,000</span></div>
                   <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg"><span className="text-sm font-medium">Govt Fee (Actuals)</span><span className="font-bold">₹ 15,000</span></div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200"><span className="text-lg font-bold text-slate-600">Total Project Value</span><span className="text-2xl font-bold text-indigo-600">₹ 65,000</span></div>
              </div>
            )}
          </div>
          <div className="flex justify-between pt-6 mt-4 border-t border-slate-200">
            {step > 1 ? <button onClick={() => setStep(s => s - 1)} className="px-6 py-2 text-slate-500 font-medium hover:bg-slate-200 rounded-xl">Back</button> : <button onClick={onClose} className="px-6 py-2 text-slate-500 font-medium hover:bg-slate-200 rounded-xl">Cancel</button>}
            {step < 3 ? <button onClick={() => setStep(s => s + 1)} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">Continue</button> : <button onClick={() => {onSave(); onClose();}} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-colors">Create Project</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. PROJECT DEEP DIVE
const ProjectDetailView = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ChevronLeft size={24}/></button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{project.title}</h1>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600 border border-slate-200 font-bold uppercase tracking-wide">{project.type}</span>
            </div>
            <p className="text-slate-500 text-sm flex items-center mt-1">
              <Building2 size={14} className="mr-1"/> {project.client} 
              <span className="mx-2 text-slate-300">|</span>
              <span className="text-indigo-600 font-medium">Budget: ₹ {project.budget.toLocaleString()}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all text-sm flex items-center"><FileText size={16} className="mr-2"/> Report</button>
           <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all text-sm shadow-md flex items-center"><Plus size={16} className="mr-2"/> Transaction</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 bg-white border-b border-slate-200">
        <div className="flex gap-6">
          {['Overview', 'Task Management', 'Fees & Commercials', 'Payment Status', 'Documents'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="font-bold text-slate-800 mb-6">Financial Health</h3>
              <div className="flex items-center justify-around">
                 <div className="text-center"><p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Budget</p><p className="text-2xl font-bold text-slate-800">₹ {project.budget.toLocaleString()}</p></div>
                 <div className="h-10 w-px bg-slate-200"></div>
                 <div className="text-center"><p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Billed</p><p className="text-2xl font-bold text-emerald-600">₹ {project.billed.toLocaleString()}</p></div>
                 <div className="h-10 w-px bg-slate-200"></div>
                 <div className="text-center"><p className="text-xs text-slate-400 font-bold uppercase mb-1">Received</p><p className="text-2xl font-bold text-indigo-600">₹ {project.received.toLocaleString()}</p></div>
              </div>
              <div className="mt-8">
                 <div className="flex justify-between text-xs font-bold text-slate-500 mb-2"><span>Completion</span><span>{project.progress}%</span></div>
                 <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{width: `${project.progress}%`}}></div></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4">Staff Utilization</h3>
               <div className="space-y-4">
                  {['Rahul (Maker)', 'Sneha (Checker)'].map((staff, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">{staff.charAt(0)}</div><div><p className="text-sm font-semibold">{staff.split(' ')[0]}</p><p className="text-[10px] text-slate-400">{staff.split(' ')[1]}</p></div></div><span className="text-sm font-bold text-slate-700">12 hrs</span>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* TASK MANAGEMENT */}
        {activeTab === 'Task Management' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex gap-3">
                   <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">List View</button>
                   <div className="h-6 w-px bg-slate-200 mx-2"></div>
                   <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 flex items-center"><ArrowRight size={12} className="mr-1"/> Create Baseline</button>
                </div>
                <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow-md"><Plus size={14} className="mr-1"/> Add Task</button>
             </div>
             
             <div className="flex-1 overflow-auto">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase sticky top-0">
                     <tr><th className="px-6 py-3 border-b">Task Name</th><th className="px-6 py-3 border-b">Duration</th><th className="px-6 py-3 border-b">Start Date</th><th className="px-6 py-3 border-b">End Date</th><th className="px-6 py-3 border-b">Predecessor</th><th className="px-6 py-3 border-b">Assignee</th><th className="px-6 py-3 border-b">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                     {INITIAL_TASKS.map(task => (
                        <tr key={task.id} className="hover:bg-indigo-50/30 transition-colors group">
                           <td className="px-6 py-3 font-medium text-slate-700 border-r border-slate-100 w-1/3">{task.dependency !== '-' && <span className="text-slate-300 mr-2">↳</span>}{task.name}</td>
                           <td className="px-6 py-3 text-slate-500">{task.duration}</td><td className="px-6 py-3 text-slate-500">{task.start}</td><td className="px-6 py-3 text-slate-500">{task.end}</td><td className="px-6 py-3 text-slate-400 font-mono text-xs">{task.dependency}</td><td className="px-6 py-3 text-slate-600">{task.assignee.split(' ')[0]}</td><td className="px-6 py-3"><StatusBadge status={task.status}/></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
          </div>
        )}

        {/* FEES & COMMERCIALS (BoQ) */}
        {activeTab === 'Fees & Commercials' && (
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-slate-700">Project Fees</h3><span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-sm font-bold">Total: ₹ 80,000</span></div>
              <table className="w-full text-left">
                 <thead className="text-xs uppercase text-slate-400 font-bold border-b border-slate-100"><tr><th className="px-6 py-4">Fee Description</th><th className="px-6 py-4">Qty</th><th className="px-6 py-4">Rate</th><th className="px-6 py-4 text-right">Amount</th></tr></thead>
                 <tbody className="divide-y divide-slate-50">
                    {INITIAL_SCOPE.map(item => (
                       <tr key={item.id}><td className="px-6 py-4 font-medium text-slate-700">{item.item}</td><td className="px-6 py-4 text-slate-500">{item.qty}</td><td className="px-6 py-4 text-slate-500">₹ {item.rate.toLocaleString()}</td><td className="px-6 py-4 text-right font-bold text-slate-800">₹ {item.amount.toLocaleString()}</td></tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}

        {/* PAYMENT STATUS */}
        {activeTab === 'Payment Status' && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-2">Total Billed</p>
                    <p className="text-3xl font-bold text-indigo-900">₹ {project.billed.toLocaleString()}</p>
                 </div>
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-2">Total Received</p>
                    <p className="text-3xl font-bold text-emerald-600">₹ {project.received.toLocaleString()}</p>
                 </div>
                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-2">Balance Due</p>
                    <p className="text-3xl font-bold text-rose-600">₹ {(project.billed - project.received).toLocaleString()}</p>
                 </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-4 bg-slate-50 border-b border-slate-100"><h3 className="font-bold text-slate-700">Transaction History</h3></div>
                 <table className="w-full text-left">
                    <thead className="text-xs uppercase text-slate-400 font-bold border-b border-slate-100"><tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Description</th><th className="px-6 py-4">Mode</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-50">
                       {INITIAL_PAYMENTS.map(pay => (
                          <tr key={pay.id}>
                             <td className="px-6 py-4 text-slate-500">{pay.date}</td>
                             <td className="px-6 py-4 font-medium text-slate-700">{pay.type}</td>
                             <td className="px-6 py-4 text-slate-500">{pay.mode}</td>
                             <td className="px-6 py-4 font-bold text-slate-800">₹ {pay.amount.toLocaleString()}</td>
                             <td className="px-6 py-4"><StatusBadge status={pay.status}/></td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
        
        {/* DOCUMENTS */}
        {activeTab === 'Documents' && (
           <div className="grid grid-cols-4 gap-4">
              {[1,2,3].map(i => (
                 <div key={i} className="aspect-square bg-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer border border-slate-200 hover:border-indigo-200 transition-all p-4 text-center">
                    <FileText size={32} className="mb-3"/>
                    <span className="text-sm font-medium">Document {i}.pdf</span>
                    <span className="text-xs text-slate-400 mt-1">Uploaded 2 days ago</span>
                 </div>
              ))}
              <div className="aspect-square border-2 border-dashed border-indigo-300 bg-indigo-50/50 rounded-xl flex flex-col items-center justify-center text-indigo-600 cursor-pointer hover:bg-indigo-100 transition-all">
                 <Plus size={32} className="mb-2"/>
                 <span className="text-sm font-bold">Upload Doc</span>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

// 3. MAIN APP STRUCTURE
export default function App() {
  const [activeTab, setActiveTab] = useState('Projects');
  const [currentView, setCurrentView] = useState('list'); 
  const [selectedProject, setSelectedProject] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // --- ANALYTICS VIEW ---
  const AnalyticsView = () => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
      <h3 className="font-bold text-slate-700 mb-6 flex items-center"><PieChart size={18} className="mr-2 text-indigo-500"/> Service Portfolio Distribution</h3>
      <div className="flex gap-8">
         <div className="flex-1 space-y-4">
            {Object.keys(SERVICE_CATALOG).slice(0, 4).map((cat, i) => (
               <div key={cat}>
                  <div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-600">{cat}</span><span className="font-bold text-slate-800">{35 - (i*5)}%</span></div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${['bg-indigo-500','bg-purple-500','bg-emerald-500','bg-amber-500'][i]} rounded-full`} style={{width: `${35 - (i*5)}%`}}></div></div>
               </div>
            ))}
         </div>
         {/* Simplified Pie Representation */}
         <div className="w-48 h-48 rounded-full border-[16px] border-slate-100 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[16px] border-indigo-500 border-t-transparent border-l-transparent rotate-45"></div>
            <div className="text-center"><span className="text-2xl font-bold text-slate-800">124</span><p className="text-xs text-slate-400">Total Projects</p></div>
         </div>
      </div>
    </div>
  );

  // --- PROJECT LIST VIEW ---
  const ProjectListView = () => (
    <div className="animate-in fade-in zoom-in duration-300 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Projects</h2><p className="text-slate-500">Manage Audits, Registrations & Consulting</p></div>
        <button onClick={() => setCurrentView('wizard')} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center shadow-lg hover:bg-indigo-700 transition-all"><Plus size={18} className="mr-2" /> Create Project</button>
      </div>
      
      <AnalyticsView />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {INITIAL_PROJECTS.map(proj => (
            <div 
              key={proj.id} 
              onClick={() => { setSelectedProject(proj); setCurrentView('detail'); }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
               <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                     {proj.type === 'Certification' ? <Stamp size={20}/> : proj.type === 'Registration' ? <Globe size={20}/> : <Briefcase size={20}/>}
                  </div>
                  <StatusBadge status={proj.status}/>
               </div>
               <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{proj.title}</h3>
               <p className="text-sm text-slate-500 mb-4">{proj.client}</p>
               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{width: `${proj.progress}%`}}></div></div>
            </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar - Auto Collapsible */}
      <aside 
        className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white h-full border-r border-slate-200 flex flex-col py-6 z-20 shadow-xl transition-all duration-300 ease-in-out`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        <div className="flex items-center justify-center mb-8 px-4 h-12 overflow-hidden whitespace-nowrap">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">MC</div>
           <span className={`ml-3 font-bold text-xl tracking-tight text-slate-800 transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>VR <span className="text-indigo-600">Here</span></span>
        </div>
        
        <div className="space-y-1 flex-1 w-full px-3 overflow-y-auto overflow-x-hidden">
           {/* Sidebar Options mirroring "Onsite" */}
           <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => { setActiveTab('Dashboard'); setCurrentView('list'); }} collapsed={sidebarCollapsed} />
           <SidebarItem icon={Layers} label="Projects" active={activeTab === 'Projects'} onClick={() => { setActiveTab('Projects'); setCurrentView('list'); }} collapsed={sidebarCollapsed} />
           <SidebarItem icon={CheckSquare} label="To Do" active={activeTab === 'ToDo'} onClick={() => setActiveTab('ToDo')} collapsed={sidebarCollapsed} />
           <SidebarItem icon={FileText} label="Quotation" active={activeTab === 'Quotation'} onClick={() => setActiveTab('Quotation')} collapsed={sidebarCollapsed} />
           <SidebarItem icon={DollarSign} label="Finance" active={activeTab === 'Finance'} onClick={() => setActiveTab('Finance')} collapsed={sidebarCollapsed} />
           <SidebarItem icon={BarChart} label="Reports" active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} collapsed={sidebarCollapsed} />
           <SidebarItem icon={Users} label="Payroll" active={activeTab === 'Payroll'} onClick={() => setActiveTab('Payroll')} collapsed={sidebarCollapsed} />
           <SidebarItem icon={Briefcase} label="Services" active={activeTab === 'Services'} onClick={() => setActiveTab('Services')} collapsed={sidebarCollapsed} />
           <SidebarItem icon={BookOpen} label="Library" active={activeTab === 'Library'} onClick={() => setActiveTab('Library')} collapsed={sidebarCollapsed} />
           <SidebarItem icon={Settings} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} collapsed={sidebarCollapsed} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-8">
           {activeTab === 'Projects' && currentView === 'list' && <ProjectListView />}
           {activeTab === 'Projects' && currentView === 'detail' && <ProjectDetailView project={selectedProject} onBack={() => setCurrentView('list')} />}
           {currentView === 'wizard' && <ProjectWizard onClose={() => setCurrentView('list')} onSave={() => { /* Save Logic */ }} />}
           {activeTab !== 'Projects' && <div className="flex h-full items-center justify-center text-slate-400">Module Placeholder: {activeTab}</div>}
        </div>
      </main>
    </div>
  );
}
