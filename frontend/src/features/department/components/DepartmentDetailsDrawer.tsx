import { useDepartmentStore } from '../store/department.store';
import { useDepartment } from '../hooks/useDepartment';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  Cog, 
  Activity, 
  BarChart3, 
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const productionData = [
  { name: 'Mon', target: 4000, actual: 3800 },
  { name: 'Tue', target: 4000, actual: 4100 },
  { name: 'Wed', target: 4000, actual: 3950 },
  { name: 'Thu', target: 4000, actual: 4200 },
  { name: 'Fri', target: 4000, actual: 3700 },
  { name: 'Sat', target: 4000, actual: 4050 },
];

const utilizationData = [
  { name: 'Running', value: 75, fill: '#3b82f6' },
  { name: 'Idle', value: 15, fill: '#f59e0b' },
  { name: 'Maint', value: 10, fill: '#ef4444' }
];

export function DepartmentDetailsDrawer() {
  const store = useDepartmentStore();
  
  // Parse numeric ID from string store value
  const numericId = store.selectedDepartmentId ? parseInt(store.selectedDepartmentId, 10) : null;
  
  const { department: dept, isLoading } = useDepartment(numericId);

  const handleClose = (open: boolean) => {
    store.setDetailsDrawerOpen(open);
    if (!open) {
      store.setSelectedDepartmentId(null);
    }
  };

  return (
    <Sheet open={store.isDetailsDrawerOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[600px] sm:max-w-[800px] bg-zinc-950/95 backdrop-blur-xl border-l border-white/10 p-0 text-white flex flex-col h-full overflow-hidden">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
              <p className="text-white/50 text-sm">Loading department details...</p>
            </div>
          </div>
        )}

        {/* No Data */}
        {!isLoading && !dept && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-white/50 text-sm">Department not found</p>
            </div>
          </div>
        )}

        {/* Loaded */}
        {!isLoading && dept && (
          <>
            <SheetHeader className="p-6 pb-0 border-b border-white/10 bg-zinc-900/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <SheetTitle className="text-2xl text-white font-bold tracking-tight">
                    {dept.name}
                  </SheetTitle>
                  <div className="flex items-center gap-3 mt-1 text-sm text-zinc-400">
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-xs border border-white/10">
                      {dept.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                      dept.status === 'active' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}>
                      {dept.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
                <div className="px-6 border-b border-white/10 bg-zinc-900/30 sticky top-0 z-10">
                  <TabsList className="bg-transparent border-0 justify-start gap-6 h-auto p-0">
                    {[
                      { id: 'overview', icon: Building2, label: 'Overview' },
                      { id: 'workers', icon: Users, label: 'Workers' },
                      { id: 'machines', icon: Cog, label: 'Machines' },
                      { id: 'production', icon: Activity, label: 'Production' },
                      { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                      { id: 'timeline', icon: Clock, label: 'Timeline' }
                    ].map((tab) => (
                      <TabsTrigger 
                        key={tab.id}
                        value={tab.id}
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none pb-3 pt-3 px-1 text-white/60 hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <tab.icon className="w-4 h-4" />
                          {tab.label}
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="p-6 flex-1">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="m-0 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-white/50 mb-1">Department Code</div>
                        <div className="text-lg font-mono font-medium">{dept.code}</div>
                      </div>
                      <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-white/50 mb-1">Status</div>
                        <div className="flex items-center gap-2">
                          {dept.status === 'active' 
                            ? <CheckCircle2 className="w-4 h-4 text-green-500" /> 
                            : <AlertCircle className="w-4 h-4 text-orange-500" />}
                          <span className="text-lg font-medium capitalize">{dept.status}</span>
                        </div>
                      </div>
                      <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-white/50 mb-1 flex items-center gap-1">
                          <Users className="w-3 h-3" /> Workers
                        </div>
                        <div className="text-lg font-bold text-purple-400">{dept.workers}</div>
                      </div>
                      <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-white/50 mb-1 flex items-center gap-1">
                          <Cog className="w-3 h-3" /> Machines
                        </div>
                        <div className="text-lg font-bold text-blue-400">{dept.machines}</div>
                      </div>
                      <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-white/50 mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Created
                        </div>
                        <div className="flex items-center gap-2 text-base font-medium">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          {dept.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
                        <div className="text-xs text-white/50 mb-1">Last Updated</div>
                        <div className="text-base font-medium">{dept.updatedAt.toLocaleDateString()}</div>
                      </div>
                    </motion.div>
                    
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-5">
                      <h3 className="text-sm font-medium text-white/70 mb-2">Description</h3>
                      <p className="text-white/90 leading-relaxed">
                        {dept.description || 'No description provided for this department.'}
                      </p>
                    </div>
                  </TabsContent>

                  {/* Workers Tab */}
                  <TabsContent value="workers" className="m-0 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                        <div className="text-purple-400 text-3xl font-bold">{dept.workers}</div>
                        <div className="text-xs text-purple-300 mt-1 uppercase tracking-wider">Total Workers</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                        <div className="text-green-400 text-3xl font-bold">{Math.round(dept.workers * 0.95)}</div>
                        <div className="text-xs text-green-300 mt-1 uppercase tracking-wider">Present Today</div>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                        <div className="text-red-400 text-3xl font-bold">{Math.round(dept.workers * 0.05)}</div>
                        <div className="text-xs text-red-300 mt-1 uppercase tracking-wider">Absent</div>
                      </div>
                    </div>
                    
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-5">
                      <h3 className="text-sm font-medium text-white/70 mb-4">Skills Distribution</h3>
                      <div className="space-y-3">
                        {['Expert', 'Advanced', 'Intermediate', 'Trainee'].map((skill, idx) => (
                          <div key={skill} className="flex items-center gap-3">
                            <div className="w-24 text-xs text-white/60">{skill}</div>
                            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${100 - (idx * 20)}%` }}
                              />
                            </div>
                            <div className="w-8 text-right text-xs font-medium">{100 - (idx * 20)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Analytics Tab */}
                  <TabsContent value="analytics" className="m-0 space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-5">
                      <h3 className="text-sm font-medium text-white/70 mb-6">Weekly Production Trend</h3>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={productionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} />
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                              itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                            <Area type="step" dataKey="target" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-5">
                        <h3 className="text-sm font-medium text-white/70 mb-4">Machine Utilization</h3>
                        <div className="h-[150px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={utilizationData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {utilizationData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-5 flex flex-col justify-center items-center">
                        <h3 className="text-sm font-medium text-white/70 mb-2 w-full text-left">Total Resources</h3>
                        <div className="mt-4 space-y-3 w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm flex items-center gap-2">
                              <Users className="w-4 h-4 text-purple-400" /> Workers
                            </span>
                            <span className="text-white font-bold">{dept.workers}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm flex items-center gap-2">
                              <Cog className="w-4 h-4 text-blue-400" /> Machines
                            </span>
                            <span className="text-white font-bold">{dept.machines}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm flex items-center gap-2">
                              <Activity className="w-4 h-4 text-cyan-400" /> Tasks
                            </span>
                            <span className="text-white font-bold">{dept.productionLines}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Timeline Tab */}
                  <TabsContent value="timeline" className="m-0 space-y-0">
                    <div className="relative pl-6 border-l border-white/10 space-y-8 py-2">
                      {[
                        { title: 'Department Updated', date: dept.updatedAt, desc: 'Department details updated.', type: 'update' },
                        { title: 'Department Created', date: dept.createdAt, desc: 'Initial setup and resource allocation completed.', type: 'creation' },
                      ].map((event, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[31px] w-3 h-3 bg-blue-500 rounded-full border-[3px] border-zinc-950" />
                          <div className="text-xs text-blue-400 font-mono mb-1">{event.date.toLocaleDateString()}</div>
                          <div className="text-base font-medium text-white mb-1">{event.title}</div>
                          <div className="text-sm text-white/60">{event.desc}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  {/* Machines Tab */}
                  <TabsContent value="machines" className="m-0">
                    <div className="p-8 text-center text-white/50 bg-zinc-900/30 rounded-xl border border-white/5 border-dashed">
                      Machine detailed list module to be integrated here.
                    </div>
                  </TabsContent>
                  
                  {/* Production Tab */}
                  <TabsContent value="production" className="m-0">
                    <div className="p-8 text-center text-white/50 bg-zinc-900/30 rounded-xl border border-white/5 border-dashed">
                      Live production tracking to be integrated here.
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
