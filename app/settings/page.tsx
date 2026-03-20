const settingSections = [
  {
    title: 'المطعم',
    items: [
      { icon: 'restaurant_menu', label: 'إعدادات القائمة', sub: 'إضافة وتعديل الأقسام والأطباق والأسعار', badge: null },
      { icon: 'table_restaurant', label: 'مخطط المطعم', sub: 'توزيع الطاولات والمناطق والسعة الاستيعابية', badge: null },
      { icon: 'schedule', label: 'أوقات العمل', sub: 'تحديد ساعات الافتتاح والإغلاق', badge: null },
    ],
  },
  {
    title: 'الحجوزات',
    items: [
      { icon: 'event_available', label: 'إعدادات الحجز', sub: 'الحد الأقصى للحجوزات وفترات التسجيل', badge: null },
      { icon: 'confirmation_number', label: 'قواعد الإلغاء', sub: 'سياسة الإلغاء والرسوم', badge: null },
      { icon: 'notifications_active', label: 'تنبيهات الحجز', sub: 'إشعارات تأكيد الحضور والتذكير', badge: '2' },
    ],
  },
  {
    title: 'التسويق',
    items: [
      { icon: 'campaign', label: 'قنوات التواصل', sub: 'ربط SMS والبريد الإلكتروني وواتساب', badge: null },
      { icon: 'auto_awesome', label: 'العروض التلقائية', sub: 'قواعد توليد العروض الذكية', badge: null },
    ],
  },
  {
    title: 'النظام',
    items: [
      { icon: 'manage_accounts', label: 'المستخدمون والصلاحيات', sub: 'إدارة حسابات الفريق ومستويات الوصول', badge: null },
      { icon: 'language', label: 'اللغة والمنطقة الزمنية', sub: 'العربية • توقيت الإمارات (GMT+4)', badge: null },
      { icon: 'backup', label: 'النسخ الاحتياطي', sub: 'آخر نسخ احتياطي: اليوم، 3:00 صباحاً', badge: null },
      { icon: 'info', label: 'حول النظام', sub: 'Maître D\' CRM v1.0 — مبني بـ Next.js 14', badge: null },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <header>
        <h2 className="page-title">الإعدادات</h2>
        <p className="page-subtitle">تخصيص النظام وتفضيلات المطعم</p>
      </header>

      {/* Profile card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-secondary-container">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr2xxuABbXcVwXTBSgOycTQZmfEzDj2m5uKJ0jli8vGyAcxjt6HAf6hPnACtCufmWYM3iZyMsmYkL_JPd6Xdp1Y75oEfpMdTU_ZvD5MGfqllxtLlK6MZMqr5zAQMQUZ6TpDNKSzOYV8gswx_j55Gd9cQiQBABito94jViX2naWI1zyzetm6B311JxkpfvVCU4C-nwrf3NPFDrTCxxSC0P0KVbpJ2vz6XeSJyBoce9yWdShwLJBG1AR17CiOoAmlrfT3d3eLM0KEOs"
            alt="المدير"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-on-surface">أحمد خالد</h3>
          <p className="text-sm text-on-surface-variant">مدير الفرع • ahmed@maitred.app</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-primary-container text-primary uppercase">مدير</span>
            <span className="text-[10px] text-on-surface-variant">منذ يناير 2025</span>
          </div>
        </div>
        <button className="btn-secondary text-sm py-2 px-4">تعديل الملف</button>
      </div>

      {/* Settings groups */}
      {settingSections.map(section => (
        <div key={section.title} className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">{section.title}</h3>
          <div className="card divide-y divide-outline-variant/20 overflow-hidden">
            {section.items.map(item => (
              <button
                key={item.label}
                className="w-full flex items-center gap-4 p-4 sm:p-5 hover:bg-surface-container-low transition-colors group text-right"
              >
                <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="font-bold text-on-surface text-sm">{item.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5 truncate">{item.sub}</p>
                </div>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-error text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                    {item.badge}
                  </span>
                )}
                <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors flex-shrink-0">arrow_back</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Danger zone */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-error px-1">منطقة الخطر</h3>
        <div className="card p-5 flex items-center justify-between gap-4" style={{ borderColor: 'rgba(186,26,26,0.15)', borderWidth: 1, borderStyle: 'solid' }}>
          <div>
            <p className="font-bold text-on-surface">تسجيل الخروج</p>
            <p className="text-xs text-on-surface-variant">الخروج من جميع الأجهزة</p>
          </div>
          <button className="px-5 py-2.5 rounded-full text-sm font-bold bg-error-container text-error hover:bg-error hover:text-white transition-colors">
            خروج
          </button>
        </div>
      </div>

      {/* Version footer */}
      <p className="text-center text-xs text-on-surface-variant pb-4">
        Maître D' CRM v1.0.0 • مبني بـ Next.js 14 + Tailwind CSS 3
      </p>
    </div>
  );
}
