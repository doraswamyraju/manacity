import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  MoreVertical, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  File as FileIcon,
  Plus,
  Eye,
  Trash2,
  Edit,
  Trophy,
  BookOpen,
  Music,
  Briefcase,
  Award,
  Save,
  CheckCircle,
  XCircle,
  User,
  Settings,
  Lock
} from 'lucide-react';

// --- FORM CONFIGURATIONS ---
const FORM_SCHEMAS = {
  // Cricket
  'cricket-club-member': [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'fatherName', label: 'Father Name', type: 'text' },
    { key: 'address', label: 'Full Address', type: 'textarea' },
    { key: 'phone', label: 'Phone No', type: 'tel' },
    { key: 'email', label: 'Email ID', type: 'email' },
    { key: 'aadhar', label: 'Aadhar Card No', type: 'text' },
    { key: 'role', label: 'Role/Position', type: 'text' }
  ],
  'cricket-player': [
    { key: 'fullName', label: 'Player Full Name', type: 'text' },
    { key: 'fatherName', label: 'Father Name', type: 'text' },
    { key: 'address', label: 'Full Address', type: 'textarea' },
    { key: 'phone', label: 'Phone No', type: 'tel' },
    { key: 'email', label: 'Email ID', type: 'email' },
    { key: 'aadhar', label: 'Aadhar Card No', type: 'text' },
    { key: 'disabilityCert', label: 'Disability Cert No', type: 'text' },
    { key: 'category', label: 'Category', type: 'select', options: ['B1', 'B2', 'B3'] },
    { key: 'experience', label: 'Years Played', type: 'number' }
  ],
  'cricket-umpire': [
    { key: 'fullName', label: 'Empire Full Name', type: 'text' },
    { key: 'fatherName', label: 'Father Name', type: 'text' },
    { key: 'address', label: 'Full Address', type: 'textarea' },
    { key: 'phone', label: 'Phone No', type: 'tel' },
    { key: 'email', label: 'Email ID', type: 'email' },
    { key: 'aadhar', label: 'Aadhar No', type: 'text' },
    { key: 'matchesCount', label: 'Matches Officiated', type: 'number' },
    { key: 'experience', label: 'Years Experience', type: 'text' }
  ],
  
  // Education
  'education-student': [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'fatherName', label: 'Father Name', type: 'text' },
    { key: 'address', label: 'Full Address', type: 'textarea' },
    { key: 'phone', label: 'Mobile No', type: 'tel' },
    { key: 'email', label: 'Email ID', type: 'email' },
    { key: 'aadhar', label: 'Aadhar No', type: 'text' },
    { key: 'age', label: 'Age', type: 'number' },
    { key: 'college', label: 'College Name', type: 'text' },
    { key: 'collegeAddress', label: 'College Address', type: 'text' },
    { key: 'yearStudy', label: 'Year of Study', type: 'text' },
    { key: 'scribeSubject', label: 'Scribe Subject Required', type: 'text' },
    { key: 'examDate', label: 'Date of Exam', type: 'date' }
  ],
  'education-scriber': [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'fatherName', label: 'Father Name', type: 'text' },
    { key: 'address', label: 'Full Address', type: 'textarea' },
    { key: 'phone', label: 'Phone Number', type: 'tel' },
    { key: 'email', label: 'Email ID', type: 'email' },
    { key: 'aadhar', label: 'Aadhar Card No', type: 'text' },
    { key: 'qualification', label: 'Qualification', type: 'text' },
    { key: 'subjects', label: 'Interested Subjects', type: 'text' },
    { key: 'location', label: 'Living Location', type: 'text' }
  ],

  // Common Forms
  'volunteer-form': [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'fatherName', label: 'Father Name', type: 'text' },
    { key: 'address', label: 'Full Address', type: 'textarea' },
    { key: 'phone', label: 'Phone No', type: 'tel' },
    { key: 'email', label: 'Email ID', type: 'email' },
    { key: 'aadhar', label: 'Aadhar Card No', type: 'text' },
    { key: 'qualification', label: 'Qualification', type: 'text' },
    { key: 'occupation', label: 'Occupation', type: 'text' },
    { key: 'interest', label: 'Area of Interest', type: 'select', options: ['Education', 'Sports', 'Music', 'Business', 'Awards'] },
    { key: 'availability', label: 'Available Date/Time', type: 'text' }
  ],
  'supporter-form': [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'fatherName', label: 'Father Name', type: 'text' },
    { key: 'address', label: 'Full Address', type: 'textarea' },
    { key: 'phone', label: 'Phone No', type: 'tel' },
    { key: 'aadhar', label: 'Aadhar No', type: 'text' },
    { key: 'pan', label: 'PAN Card No', type: 'text' },
    { key: 'email', label: 'Mail ID', type: 'email' },
    { key: 'occupation', label: 'Occupation', type: 'text' },
    { key: 'interest', label: 'Areas of Interest', type: 'text' },
    { key: 'supportType', label: 'Support Through', type: 'select', options: ['Physical Participation', 'Donation'] }
  ],

  // Music
  'music-singer': [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'fatherName', label: 'Father Name', type: 'text' },
    { key: 'address', label: 'Full Address', type: 'textarea' },
    { key: 'phone', label: 'Phone No', type: 'tel' },
    { key: 'aadhar', label: 'Aadhar No', type: 'text' },
    { key: 'disabilityCert', label: 'Disability Cert No', type: 'text' },
    { key: 'category', label: 'Music Category', type: 'select', options: ['Singers Choice', 'Classical', 'Folk', 'Light Music', 'Melody'] },
    { key: 'goal', label: 'Goal', type: 'text' }
  ],
  'music-member': [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'phone', label: 'Phone No', type: 'tel' },
    { key: 'role', label: 'Role', type: 'text' }
  ],
  'music-judge': [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'expertise', label: 'Musical Expertise', type: 'text' },
    { key: 'phone', label: 'Phone No', type: 'tel' }
  ],

  // Business
  'business-member': [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'businessName', label: 'Business Name', type: 'text' },
    { key: 'phone', label: 'Phone No', type: 'tel' }
  ],
  'business-entrepreneur': [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'businessIdea', label: 'Business Idea', type: 'textarea' },
    { key: 'phone', label: 'Phone No', type: 'tel' }
  ],

  // Awards
  'awards-nomination': [
    { key: 'nomineeName', label: 'Nominee Name', type: 'text' },
    { key: 'category', label: 'Award Category', type: 'select', options: ['International', 'National', 'State', 'Platinum'] },
    { key: 'achievement', label: 'Brief Achievement', type: 'textarea' },
    { key: 'phone', label: 'Contact No', type: 'tel' }
  ],
  'awards-sponsor': [
    { key: 'sponsorName', label: 'Sponsor/Company Name', type: 'text' },
    { key: 'amount', label: 'Sponsorship Amount', type: 'number' },
    { key: 'phone', label: 'Contact No', type: 'tel' }
  ],
  
  // Generic Donors
  'cricket-donor': [{ key: 'name', label: 'Donor Name', type: 'text' }, { key: 'amount', label: 'Amount', type: 'number' }, { key: 'phone', label: 'Phone', type: 'tel' }],
  'education-donor': [{ key: 'name', label: 'Donor Name', type: 'text' }, { key: 'amount', label: 'Amount', type: 'number' }, { key: 'phone', label: 'Phone', type: 'tel' }],
  'music-donor': [{ key: 'name', label: 'Donor Name', type: 'text' }, { key: 'amount', label: 'Amount', type: 'number' }, { key: 'phone', label: 'Phone', type: 'tel' }],
  'business-donor': [{ key: 'name', label: 'Donor Name', type: 'text' }, { key: 'amount', label: 'Amount', type: 'number' }, { key: 'phone', label: 'Phone', type: 'tel' }],
};

