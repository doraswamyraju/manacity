import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CheckSquare, Clock, Calendar, Settings, Bell, Search, 
  Menu, LogOut, Play, Square, Pause, ChevronRight, AlertCircle, 
  Coffee, Briefcase, FileText, User
} from 'lucide-react';

// --- MOCK DATA ---

const EMPLOYEE_PROFILE = {
  name: 'Rahul Sharma',
  role: 'Audit Assistant (Maker)',
  id: 'VR-EMP-042',
  hourlyRate: 500 // Invisible to employee, but used for backend calc
};

const INITIAL_TASKS = [
  { id: 101, project: 'TechFlow Solutions', title: 'Vouching - Sales Invoices', status: 'Pending', priority: 'High', due: 'Today', estimated: '4h' },
  { id: 102, project: 'TechFlow Solutions', title: 'GST Reconciliation', status: 'Pending', priority: 'Medium', due: 'Tomorrow', estimated: '6h' },
  { id: 103, project: 'Green Earth NGO', title: 'Expense Verification', status: 'In Progress', priority: 'High', due: 'Today', estimated: '3h' },
  { id: 104, project: 'Internal Task', title: 'Team Meeting', status: 'Pending', priority: 'Low', due: 'Today', estimated: '1h' },
  // Added Dummy Data
  { id: 105, project: 'Apex Builders', title: 'TDS Return Filing Q2', status: 'Pending', priority: 'High', due: 'Today', estimated: '2h' },
  { id: 106, project: 'Orion Logistics', title: 'Stock Audit - Warehouse A', status: 'Pending', priority: 'Medium', due: 'Next Week', estimated: '8h' },
  { id: 107, project: 'Zenith Healthcare', title: 'Bank Reconciliation', status: 'Pending', priority: 'Low', due: 'Tomorrow', estimated: '3h' },
  { id: 108, project: 'TechFlow Solutions', title: 'Fixed Asset Register Review', status: 'Pending', priority: 'Medium', due: 'Next Week', estimated: '5h' },
];

const RECENT_LOGS = [
  { id: 1, project: 'TechFlow Solutions', task: 'Vouching', start: '09:30 AM', end: '11:30 AM', duration: '2h 00m' },
  { id: 2, project: 'Internal', task: 'Morning Standup', start: '09:00 AM', end: '09:30 AM', duration: '30m' },
];

// --- COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-slate-100 text-slate-600',
    'In Progress': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return <span className={`px-2 py-1 rounded text-xs font-bold ${styles[status]}`}>{status}</span>;
};

// --- MAIN EMPLOYEE APP ---

