import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { useMemo } from 'react';
import { ReceiptText, CircleDollarSign, AlertTriangle } from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { getAllTuitionRecords } from '@/data/mockTuition';

const currency = (value: number) => `${(value / 1000000).toFixed(0)}M VNĐ`;

export default function AdminTuitionCoordinationPage() {
  const tuitionItems = useMemo(() => {
    const records = getAllTuitionRecords();
    const grouped = new Map<string, { expected: number; paid: number; overdue: number }>();
    records.forEach((record) => {
      const key = record.semester;
      const current = grouped.get(key) || { expected: 0, paid: 0, overdue: 0 };
      current.expected += record.amount;
      if (record.status === 'paid') current.paid += record.amount;
      if (record.status !== 'paid') current.overdue += 1;
      grouped.set(key, current);
    });
    return Array.from(grouped.entries()).map(([semester, value], index) => ({
      id: `${index + 1}`,
      classCode: semester,
      ...value,
    }));
  }, []);

  const totalExpected = tuitionItems.reduce((sum, item) => sum + item.expected, 0);
  const totalPaid = tuitionItems.reduce((sum, item) => sum + item.paid, 0);
  const totalRemaining = totalExpected - totalPaid;

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      <AdminSidebar activeMenu="tuition" />
      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader title="Điều phối học phí" />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5"><p className="text-sm text-gray-500">Dự thu học kỳ</p><p className="text-2xl font-bold text-[#0a2540]">{currency(totalExpected)}</p></div>
              <div className="bg-white border border-gray-200 rounded-xl p-5"><p className="text-sm text-gray-500">Đã thu</p><p className="text-2xl font-bold text-green-600">{currency(totalPaid)}</p></div>
              <div className="bg-white border border-gray-200 rounded-xl p-5"><p className="text-sm text-gray-500">Còn thiếu</p><p className="text-2xl font-bold text-red-600">{currency(totalRemaining)}</p></div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 font-semibold text-[#0a2540]">
                <ReceiptText className="w-5 h-5" />
                Theo dõi học phí theo học kỳ (phối hợp role kế toán)
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm">Học kỳ</th>
                    <th className="px-6 py-3 text-left text-sm">Dự thu</th>
                    <th className="px-6 py-3 text-left text-sm">Đã thu</th>
                    <th className="px-6 py-3 text-left text-sm">Tỉ lệ</th>
                    <th className="px-6 py-3 text-left text-sm">Nợ quá hạn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tuitionItems.map((item) => {
                    const rate = Math.round((item.paid / item.expected) * 100);
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 font-semibold text-[#0a2540]">{item.classCode}</td>
                        <td className="px-6 py-4">{currency(item.expected)}</td>
                        <td className="px-6 py-4 text-green-700">{currency(item.paid)}</td>
                        <td className="px-6 py-4">
                          <div className="w-36 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#0a2540] h-full" style={{ width: `${rate}%` }} />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{rate}%</p>
                        </td>
                        <td className="px-6 py-4">
                          {item.overdue > 0 ? (
                            <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2.5 py-1 rounded-full text-xs">
                              <AlertTriangle className="w-3 h-3" />
                              {item.overdue} học viên
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2.5 py-1 rounded-full text-xs">
                              <CircleDollarSign className="w-3 h-3" />
                              Đủ thu
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <button className="fixed bottom-8 right-8 w-16 h-16 z-50 hover:scale-110 transition-transform cursor-pointer" aria-label="AI Assistant"><AiAssistantButton /></button>
    </div>
  );
}

