export default function TablesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="display-md text-on-surface">الطاولات</h2>
        <p className="body-md text-on-surface-variant">إدارة حالة الطاولات وتوزيع المناطق</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`card p-6 flex flex-col items-center justify-center gap-4 transition-all ${i % 3 === 0 ? 'bg-primary-container text-on-primary-container border-2 border-primary' : 'bg-surface-container-lowest'}`}>
            <span className="text-2xl font-black">T-{i + 1}</span>
            <span className="material-symbols-outlined text-4xl">table_bar</span>
            <div className="text-center">
              <p className="text-xs font-bold uppercase opacity-60">{i % 3 === 0 ? 'مشغولة' : 'متاحة'}</p>
              <p className="text-sm font-medium">{i % 3 === 0 ? 'عائلة أحمد' : '4 مقاعد'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
