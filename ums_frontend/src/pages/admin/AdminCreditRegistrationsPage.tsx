import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { adminRepository } from '@/api';
import { CreditRegistrationItem } from '@/types';
import { CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';

export default function AdminCreditRegistrationsPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [registrations, setRegistrations] = useState<CreditRegistrationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== 'admin') {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        loadRegistrations();
    }, []);

    const loadRegistrations = async () => {
        try {
            const data = await adminRepository.getCreditRegistrations();
            setRegistrations(data);
        } catch (error) {
            console.error('Failed to load credit registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (registrationId: string, status: CreditRegistrationItem['status']) => {
        try {
            await adminRepository.updateCreditRegistrationStatus(registrationId, status);
            await loadRegistrations();
        } catch (error) {
            console.error('Failed to update registration status:', error);
        }
    };

    const filteredRegistrations = registrations.filter(registration => {
        const matchesSearch = registration.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registration.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'text-green-600 bg-green-50';
            case 'rejected':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-yellow-600 bg-yellow-50';
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-[#f1f5f9]">
                <AdminSidebar activeMenu="credit-registrations" />
                <div className="flex-1 ml-64 flex flex-col">
                    <AdminHeader title="Quản lý đăng ký tín chỉ" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-lg">Đang tải...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f1f5f9]">
            <AdminSidebar activeMenu="credit-registrations" />

            <div className="flex-1 ml-64 flex flex-col">
                <AdminHeader title="Quản lý đăng ký tín chỉ" />

                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm theo tên học viên hoặc môn học..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-gray-400" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="pending">Chờ duyệt</option>
                                        <option value="approved">Đã duyệt</option>
                                        <option value="rejected">Từ chối</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Registrations Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Danh sách đăng ký tín chỉ ({filteredRegistrations.length})
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Học viên
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Môn học
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tín chỉ
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Học kỳ
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Trạng thái
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ngày đăng ký
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredRegistrations.map((registration) => (
                                            <tr key={registration.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {registration.studentName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {registration.studentId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {registration.subjectName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {registration.subjectId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {registration.credits} tín chỉ
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {registration.semesterName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                                                        {getStatusIcon(registration.status)}
                                                        {registration.status === 'pending' ? 'Chờ duyệt' :
                                                            registration.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {registration.registeredAt}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {registration.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleStatusUpdate(registration.id, 'approved')}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Duyệt
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(registration.id, 'rejected')}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Từ chối
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredRegistrations.length === 0 && (
                                <div className="px-6 py-12 text-center">
                                    <div className="text-gray-500">Không tìm thấy đăng ký tín chỉ nào</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}