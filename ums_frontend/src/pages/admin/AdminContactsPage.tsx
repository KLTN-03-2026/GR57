import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { adminRepository } from '@/api';
import { ContactItem } from '@/types';
import { MessageCircle, Phone, Mail, Search, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function AdminContactsPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [contacts, setContacts] = useState<ContactItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== 'admin') {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const data = await adminRepository.getContacts();
            setContacts(data);
        } catch (error) {
            console.error('Failed to load contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (contactId: string, status: ContactItem['status']) => {
        try {
            await adminRepository.updateContactStatus(contactId, status);
            await loadContacts();
        } catch (error) {
            console.error('Failed to update contact status:', error);
        }
    };

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'in-progress':
                return <Clock className="w-5 h-5 text-blue-600" />;
            default:
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved':
                return 'text-green-600 bg-green-50';
            case 'in-progress':
                return 'text-blue-600 bg-blue-50';
            default:
                return 'text-yellow-600 bg-yellow-50';
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-[#f1f5f9]">
                <AdminSidebar activeMenu="contacts" />
                <div className="flex-1 ml-64 flex flex-col">
                    <AdminHeader title="Quản lý liên hệ" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-lg">Đang tải...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f1f5f9]">
            <AdminSidebar activeMenu="contacts" />

            <div className="flex-1 ml-64 flex flex-col">
                <AdminHeader title="Quản lý liên hệ" />

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
                                            placeholder="Tìm kiếm theo tên, email hoặc chủ đề..."
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
                                        <option value="new">Mới</option>
                                        <option value="in-progress">Đang xử lý</option>
                                        <option value="resolved">Đã giải quyết</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Contacts List */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredContacts.map((contact) => (
                                <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <MessageCircle className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                                                <p className="text-sm text-gray-500">{contact.subject}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                                            {getStatusIcon(contact.status)}
                                            {contact.status === 'new' ? 'Mới' :
                                                contact.status === 'in-progress' ? 'Đang xử lý' : 'Đã giải quyết'}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span>{contact.email}</span>
                                        </div>
                                        {contact.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4" />
                                                <span>{contact.phone}</span>
                                            </div>
                                        )}
                                        <div className="text-sm text-gray-500">
                                            Nhận lúc: {contact.createdAt}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                        <p className="text-sm text-gray-700">{contact.message}</p>
                                    </div>

                                    {contact.status !== 'resolved' && (
                                        <div className="flex gap-2">
                                            {contact.status === 'new' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(contact.id, 'in-progress')}
                                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    Bắt đầu xử lý
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleStatusUpdate(contact.id, 'resolved')}
                                                className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                Đánh dấu đã giải quyết
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {filteredContacts.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <div className="text-gray-500">Không tìm thấy liên hệ nào</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}