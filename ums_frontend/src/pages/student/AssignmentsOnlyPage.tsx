import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import apiClient from '@/api/axiosClient';
import { StudentSidebar } from '@/components/layouts/StudentSidebar';
import { StudentHeader } from '@/components/layouts/StudentHeader';
import { AIAssistantButton } from '@/components/chatbot/AIAssistantButton';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  FileText,
  Calendar,
  Filter,
  Search,
  Eye,
  Trash2
} from 'lucide-react';

interface User {
  username: string;
  name?: string;
  role: string;
}

interface ExerciseDTO {
  id: string;
  tieude: string;
  moTa: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  maLopHocPhan: string;
  trangThai: 'SAP_MO' | 'DANG_MO' | 'DA_DONG';
  dacoketqua: boolean;
  diemSo: number | null;
}

interface DangKyDTO { id: string; lopHocPhanId: string; maLopHocPhan: string }

interface PageResponse<T> { content: T[]; totalPages: number; totalElements: number }

interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  deadline: Date;
  status: 'pending' | 'submitted' | 'late';
  maxScore: number;
  score?: number;
  submittedAt?: Date;
  submittedFile?: { name: string; size: string };
}

type StatusFilter = 'all' | 'submitted' | 'pending' | 'late';

export default function AssignmentsOnlyPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !authUser) {
      navigate('/');
      return;
    }
    if (authUser.role !== 'student') {
      navigate('/');
      return;
    }
    setUser({
      username: authUser.username,
      name: authUser.fullName,
      role: authUser.role,
    });

    const loadAssignments = async () => {
      try {
        const regRes = await apiClient.get<DangKyDTO[]>('/student/dang-ky-tin-chi');
        const lopIds = regRes.data.map(r => r.lopHocPhanId);
        const all: Assignment[] = [];
        await Promise.all(lopIds.map(async (lopId) => {
          const res = await apiClient.get<PageResponse<ExerciseDTO>>(
            `/student/exercises?lopHocPhanId=${lopId}&page=0&size=100`
          );
          res.data.content.forEach(e => {
            const deadline = new Date(e.thoiGianKetThuc);
            const status: Assignment['status'] = e.dacoketqua
              ? 'submitted'
              : e.trangThai === 'DA_DONG'
              ? 'late'
              : 'pending';
            all.push({
              id: e.id,
              title: e.tieude,
              subject: e.maLopHocPhan,
              description: e.moTa,
              deadline,
              status,
              maxScore: 10,
              score: e.diemSo ?? undefined,
            });
          });
        }));
        setAssignments(all);
      } catch {
        setAssignments([]);
      }
    };
    loadAssignments();
  }, [isAuthenticated, authUser, navigate]);

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Đã nộp'
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          icon: <Clock className="w-4 h-4" />,
          label: 'Chưa nộp'
        };
      case 'late':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'Trễ hạn'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: null,
          label: 'Không xác định'
        };
    }
  };

  const getTimeRemaining = (deadline: Date): string => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff < 0) return 'Đã quá hạn';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Còn ${days} ngày ${hours} giờ`;
    if (hours > 0) return `Còn ${hours} giờ`;
    
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Còn ${minutes} phút`;
  };

  const isDeadlineNear = (deadline: Date): boolean => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const hoursRemaining = diff / (1000 * 60 * 60);
    return hoursRemaining > 0 && hoursRemaining <= 48;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || !uploadedFile) {
      alert('Vui lòng chọn file để nộp!');
      return;
    }
    if (!user) return;

    try {
      await apiClient.post('/student/exercise/submit', {
        exerciseId: selectedAssignment.id,
        fileExerciseUrl: uploadedFile.name,
      });
      setAssignments(prev => prev.map(a =>
        a.id === selectedAssignment.id
          ? { ...a, status: 'submitted', submittedAt: new Date(), submittedFile: { name: uploadedFile.name, size: `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB` } }
          : a
      ));
      alert('Nộp bài thành công!');
    } catch {
      alert('Nộp bài thất bại, vui lòng thử lại!');
    }
    setSelectedAssignment(null);
    setUploadedFile(null);
  };

  if (!user) return null;

  const userName = user.name || user.username;

  const stats = {
    total: assignments.length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    pending: assignments.filter(a => a.status === 'pending').length,
    late: assignments.filter(a => a.status === 'late').length
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      <StudentSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <StudentHeader userName={userName} />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0a2540]">Bài tập</h1>
            <p className="text-[#6a7282] mt-2">Quản lý và nộp bài tập dễ dàng</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-[#6a7282]">Tổng số</p>
                  <p className="text-2xl font-bold text-[#0a2540]">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-[#6a7282]">Đã nộp</p>
                  <p className="text-2xl font-bold text-[#0a2540]">{stats.submitted}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-[#6a7282]">Chưa nộp</p>
                  <p className="text-2xl font-bold text-[#0a2540]">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-[#6a7282]">Trễ hạn</p>
                  <p className="text-2xl font-bold text-[#0a2540]">{stats.late}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6a7282]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài tập..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2540] transition-colors"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a2540] transition-colors bg-white appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chưa nộp</option>
                <option value="submitted">Đã nộp</option>
                <option value="late">Trễ hạn</option>
              </select>
            </div>

            <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
              <p className="text-sm text-[#6a7282]">
                Tìm thấy <span className="font-semibold text-[#0a2540]">{filteredAssignments.length}</span> bài tập
              </p>
            </div>
          </div>

          {/* Assignments Table/Cards */}
          <div className="space-y-4">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => {
                const statusBadge = getStatusBadge(assignment.status);
                const timeRemaining = getTimeRemaining(assignment.deadline);
                const isNearDeadline = isDeadlineNear(assignment.deadline);

                return (
                  <div
                    key={assignment.id}
                    className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-[#0a2540]">{assignment.title}</h3>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                              {statusBadge.icon}
                              {statusBadge.label}
                            </span>
                          </div>
                          <p className="text-sm text-[#6a7282] mb-2">{assignment.subject}</p>
                          <p className="text-[#6a7282]">{assignment.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#6a7282]" />
                          <span className="text-sm text-[#6a7282]">
                            Hạn nộp: {assignment.deadline.toLocaleDateString('vi-VN')} {assignment.deadline.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isNearDeadline ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-[#6a7282]'}`}>
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-semibold">{timeRemaining}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#6a7282]">
                            Điểm tối đa: <span className="font-semibold text-[#0a2540]">{assignment.maxScore}</span>
                          </span>
                        </div>
                      </div>

                      {/* Submitted Info */}
                      {assignment.status === 'submitted' && assignment.submittedFile && (
                        <div className="bg-[#f9fafb] rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <FileText className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#0a2540]">{assignment.submittedFile.name}</p>
                                <p className="text-xs text-[#6a7282]">
                                  Nộp lúc: {assignment.submittedAt?.toLocaleDateString('vi-VN')} {assignment.submittedAt?.toLocaleTimeString('vi-VN')} • {assignment.submittedFile.size}
                                </p>
                              </div>
                            </div>
                            {assignment.score !== undefined && (
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">{assignment.score.toFixed(1)}</p>
                                <p className="text-xs text-[#6a7282]">/{assignment.maxScore} điểm</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        {assignment.status === 'pending' && (
                          <button
                            onClick={() => setSelectedAssignment(assignment)}
                            className="flex items-center gap-2 px-6 py-3 bg-[#0a2540] text-white rounded-lg hover:bg-[#0d2f52] transition-colors font-medium"
                          >
                            <Upload className="w-4 h-4" />
                            Nộp bài
                          </button>
                        )}

                        {assignment.status === 'submitted' && new Date() <= assignment.deadline && (
                          <button
                            onClick={() => setSelectedAssignment(assignment)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            <Upload className="w-4 h-4" />
                            Nộp lại
                          </button>
                        )}

                        {assignment.status === 'late' && (
                          <button
                            onClick={() => setSelectedAssignment(assignment)}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            <Upload className="w-4 h-4" />
                            Nộp bài (Trễ hạn)
                          </button>
                        )}

                        <button className="flex items-center gap-2 px-6 py-3 bg-[#f1f5f9] text-[#0a2540] rounded-lg hover:bg-[#e5e7eb] transition-colors font-medium">
                          <Eye className="w-4 h-4" />
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-12 text-center">
                <FileText className="w-16 h-16 text-[#9ca3af] mx-auto mb-4" />
                <p className="text-[#6a7282] mb-4">Không tìm thấy bài tập nào</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-sm text-[#0a2540] hover:underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <AIAssistantButton />

      {/* Submit Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[14px] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#e5e7eb] flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#0a2540] mb-2">Nộp bài tập</h2>
                <p className="text-[#6a7282]">{selectedAssignment.title}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setUploadedFile(null);
                }}
                className="p-2 text-[#6a7282] hover:text-[#0a2540] hover:bg-[#f1f5f9] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-[#f9fafb] rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#6a7282]">Môn học</p>
                    <p className="font-medium text-[#0a2540]">{selectedAssignment.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6a7282]">Hạn nộp</p>
                    <p className="font-medium text-[#0a2540]">
                      {selectedAssignment.deadline.toLocaleDateString('vi-VN')} {selectedAssignment.deadline.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6a7282]">Điểm tối đa</p>
                    <p className="font-medium text-[#0a2540]">{selectedAssignment.maxScore} điểm</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6a7282]">Thời gian còn lại</p>
                    <p className="font-medium text-[#0a2540]">{getTimeRemaining(selectedAssignment.deadline)}</p>
                  </div>
                </div>
              </div>

              {selectedAssignment.submittedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">Bài đã nộp:</p>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">{selectedAssignment.submittedFile.name}</p>
                      <p className="text-xs text-blue-700">{selectedAssignment.submittedFile.size}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#0a2540] mb-3">
                  Chọn file nộp bài
                </label>
                
                {uploadedFile ? (
                  <div className="border-2 border-[#e5e7eb] rounded-lg p-4 bg-[#f9fafb]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-[#0a2540]">{uploadedFile.name}</p>
                          <p className="text-sm text-[#6a7282]">
                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-[#e5e7eb] rounded-lg p-8 text-center cursor-pointer hover:border-[#0a2540] hover:bg-[#f9fafb] transition-colors">
                    <Upload className="w-12 h-12 text-[#6a7282] mx-auto mb-3" />
                    <p className="text-[#0a2540] font-medium mb-1">Chọn file để tải lên</p>
                    <p className="text-sm text-[#6a7282]">PDF, DOC, DOCX, ZIP (Tối đa 50MB)</p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.zip,.rar"
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {new Date() > selectedAssignment.deadline && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Cảnh báo: Nộp trễ hạn</p>
                    <p className="text-sm text-red-700">Bài nộp có thể bị trừ điểm.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#e5e7eb] flex gap-3">
              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setUploadedFile(null);
                }}
                className="flex-1 px-4 py-3 bg-[#f1f5f9] text-[#0a2540] rounded-lg hover:bg-[#e5e7eb] transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={!uploadedFile}
                className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
                  uploadedFile
                    ? 'bg-[#0a2540] text-white hover:bg-[#0d2f52]'
                    : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                }`}
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
