import type { StaffMember, LeaveRequest } from '@/lib/types';

interface StaffStore {
  staff: StaffMember[];
  leaveRequests: LeaveRequest[];
}

declare global {
  // eslint-disable-next-line no-var
  var __culinaryStaffStore: StaffStore | undefined;
}

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)) as T; }

const seedStaff: StaffMember[] = [
  {
    id: 'stf_1',
    name: 'أحمد خالد',
    nameEn: 'Ahmed Khalid',
    role: 'مدير',
    department: 'الإدارة',
    phone: '+971 50 100 0001',
    email: 'ahmed@maitred.ae',
    status: 'active',
    joinDate: '2022-01-15',
    baseSalary: 18000,
    rota: [
      { day: 'الأحد',    start: '09:00', end: '18:00', type: 'morning' },
      { day: 'الاثنين',  start: '09:00', end: '18:00', type: 'morning' },
      { day: 'الثلاثاء', start: '09:00', end: '18:00', type: 'morning' },
      { day: 'الأربعاء', start: '09:00', end: '18:00', type: 'morning' },
      { day: 'الخميس',  start: '09:00', end: '18:00', type: 'morning' },
      { day: 'الجمعة',  start: '', end: '', type: 'off' },
      { day: 'السبت',   start: '', end: '', type: 'off' },
    ],
    attendance: [
      { date: '2026-03-18', checkIn: '08:55', checkOut: '18:05', lateMinutes: 0, status: 'present' },
      { date: '2026-03-17', checkIn: '09:12', checkOut: '18:00', lateMinutes: 12, status: 'late' },
      { date: '2026-03-16', checkIn: '08:58', checkOut: '18:10', lateMinutes: 0, status: 'present' },
    ],
    payroll: [
      { month: 'مارس 2026',   baseSalary: 18000, overtime: 600,  deductions: 200, bonus: 1000, net: 19400, isPaid: false },
      { month: 'فبراير 2026', baseSalary: 18000, overtime: 0,    deductions: 200, bonus: 0,    net: 17800, isPaid: true  },
      { month: 'يناير 2026',  baseSalary: 18000, overtime: 1200, deductions: 200, bonus: 500,  net: 19500, isPaid: true  },
    ],
    reviews: [
      { id: 'rev_1', reviewerName: 'الإدارة العليا', date: '2026-03-01', rating: 5, comment: 'أداء ممتاز وقيادة محترفة للفريق.', category: 'teamwork' },
      { id: 'rev_2', reviewerName: 'عميل VIP',       date: '2026-02-14', rating: 5, comment: 'تجربة استثنائية بفضل الاستقبال الرائع.', category: 'service' },
    ],
    leaveBalance: { annual: 30, sick: 15, used: 5 },
    performanceScore: 96,
    rating: 4.9,
  },
  {
    id: 'stf_2',
    name: 'سارة المنصوري',
    nameEn: 'Sara Al-Mansouri',
    role: 'رئيس نادل',
    department: 'الخدمة',
    phone: '+971 50 100 0002',
    email: 'sara@maitred.ae',
    status: 'active',
    joinDate: '2023-03-01',
    baseSalary: 9500,
    rota: [
      { day: 'الأحد',    start: '16:00', end: '24:00', type: 'evening' },
      { day: 'الاثنين',  start: '16:00', end: '24:00', type: 'evening' },
      { day: 'الثلاثاء', start: '',      end: '',       type: 'off' },
      { day: 'الأربعاء', start: '16:00', end: '24:00', type: 'evening' },
      { day: 'الخميس',  start: '16:00', end: '24:00', type: 'evening' },
      { day: 'الجمعة',  start: '14:00', end: '24:00', type: 'evening' },
      { day: 'السبت',   start: '14:00', end: '24:00', type: 'evening' },
    ],
    attendance: [
      { date: '2026-03-18', checkIn: '15:50', checkOut: '00:05', lateMinutes: 0,  status: 'present' },
      { date: '2026-03-17', checkIn: '16:20', checkOut: '00:00', lateMinutes: 20, status: 'late' },
      { date: '2026-03-16', checkIn: '15:55', checkOut: '00:10', lateMinutes: 0,  status: 'present' },
    ],
    payroll: [
      { month: 'مارس 2026',   baseSalary: 9500, overtime: 800, deductions: 0, bonus: 500, net: 10800, isPaid: false },
      { month: 'فبراير 2026', baseSalary: 9500, overtime: 400, deductions: 0, bonus: 0,   net: 9900,  isPaid: true  },
    ],
    reviews: [
      { id: 'rev_3', reviewerName: 'أحمد خالد', date: '2026-03-01', rating: 4, comment: 'أداء جيد جداً، تحتاج إلى تحسين إدارة الوقت.', category: 'punctuality' },
    ],
    leaveBalance: { annual: 30, sick: 15, used: 3 },
    performanceScore: 88,
    rating: 4.5,
  },
  {
    id: 'stf_3',
    name: 'محمد العامري',
    nameEn: 'Mohammed Al-Ameri',
    role: 'طاهٍ',
    department: 'المطبخ',
    phone: '+971 50 100 0003',
    email: 'mohammed@maitred.ae',
    status: 'on-leave',
    joinDate: '2021-09-10',
    baseSalary: 12000,
    rota: [
      { day: 'الأحد',    start: '10:00', end: '22:00', type: 'split' },
      { day: 'الاثنين',  start: '10:00', end: '22:00', type: 'split' },
      { day: 'الثلاثاء', start: '10:00', end: '22:00', type: 'split' },
      { day: 'الأربعاء', start: '',      end: '',       type: 'off' },
      { day: 'الخميس',  start: '10:00', end: '22:00', type: 'split' },
      { day: 'الجمعة',  start: '10:00', end: '22:00', type: 'split' },
      { day: 'السبت',   start: '',      end: '',       type: 'off' },
    ],
    attendance: [
      { date: '2026-03-15', checkIn: '09:55', checkOut: '22:10', lateMinutes: 0, status: 'present' },
      { date: '2026-03-16', checkIn: '',      checkOut: '',       lateMinutes: 0, status: 'leave' },
      { date: '2026-03-17', checkIn: '',      checkOut: '',       lateMinutes: 0, status: 'leave' },
      { date: '2026-03-18', checkIn: '',      checkOut: '',       lateMinutes: 0, status: 'leave' },
    ],
    payroll: [
      { month: 'مارس 2026',   baseSalary: 12000, overtime: 0, deductions: 1200, bonus: 0,   net: 10800, isPaid: false },
      { month: 'فبراير 2026', baseSalary: 12000, overtime: 0, deductions: 0,    bonus: 800, net: 12800, isPaid: true  },
    ],
    reviews: [
      { id: 'rev_4', reviewerName: 'أحمد خالد', date: '2026-02-01', rating: 5, comment: 'إبداع في القائمة الموسمية، محترف حقيقي.', category: 'service' },
    ],
    leaveBalance: { annual: 30, sick: 15, used: 10 },
    performanceScore: 92,
    rating: 4.8,
  },
  {
    id: 'stf_4',
    name: 'نور الرشيدي',
    nameEn: 'Nour Al-Rashidi',
    role: 'استقبال',
    department: 'الاستقبال',
    phone: '+971 50 100 0004',
    email: 'nour@maitred.ae',
    status: 'active',
    joinDate: '2024-06-01',
    baseSalary: 7000,
    rota: [
      { day: 'الأحد',    start: '12:00', end: '20:00', type: 'morning' },
      { day: 'الاثنين',  start: '12:00', end: '20:00', type: 'morning' },
      { day: 'الثلاثاء', start: '12:00', end: '20:00', type: 'morning' },
      { day: 'الأربعاء', start: '12:00', end: '20:00', type: 'morning' },
      { day: 'الخميس',  start: '12:00', end: '20:00', type: 'morning' },
      { day: 'الجمعة',  start: '',      end: '',       type: 'off' },
      { day: 'السبت',   start: '',      end: '',       type: 'off' },
    ],
    attendance: [
      { date: '2026-03-18', checkIn: '11:58', checkOut: '20:05', lateMinutes: 0, status: 'present' },
      { date: '2026-03-17', checkIn: '12:00', checkOut: '20:00', lateMinutes: 0, status: 'present' },
    ],
    payroll: [
      { month: 'مارس 2026',   baseSalary: 7000, overtime: 200, deductions: 0, bonus: 0, net: 7200, isPaid: false },
      { month: 'فبراير 2026', baseSalary: 7000, overtime: 0,   deductions: 0, bonus: 0, net: 7000, isPaid: true  },
    ],
    reviews: [
      { id: 'rev_5', reviewerName: 'سارة المنصوري', date: '2026-03-10', rating: 4, comment: 'ترحيب رائع بالضيوف، تحتاج لتطوير مهارات إدارة الحجوزات.', category: 'service' },
    ],
    leaveBalance: { annual: 30, sick: 15, used: 2 },
    performanceScore: 78,
    rating: 4.1,
  },
];