// --- MOCK DATA ---
const generateMockData = () => {
  return {
    'cricket-player': [
      { id: 1, fullName: "S. Mani", fatherName: "S. Rao", category: "B1", experience: 5, phone: "9000011111", address: "Tirupati", status: "Active" },
      { id: 2, fullName: "P. Kumar", fatherName: "P. Murthy", category: "B2", experience: 12, phone: "9000022222", address: "Nellore", status: "Pending" },
    ],
    'cricket-umpire': [
      { id: 1, fullName: "K. Venkat", matchesCount: 15, experience: "3 Years", phone: "8888899999", status: "Approved" }
    ],
    'education-student': [
      { id: 1, fullName: "Ravi Kumar", fatherName: "Suresh", college: "S.V. Arts", yearStudy: "2nd Year", scribeReq: "English", status: "Pending" },
      { id: 2, fullName: "Latha M", fatherName: "Mohan", college: "SPW College", yearStudy: "Final Year", scribeReq: "History", status: "Approved" }
    ],
    'education-scriber': [
      { id: 1, fullName: "Anjali S", qualification: "B.Tech", subjects: "Maths, Science", location: "Tirupati", status: "Available" }
    ],
    'music-singer': [
      { id: 1, fullName: "David Raj", category: "Classical", phone: "9988776655", goal: "Playback Singer", status: "Active" }
    ],
    'volunteer-form': [
      { id: 1, fullName: "Somanth", interest: "Sports", availability: "Weekends", phone: "9876543210", status: "New" }
    ],
    'supporter-form': [
      { id: 1, fullName: "Green Corp", supportType: "Donation", email: "csr@green.com", status: "Verified" }
    ],
    'cricket-club-member': [
        { id: 1, fullName: "Rajesh K", role: "Treasurer", phone: "9876512345", status: "Active" }
    ],
    'cricket-donor': [
        { id: 1, name: "Local Sports Shop", amount: 5000, phone: "9988776655", status: "Received" }
    ],
    'education-donor': [
        { id: 1, name: "Book House", amount: 2000, phone: "8899776655", status: "Pledged" }
    ],
    'music-member': [
        { id: 1, fullName: "Sangeetha", role: "Member", phone: "9123456780", status: "Active" }
    ],
    'music-judge': [
        { id: 1, fullName: "Pt. Rao", expertise: "Classical Vocal", phone: "9000090000", status: "Confirmed" }
    ],
    'business-member': [
        { id: 1, fullName: "Venkatesh", businessName: "Venky Stores", phone: "9988001122", status: "Active" }
    ],
    'business-entrepreneur': [
        { id: 1, fullName: "Lakshmi", businessIdea: "Handmade Candles", phone: "7788990011", status: "Reviewing" }
    ],
    'awards-nomination': [
        { id: 1, nomineeName: "Siva Kumar", category: "State", achievement: "Social Service", phone: "9900112233", status: "Nominated" }
    ],
    'awards-sponsor': [
        { id: 1, sponsorName: "Big Brand Co", amount: 100000, phone: "040123456", status: "Confirmed" }
    ]
  };
};

