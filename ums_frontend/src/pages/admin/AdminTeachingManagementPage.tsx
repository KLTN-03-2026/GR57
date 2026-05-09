import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { adminRepository } from '@/api';
import { AdminUserAccount, ClassScheduleItem } from '@/types';
import { Users, Search, UserCheck, BookOpen, Calendar, Clock, MapPin, Filter, Plus, Edit, Trash2 } from 'lucide-react';

interface InstructorWorkload {
    instructorId: string;
    instructorName: string;
    totalClasses: number;
    totalStudents: number;
    totalCredits: number;
    classes: ClassScheduleItem[];
}

interface TeachingAssignment {
    id: string;
    instructorId: string;
    instructorName: string;
    classId: string;
    classCode: string;
    subject: string;
    semester: string;
    assignedAt: string;
}

export default function AdminTeachingManagementPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [instructors, setInstructors] = useState<AdminUserAccount[]>([]);
    const [classes, setClasses] = useState<ClassScheduleItem[]>([]);
    const [workloads, setWorkloads] = useState<InstructorWorkload[]>([]);
    const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'workload' | 'assignments' | 'assign'>('workload');
    const [selectedInstructor, setSelectedInstructor] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');

    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== 'admin') {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [instructorsData, classesData] = await Promise.all([
                adminRepository.getUsers(),
                adminRepository.getClasses()
            ]);

            const instructorUsers = instructorsData.filter(u => u.role === 'instructor');
            setInstructors(instructorUsers);
            setClasses(classesData);

            // Calculate workloads
            const workloadData = calculateWorkloads(instructorUsers, classesData);
            setWorkloads(workloadData);

            // Mock assignments data (in real app, this would come from API)
            const mockAssignments = generateMockAssignments(instructorUsers, classesData);
            setAssignments(mockAssignments);

        } catch (error) {
            console.error('Failed to load teaching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateWorkloads = (instructors: AdminUserAccount[], classes: ClassScheduleItem[]): InstructorWorkload[] => {
        return instructors.map(instructor => {
            const instructorClasses = classes.filter(cls => cls.instructor === instructor.name);
            const totalStudents = instructorClasses.reduce((sum, cls) => sum + cls.enrolled, 0);
            const totalCredits = instructorClasses.length * 3; // Assuming 3 credits per class

            return {
                instructorId: instructor.id,
                instructorName: instructor.name,
                totalClasses: instructorClasses.length,
                totalStudents,
                totalCredits,
                classes: instructorClasses
            };
        });
    };

    const generateMockAssignments = (instructors: AdminUserAccount[], classes: ClassScheduleItem[]): TeachingAssignment[] => {
        const assignments: TeachingAssignment[] = [];
        classes.forEach(cls => {
            const instructor = instructors.find(inst => inst.name === cls.instructor);
            if (instructor) {
                assignments.push({
                    id: `ASSIGN_${cls.id}_${instructor.id}`,
                    instructorId: instructor.id,
                    instructorName: instructor.name,
                    classId: cls.id,
                    classCode: cls.classCode,
                    subject: cls.subject,
                    semester: 'HK2 2025-2026', // Mock semester
                    assignedAt: '2026-01-15'
                });
            }
        });
        return assignments;
    };

    const handleAssignInstructor = async () => {
        if (!selectedInstructor || !selectedClass) return;

        try {
            // In real implementation, this would call an API
            // await adminRepository.assignInstructorToClass(selectedInstructor, selectedClass);

            // For now, just reload data
            await loadData();
            setSelectedInstructor('');
            setSelectedClass('');
            alert('Phân công giảng viên thành công!');
        } catch (error) {
            console.error('Failed to assign instructor:', error);
            alert('Có lỗi xảy ra khi phân công giảng viên');
        }
    };

    const filteredWorkloads = workloads.filter(workload =>
        workload.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAssignments = assignments.filter(assignment =>
        assignment.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.classCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-screen bg-[#f1f5f9]">
                <AdminSidebar activeMenu="teaching" />
                <div className="flex-1 ml-64 flex flex-col">
                    <AdminHeader title="Quản lý giảng dạy" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-lg">Đang tải...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f1f5f9]">
            <AdminSidebar activeMenu="teaching" />

            <div className="flex-1 ml-64 flex flex-col">
                <AdminHeader title="Quản lý giảng dạy" />

                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => setActiveTab('workload')}
                                        className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'workload'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Workload Giảng viên
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('assignments')}
                                        className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'assignments'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Phân công giảng dạy
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('assign')}
                                        className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'assign'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Phân công mới
                                    </button>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Workload Tab */}
                        {activeTab === 'workload' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredWorkloads.map((workload) => (
                                    <div key={workload.instructorId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Users className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{workload.instructorName}</h3>
                                                <p className="text-sm text-gray-500">ID: {workload.instructorId}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Số lớp giảng dạy:</span>
                                                <span className="font-semibold">{workload.totalClasses}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Tổng sinh viên:</span>
                                                <span className="font-semibold">{workload.totalStudents}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Tổng tín chỉ:</span>
                                                <span className="font-semibold">{workload.totalCredits}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Danh sách lớp:</h4>
                                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                                {workload.classes.map((cls) => (
                                                    <div key={cls.id} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                                        {cls.classCode} - {cls.subject}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Assignments Tab */}
                        {activeTab === 'assignments' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Danh sách phân công giảng dạy ({filteredAssignments.length})
                                    </h2>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Giảng viên
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Mã lớp
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Môn học
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Học kỳ
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ngày phân công
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Thao tác
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredAssignments.map((assignment) => (
                                                <tr key={assignment.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {assignment.instructorName}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {assignment.classCode}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {assignment.subject}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {assignment.semester}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {assignment.assignedAt}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button className="text-red-600 hover:text-red-900 mr-2">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {filteredAssignments.length === 0 && (
                                    <div className="px-6 py-12 text-center">
                                        <div className="text-gray-500">Không tìm thấy phân công giảng dạy nào</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Assign Tab */}
                        {activeTab === 'assign' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Phân công giảng viên cho lớp học</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chọn giảng viên
                                        </label>
                                        <select
                                            value={selectedInstructor}
                                            onChange={(e) => setSelectedInstructor(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- Chọn giảng viên --</option>
                                            {instructors.map((instructor) => (
                                                <option key={instructor.id} value={instructor.id}>
                                                    {instructor.name} ({instructor.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chọn lớp học
                                        </label>
                                        <select
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- Chọn lớp học --</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.classCode} - {cls.subject}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleAssignInstructor}
                                        disabled={!selectedInstructor || !selectedClass}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        Phân công giảng viên
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}