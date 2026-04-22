function DashboardHome() {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-[#eef2ff] p-4">
        <h1 className="m-0 text-2xl font-bold text-[#1f2937]">مساء الخير، مريم</h1>
        <p className="mt-2 text-sm text-[#4b5563]">
          هذا نموذج للصفحات الداخلية مع تخطيط موحد (Navbar + Sidebar + Content).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#e5eaf3] bg-[#f8fafc] p-4">
          <p className="m-0 text-sm text-[#6b7280]">الوحدات</p>
          <p className="mt-2 text-3xl font-bold text-[#111827]">3</p>
        </div>
        <div className="rounded-2xl border border-[#e5eaf3] bg-[#f8fafc] p-4">
          <p className="m-0 text-sm text-[#6b7280]">تحتاج إلى تنظيف</p>
          <p className="mt-2 text-3xl font-bold text-[#111827]">1</p>
        </div>
        <div className="rounded-2xl border border-[#e5eaf3] bg-[#f8fafc] p-4">
          <p className="m-0 text-sm text-[#6b7280]">الوحدات المتاحة</p>
          <p className="mt-2 text-3xl font-bold text-[#111827]">1</p>
        </div>
        <div className="rounded-2xl border border-[#e5eaf3] bg-[#f8fafc] p-4">
          <p className="m-0 text-sm text-[#6b7280]">الصيانة</p>
          <p className="mt-2 text-3xl font-bold text-[#111827]">0</p>
        </div>
      </div>
    </section>
  )
}

export default DashboardHome
