import { AccountantSidebar } from '@/components/layouts/AccountantSidebar';
import { AccountantHeader } from '@/components/layouts/AccountantHeader';
import { useState, useMemo, useEffect } from 'react';
import {
  Download,
  FileText,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { Toast } from '@/components/notification/Toast';

type ReportType = 'semester' | 'monthly' | 'yearly';

interface User {
  email: string;
  name?: string;
  role: string;
}

export default function FinancialReportsPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [reportType, setReportType] = useState<ReportType>('semester');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !authUser) {
      navigate('/');
      return;
    }
    if (authUser.role !== 'accountant') {
      navigate('/');
      return;
    }
    setUser({
      email: authUser.username,
      name: authUser.fullName,
      role: authUser.role,
    });
  }, [isAuthenticated, authUser, navigate]);

  // Mock data for semester revenue
  const semesterRevenueData = useMemo(() => [
    { id: 'sem-1', semester: 'HK1 2024-2025', revenue: 820000000, students: 1850 },
    { id: 'sem-2', semester: 'HK2 2024-2025', revenue: 950000000, students: 2100 },
    { id: 'sem-3', semester: 'HK hè 2025', revenue: 280000000, students: 650 },
    { id: 'sem-4', semester: 'HK1 2025-2026', revenue: 1150000000, students: 2450 },
    { id: 'sem-5', semester: 'HK2 2025-2026', revenue: 1280000000, students: 2700 },
  ], []);

  // Mock data for monthly revenue
  const monthlyRevenueData = useMemo(() => [
    { id: 'mon-1', month: 'T1', revenue: 95000000, paid: 1245, pending: 342 },
    { id: 'mon-2', month: 'T2', revenue: 110000000, paid: 1450, pending: 298 },
    { id: 'mon-3', month: 'T3', revenue: 125000000, paid: 1680, pending: 256 },
    { id: 'mon-4', month: 'T4', revenue: 150000000, paid: 1920, pending: 215 },
    { id: 'mon-5', month: 'T5', revenue: 135000000, paid: 1750, pending: 280 },
    { id: 'mon-6', month: 'T6', revenue: 160000000, paid: 2050, pending: 190 },
    { id: 'mon-7', month: 'T7', revenue: 85000000, paid: 1120, pending: 150 },
    { id: 'mon-8', month: 'T8', revenue: 145000000, paid: 1890, pending: 245 },
    { id: 'mon-9', month: 'T9', revenue: 155000000, paid: 2000, pending: 220 },
    { id: 'mon-10', month: 'T10', revenue: 165000000, paid: 2150, pending: 200 },
    { id: 'mon-11', month: 'T11', revenue: 175000000, paid: 2280, pending: 180 },
    { id: 'mon-12', month: 'T12', revenue: 180000000, paid: 2350, pending: 165 },
  ], []);

  // Mock data for yearly comparison
  const yearlyComparisonData = useMemo(() => [
    { id: 'year-1', year: '2022', revenue: 1850000000 },
    { id: 'year-2', year: '2023', revenue: 2150000000 },
    { id: 'year-3', year: '2024', revenue: 2450000000 },
    { id: 'year-4', year: '2025', revenue: 2850000000 },
    { id: 'year-5', year: '2026', revenue: 3280000000 },
  ], []);

  const getCurrentData = () => {
    switch (reportType) {
      case 'semester':
        return semesterRevenueData;
      case 'monthly':
        return monthlyRevenueData;
      case 'yearly':
        return yearlyComparisonData;
      default:
        return semesterRevenueData;
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B';
    }
    return (value / 1000000).toFixed(0) + 'M';
  };

  const handleExportPDF = () => {
    setToast({ type: 'success', message: 'Xuất báo cáo PDF thành công!' });
  };

  const handleExportCSV = () => {
    setToast({ type: 'success', message: 'Xuất báo cáo CSV thành công!' });
  };

  const totalRevenue = reportType === 'semester'
    ? semesterRevenueData.reduce((sum, item) => sum + item.revenue, 0)
    : reportType === 'monthly'
    ? monthlyRevenueData.reduce((sum, item) => sum + item.revenue, 0)
    : yearlyComparisonData.reduce((sum, item) => sum + item.revenue, 0);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      <AccountantSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <AccountantHeader title="Báo cáo tài chính" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Báo cáo tài chính</h2>
                <p className="text-gray-600 mt-1">Phân tích doanh thu và xu hướng thanh toán</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <FileText className="w-5 h-5" />
                  Xuất CSV
                </button>
                <button
                  onClick={handleExportPDF}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Download className="w-5 h-5" />
                  Xuất PDF
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(totalRevenue)} VNĐ
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tăng trưởng</p>
                    <p className="text-2xl font-bold text-green-600">+15.3%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kỳ báo cáo</p>
                    <p className="text-xl font-bold text-gray-900">
                      {reportType === 'semester' ? 'Theo học kỳ' :
                       reportType === 'monthly' ? 'Theo tháng' : 'Theo năm'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại báo cáo
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReportType('semester')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        reportType === 'semester'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Theo học kỳ
                    </button>
                    <button
                      onClick={() => setReportType('monthly')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        reportType === 'monthly'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Theo tháng
                    </button>
                    <button
                      onClick={() => setReportType('yearly')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        reportType === 'yearly'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Theo năm
                    </button>
                  </div>
                </div>

                {reportType === 'monthly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Năm
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Doanh thu {reportType === 'semester' ? 'theo học kỳ' : reportType === 'monthly' ? 'theo tháng' : 'theo năm'}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getCurrentData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey={reportType === 'semester' ? 'semester' : reportType === 'monthly' ? 'month' : 'year'}
                      stroke="#6b7280"
                      angle={reportType === 'semester' ? -15 : 0}
                      textAnchor={reportType === 'semester' ? 'end' : 'middle'}
                      height={reportType === 'semester' ? 80 : 30}
                    />
                    <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value: number) => formatCurrency(value) + ' VNĐ'} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Doanh thu" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Xu hướng doanh thu</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getCurrentData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey={reportType === 'semester' ? 'semester' : reportType === 'monthly' ? 'month' : 'year'}
                      stroke="#6b7280"
                      angle={reportType === 'semester' ? -15 : 0}
                      textAnchor={reportType === 'semester' ? 'end' : 'middle'}
                      height={reportType === 'semester' ? 80 : 30}
                    />
                    <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value: number) => formatCurrency(value) + ' VNĐ'} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Doanh thu"
                      dot={{ fill: '#10b981', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Chi tiết báo cáo</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {reportType === 'semester' ? 'Học kỳ' : reportType === 'monthly' ? 'Tháng' : 'Năm'}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Doanh thu
                      </th>
                      {reportType === 'semester' && (
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Số sinh viên
                        </th>
                      )}
                      {reportType === 'monthly' && (
                        <>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Đã thanh toán
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Chờ thanh toán
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getCurrentData().map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">
                            {item.semester || item.month || item.year}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="font-semibold text-gray-900">
                            {item.revenue.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </td>
                        {reportType === 'semester' && (
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-gray-700">{item.students}</span>
                          </td>
                        )}
                        {reportType === 'monthly' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-green-600 font-medium">{item.paid}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-yellow-600 font-medium">{item.pending}</span>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* AI Assistant Button */}
      <button
        onClick={() => setToast({ type: 'warning', message: 'Tính năng Trợ lý AI đang được phát triển!' })}
        className="fixed bottom-8 right-8 w-16 h-16 hover:scale-110 transition-transform duration-200 z-50"
        aria-label="AI Assistant"
      >
        <AiAssistantButton />
      </button>
    </div>
  );
}