// --- COMPONENTS ---

// 1. Sidebar Group Component
const SidebarGroup = ({ title, icon, id, forms, activeTab, setActiveTab, isOpen, toggleOpen }) => {
  return (
    <div className="mb-2">
      <button 
        onClick={() => toggleOpen(id)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:text-white hover:bg-slate-800 ${isOpen ? 'text-white' : 'text-slate-400'}`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isOpen && (
        <div className="bg-slate-900/50 py-1">
          {forms.map(form => (
            <button
              key={form.id}
              onClick={() => setActiveTab(form.id)}
              className={`w-full text-left pl-12 pr-4 py-2 text-xs transition-colors ${
                activeTab === form.id 
                  ? 'text-amber-500 font-bold border-r-2 border-amber-500 bg-slate-800' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {form.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Main Sidebar
const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen, onLogout }) => {
  const [openGroups, setOpenGroups] = useState({
    cricket: true,
    education: false,
    music: false,
    business: false,
    awards: false
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const navStructure = [
    {
      id: 'cricket',
      title: 'Cricket Club',
      icon: <Trophy className="w-5 h-5 text-blue-400" />,
      forms: [
        { id: 'cricket-club-member', label: 'Club Member Form' },
        { id: 'cricket-player', label: 'Player Form' },
        { id: 'cricket-umpire', label: 'Umpire (Empire) Form' },
        { id: 'volunteer-form', label: 'Volunteer Form' },
        { id: 'supporter-form', label: 'Supporter Form' },
        { id: 'cricket-donor', label: 'Donor Form' },
      ]
    },
    {
      id: 'education',
      title: 'Education Club',
      icon: <BookOpen className="w-5 h-5 text-green-400" />,
      forms: [
        { id: 'education-student', label: 'Student Form' },
        { id: 'education-scriber', label: 'Scriber Form' },
        { id: 'volunteer-form', label: 'Volunteer Form' },
        { id: 'education-donor', label: 'Donor Form' },
      ]
    },
    {
      id: 'music',
      title: 'Music Club',
      icon: <Music className="w-5 h-5 text-purple-400" />,
      forms: [
        { id: 'music-member', label: 'Member Form' },
        { id: 'music-singer', label: 'Singer Form' },
        { id: 'music-judge', label: 'Judge Form' },
        { id: 'supporter-form', label: 'Supporter Form' },
        { id: 'music-donor', label: 'Donor Form' },
      ]
    },
    {
      id: 'business',
      title: 'Business Club',
      icon: <Briefcase className="w-5 h-5 text-red-400" />,
      forms: [
        { id: 'business-member', label: 'Club Member Form' },
        { id: 'business-entrepreneur', label: 'Entrepreneur Form' },
        { id: 'business-donor', label: 'Donor Form' },
      ]
    },
    {
      id: 'awards',
      title: 'Awards',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      forms: [
        { id: 'awards-nomination', label: 'Nomination Form' },
        { id: 'awards-sponsor', label: 'Sponsor Form' },
      ]
    }
  ];

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      <aside className={`fixed top-0 left-0 z-30 h-screen w-64 bg-[#0B1120] border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} overflow-hidden flex flex-col shadow-2xl`}>
        <div className="flex items-center gap-3 p-6 border-b border-slate-800 shrink-0">
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-[#0B1120] text-xl">GF</div>
          <div>
            <h1 className="text-white font-bold font-serif leading-none">GATLA</h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-4 text-sm font-medium transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-amber-500 text-[#0B1120]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard Overview
          </button>

          <div className="px-4 mb-2 text-[10px] font-bold uppercase text-slate-600 tracking-wider">Forms Management</div>

          {navStructure.map(group => (
            <SidebarGroup
              key={group.id}
              {...group}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isOpen={openGroups[group.id]}
              toggleOpen={toggleGroup}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

// 3. Dynamic Form Modal
const FormModal = ({ isOpen, onClose, categoryId, initialData, onSave }) => {
  if (!isOpen) return null;

  const schema = FORM_SCHEMAS[categoryId] || FORM_SCHEMAS['volunteer-form']; 
  const title = categoryId.replace(/-/g, ' ').toUpperCase();

  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: initialData?.id || Date.now() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
          <h3 className="font-bold flex items-center gap-2">
            {initialData ? <Edit className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} 
            {initialData ? 'Edit' : 'Add New'} {title}
          </h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="dynamic-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schema.map((field) => (
              <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{field.label}</label>
                {field.type === 'select' ? (
                  <select 
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  >
                    <option value="">Select...</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea 
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    rows="3"
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                ) : (
                  <input 
                    type={field.type} 
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
            <div className="md:col-span-2 mt-4 pt-4 border-t border-dashed border-slate-200">
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Documents (Aadhar, Photo, Certificates)</label>
               <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 cursor-pointer">
                  <span className="text-sm text-slate-400">Click to upload files</span>
               </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">Cancel</button>
          <button type="submit" form="dynamic-form" className="px-6 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-md flex items-center gap-2">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Data Table
const DataTable = ({ type, data, onAdd, onEdit, onDelete }) => {
  const schema = FORM_SCHEMAS[type] || FORM_SCHEMAS['volunteer-form'];
  const displayHeaders = schema.slice(0, 5).map(f => ({ key: f.key, label: f.label }));
  
  const handleExport = (format) => {
    if (format === 'csv') {
      const headers = displayHeaders.map(h => h.label).join(',');
      const rows = data.map(row => displayHeaders.map(h => row[h.key] || '').join(',')).join('\n');
      const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${type}_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 capitalize">{type.replace(/-/g, ' ')}</h2>
          <p className="text-sm text-slate-500">{data.length} records found</p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={onAdd} className="flex items-center px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Add New
          </button>
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          <button onClick={() => handleExport('csv')} className="flex items-center px-3 py-2 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 rounded border border-green-200" title="Export Excel/CSV">
            <FileSpreadsheet className="w-4 h-4 mr-1" /> Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="flex items-center px-3 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200" title="Export PDF">
            <FileIcon className="w-4 h-4 mr-1" /> PDF
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
            <tr>
              {displayHeaders.map((header) => (
                <th key={header.key} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  {header.label}
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-amber-50/50 transition-colors group">
                  {displayHeaders.map((header) => (
                    <td key={header.key} className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                      {row[header.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        row.status === 'Approved' || row.status === 'Active' ? 'bg-green-100 text-green-700' :
                        row.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {row.status || 'Pending'}
                      </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(row)} className="p-1 text-slate-400 hover:text-amber-500" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(row.id)} className="p-1 text-slate-400 hover:text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={displayHeaders.length + 2} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-slate-200 mb-2" />
                    <p>No records found.</p>
                    <button onClick={onAdd} className="text-amber-600 text-sm font-bold hover:underline mt-1">Add your first entry</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 6. Login Component
const LoginPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-900 p-8 text-center border-b border-slate-800">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center font-bold text-[#0B1120] text-3xl mx-auto mb-4">GF</div>
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <p className="text-slate-400 text-sm">Gatla Foundation Management System</p>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition" placeholder="admin" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="password" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition" placeholder="••••••••" />
            </div>
          </div>
          <button 
            onClick={onLogin}
            className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-amber-400 transition shadow-lg transform hover:scale-[1.02]"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// 7. Profile Dropdown
const ProfileDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 focus:outline-none"
      >
        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-300">A</div>
        <span className="hidden md:inline">Admin</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-amber-600 flex items-center gap-2">
            <User className="w-4 h-4" /> My Profile
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-amber-600 flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <div className="border-t border-slate-100 my-1"></div>
          <button 
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
};

// 8. Main App Component
const DashboardApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [appData, setAppData] = useState(generateMockData());

  const currentData = appData[activeTab] || [];

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const handleSave = (newData) => {
    setAppData(prev => {
      const list = prev[activeTab] || [];
      const updatedList = currentEditItem 
        ? list.map(item => item.id === newData.id ? newData : item)
        : [...list, { ...newData, status: 'Active' }];
      return { ...prev, [activeTab]: updatedList };
    });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this record?")) {
      setAppData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== id)
      }));
    }
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        onLogout={handleLogout}
      />

      <div className="flex-1 lg:ml-64 flex flex-col h-screen transition-all duration-300">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden sm:block capitalize">
              {activeTab === 'dashboard' ? 'Overview' : activeTab.replace(/-/g, ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <ProfileDropdown onLogout={handleLogout} />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-hidden flex flex-col">
          {activeTab === 'dashboard' ? (
            <div className="overflow-y-auto h-full">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Welcome, Admin</h1>
                <p className="text-slate-500">Overview of all Gatla Foundation activities.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Records', value: Object.values(appData).flat().length, color: 'bg-blue-500' },
                  { label: 'Cricket Players', value: appData['cricket-player']?.length || 0, color: 'bg-amber-500' },
                  { label: 'Students', value: appData['education-student']?.length || 0, color: 'bg-green-500' },
                  { label: 'Donors', value: (appData['cricket-donor']?.length || 0) + (appData['business-donor']?.length || 0), color: 'bg-red-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold uppercase text-slate-400">{stat.label}</span>
                      <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <DataTable 
              type={activeTab} 
              data={currentData} 
              onAdd={() => { setCurrentEditItem(null); setModalOpen(true); }}
              onEdit={(item) => { setCurrentEditItem(item); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>

      <FormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        categoryId={activeTab} 
        initialData={currentEditItem}
        onSave={handleSave}
      />
    </div>
  );
};

export default DashboardApp;