const seedLeaveRequests: LeaveRequest[] = [
  {
    id: 'lv_1',
    staffId: 'stf_3',
    type: 'sick',
    from: '2026-03-16',
    to: '2026-03-22',
    days: 7,
    reason: 'مرض مفاجئ — تقرير طبي مرفق',
    status: 'approved',
    submittedAt: '2026-03-15',
  },
  {
    id: 'lv_2',
    staffId: 'stf_4',
    type: 'annual',
    from: '2026-04-01',
    to: '2026-04-10',
    days: 10,
    reason: 'إجازة عيد الفطر',
    status: 'pending',
    submittedAt: '2026-03-18',
  },
  {
    id: 'lv_3',
    staffId: 'stf_2',
    type: 'emergency',
    from: '2026-03-25',
    to: '2026-03-26',
    days: 2,
    reason: 'ظرف عائلي طارئ',
    status: 'pending',
    submittedAt: '2026-03-20',
  },
];

function initStaffStore(): StaffStore {
  if (!globalThis.__culinaryStaffStore) {
    globalThis.__culinaryStaffStore = {
      staff: clone(seedStaff),
      leaveRequests: clone(seedLeaveRequests),
    };
  }
  return globalThis.__culinaryStaffStore;
}

export function listStaff(): StaffMember[] { return clone(initStaffStore().staff); }
export function getStaffMember(id: string): StaffMember | undefined { return listStaff().find(s => s.id === id); }
export function listLeaveRequests(): LeaveRequest[] { return clone(initStaffStore().leaveRequests); }
export function getPendingLeaveRequests(): LeaveRequest[] { return listLeaveRequests().filter(r => r.status === 'pending'); }

export function updateLeaveRequest(id: string, status: 'approved' | 'rejected'): LeaveRequest | undefined {
  const store = initStaffStore();
  const req = store.leaveRequests.find(r => r.id === id);
  if (!req) return undefined;
  req.status = status;
  return clone(req);
}

export function createLeaveRequest(input: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status'>): LeaveRequest {
  const store = initStaffStore();
  const req: LeaveRequest = {
    ...input,
    id: `lv_${Date.now()}`,
    status: 'pending',
    submittedAt: new Date().toISOString().split('T')[0],
  };
  store.leaveRequests.push(req);
  return clone(req);
}

export function getStaffSummary() {
  const staff = listStaff();
  const leaves = getPendingLeaveRequests();
  return {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    onLeave: staff.filter(s => s.status === 'on-leave').length,
    pendingRequests: leaves.length,
    avgPerformance: Math.round(staff.reduce((s, m) => s + m.performanceScore, 0) / staff.length),
    totalPayroll: staff.reduce((s, m) => s + m.baseSalary, 0),
  };
}