export default function EmployeeApp() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  // -- TIME TRACKING STATE --
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [attendanceStart, setAttendanceStart] = useState(null);
  const [activeTask, setActiveTask] = useState(null); // The task currently running
  const [elapsedTime, setElapsedTime] = useState(0); // For the task timer in seconds (Hidden from View)

  // Timer Logic (Runs in background for backend calculation)
  useEffect(() => {
    let interval;
    if (activeTask) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeTask]);

  // Format seconds to HH:MM:SS (Helper kept for backend logs, but not displayed)
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // HANDLERS
  const handleDayClockIn = () => {
    setIsClockedIn(true);
    setAttendanceStart(new Date());
  };

  const handleDayClockOut = () => {
    if (activeTask) {
      alert("Please stop your active task before clocking out for the day.");
      return;
    }
    if (window.confirm("Are you sure you want to end your work day?")) {
      setIsClockedIn(false);
      setAttendanceStart(null);
    }
  };

  const handleTaskStart = (task) => {
    if (!isClockedIn) {
      alert("You must Clock In for the day first!");
      return;
    }
    if (activeTask && activeTask.id !== task.id) {
      if(!window.confirm(`Switching tasks will stop "${activeTask.title}". Continue?`)) return;
      // In a real app, this would save the log of the previous task
    }
    setActiveTask(task);
    setElapsedTime(0); // Reset timer for new task
  };

  const handleTaskStop = () => {
    if(window.confirm("Stop working on this task?")) {
      // In real app: Save {taskId, duration, timestamp} to backend for cost calculation
      console.log(`Task Stopped. Duration: ${elapsedTime}s. Cost to Project: ₹${(elapsedTime/3600 * EMPLOYEE_PROFILE.hourlyRate).toFixed(2)}`);
      setActiveTask(null);
      setElapsedTime(0);
    }
  };

  // --- VIEWS ---

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      {/* 1. MASTER CLOCK-IN SECTION */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
        
        <div className="z-10 mb-6 md:mb-0">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg">RS</div>
             <div>
               <h2 className="text-2xl font-bold">Good Morning, Rahul</h2>
               <p className="text-slate-400 text-sm">It's a busy day at VR Here.</p>
             </div>
          </div>
          {isClockedIn && (
             <div className="mt-4 flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wide">Online • Since 09:00 AM</span>
             </div>
          )}
        </div>

        <div className="z-10 flex flex-col items-end gap-3">
           {!isClockedIn ? (
             <button 
               onClick={handleDayClockIn}
               className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 flex items-center transition-all transform hover:scale-105"
             >
               <Clock className="mr-2" /> CLOCK IN DAY
             </button>
           ) : (
             <button 
               onClick={handleDayClockOut}
               className="bg-rose-500/20 border border-rose-500/50 hover:bg-rose-500 hover:text-white text-rose-200 px-6 py-3 rounded-xl font-bold flex items-center transition-all"
             >
               <LogOut className="mr-2" /> CLOCK OUT
             </button>
           )}
           {isClockedIn && <p className="text-xs text-slate-400">Don't forget to start tasks individually.</p>}
        </div>
      </div>

      {/* 2. ACTIVE TASK RUNNER (Hidden Time) */}
      {isClockedIn && (
        <div className={`rounded-2xl border-2 transition-all p-6 flex flex-col md:flex-row items-center justify-between shadow-sm ${activeTask ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-dashed border-slate-300'}`}>
           {activeTask ? (
             <>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center animate-pulse">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Currently Working On</p>
                    <h3 className="text-xl font-bold text-slate-800">{activeTask.title}</h3>
                    <p className="text-sm text-slate-500">{activeTask.project}</p>
                  </div>
               </div>
               <div className="flex items-center gap-6 mt-4 md:mt-0">
                  <div className="text-right">
                    {/* Time hidden from employee as requested */}
                    <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                    <p className="text-lg font-bold text-emerald-600">Tracking Active</p>
                  </div>
                  <button 
                    onClick={handleTaskStop}
                    className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all transform hover:scale-110"
                    title="Stop Task"
                  >
                    <Square fill="currentColor" size={16} />
                  </button>
               </div>
             </>
           ) : (
             <div className="w-full text-center py-4">
                <div className="inline-flex p-3 bg-slate-50 rounded-full text-slate-400 mb-2"><Coffee size={24} /></div>
                <h3 className="text-slate-600 font-medium">No active task.</h3>
                <p className="text-slate-400 text-sm">Select a task below to start tracking.</p>
             </div>
           )}
        </div>
      )}

      {/* 3. TASK LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Task List */}
         <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-lg text-slate-800 flex items-center"><Briefcase size={20} className="mr-2 text-indigo-600"/> Assigned Tasks</h3>
            {INITIAL_TASKS.map(task => (
               <div key={task.id} className={`bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-all group flex items-center justify-between ${activeTask?.id === task.id ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' : 'border-slate-200'}`}>
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${task.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{task.priority}</span>
                        <span className="text-xs text-slate-400">• Est: {task.estimated}</span>
                     </div>
                     <h4 className="font-bold text-slate-700">{task.title}</h4>
                     <p className="text-xs text-slate-500">{task.project}</p>
                  </div>
                  
                  {activeTask?.id === task.id ? (
                     <div className="flex items-center text-indigo-600 text-xs font-bold animate-pulse px-4">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span> Running
                     </div>
                  ) : (
                     <button 
                       onClick={() => handleTaskStart(task)}
                       disabled={!isClockedIn}
                       className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Play fill="currentColor" size={14} className="ml-0.5"/>
                     </button>
                  )}
               </div>
            ))}
         </div>

         {/* Sidebar: Recent Logs */}
         <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center"><FileText size={18} className="mr-2 text-slate-400"/> Today's Log</h3>
            <div className="space-y-4 relative">
               {/* Timeline Line */}
               <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100"></div>
               
               {RECENT_LOGS.map((log, i) => (
                  <div key={i} className="relative pl-8">
                     <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-200 border-2 border-white ring-1 ring-slate-100"></div>
                     <p className="text-xs text-slate-400 mb-0.5">{log.start} - {log.end}</p>
                     <p className="text-sm font-bold text-slate-700">{log.task}</p>
                     <p className="text-xs text-slate-500">{log.project}</p>
                  </div>
               ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Tasks Completed</span>
                  <span className="font-bold text-slate-800">2</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* SIDEBAR (Simple Employee Version) */}
      <aside 
        className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white h-full border-r border-slate-200 flex flex-col transition-all duration-300 z-20`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        <div className="h-20 flex items-center justify-center border-b border-slate-100">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">VR</div>
           <span className={`ml-3 font-bold text-lg tracking-tight text-slate-800 transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Employee</span>
        </div>
        
        <div className="flex-1 py-6 px-3 space-y-1">
           {['Dashboard', 'My Tasks', 'Timesheet', 'Leaves', 'Payslips'].map(item => (
             <button 
               key={item} 
               onClick={() => setActiveTab(item)}
               className={`flex items-center w-full p-3 rounded-xl transition-all ${activeTab === item ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               {item === 'Dashboard' && <LayoutDashboard size={20} />}
               {item === 'My Tasks' && <CheckSquare size={20} />}
               {item === 'Timesheet' && <Clock size={20} />}
               {item === 'Leaves' && <Calendar size={20} />}
               {item === 'Payslips' && <FileText size={20} />}
               <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>{item}</span>
             </button>
           ))}
        </div>

        <div className="p-4 border-t border-slate-100">
           <button className="flex items-center w-full p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors">
              <LogOut size={20} className="shrink-0" />
              <span className={`ml-3 font-medium text-sm transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Logout</span>
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
           <h1 className="text-xl font-bold text-slate-800">{activeTab}</h1>
           <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-indigo-600 relative">
                 <Bell size={20}/>
                 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-600">RS</div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
           {activeTab === 'Dashboard' ? <DashboardView /> : (
             <div className="flex h-full items-center justify-center text-slate-400 flex-col">
                <Briefcase size={48} className="mb-4 opacity-20"/>
                <p>Module: {activeTab}</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}