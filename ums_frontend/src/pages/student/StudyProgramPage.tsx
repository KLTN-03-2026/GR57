import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import { apiClient } from '@/api/axiosClient';
import { StudentSidebar } from '@/components/layouts/StudentSidebar';
import { StudentHeader } from '@/components/layouts/StudentHeader';
import { AIAssistantButton } from '@/components/chatbot/AIAssistantButton';
import { BookOpen, Search, ChevronLeft, ChevronRight, AlertCircle, Layers } from 'lucide-react';

interface ChuongTrinhDaoTaoItem {
  id: string;
  maNganh: string;
  tenNganh: string;
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  moTa: string | null;
}

interface PageResponse {
  content: ChuongTrinhDaoTaoItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const PAGE_SIZE = 10;

export default function StudyProgramPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();

  const [data, setData] = useState<PageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !authUser) { navigate('/'); return; }
    if (authUser.role !== 'student') { navigate('/'); return; }
  }, [isAuthenticated, authUser, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !authUser || authUser.role !== 'student') return;
    fetchData(keyword, page);
  }, [page]);

  const fetchData = async (kw: string, pg: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<PageResponse>(
        `/student/chuong-trinh-dao-tao/search?page=${pg}&size=${PAGE_SIZE}`,
        { keyword: kw.trim() || undefined }
      );
      setData(res.data);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (err?.response?.status === 409) {
        setError('Tài khoản chưa được gán ngành học. Vui lòng liên hệ phòng đào tạo.');
      } else {
        setError(detail || 'Không thể tải chương trình đào tạo. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(0);
      fetchData(value, 0);
    }, 400);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const nganhLabel = data?.content?.[0]
    ? `${data.content[0].maNganh} — ${data.content[0].tenNganh}`
    : null;

  const totalCredits = data?.content?.reduce((sum, item) => sum + (item.soTinChi ?? 0), 0) ?? 0;

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      <StudentSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <StudentHeader userName={authUser?.fullName ?? ''} />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0a2540]">Chương trình đào tạo</h1>
            <p className="text-[#6a7282] mt-2">Danh sách môn học theo ngành của bạn</p>
          </div>

          {/* Thông tin ngành + thống kê */}
          {data && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2 bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-5 flex items-center gap-4">
                <div className="p-3 bg-[#e0ecff] rounded-xl">
                  <Layers className="w-6 h-6 text-[#0a2540]" />
                </div>
                <div>
                  <p className="text-xs text-[#6a7282] uppercase tracking-wide mb-1">Ngành học</p>
                  <p className="text-lg font-bold text-[#0a2540]">{nganhLabel ?? '—'}</p>
                </div>
              </div>

              <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-5 flex items-center gap-4">
                <div className="p-3 bg-[#e0ecff] rounded-xl">
                  <BookOpen className="w-6 h-6 text-[#0a2540]" />
                </div>
                <div>
                  <p className="text-xs text-[#6a7282] uppercase tracking-wide mb-1">Tổng số môn</p>
                  <p className="text-lg font-bold text-[#0a2540]">{data.totalElements} môn</p>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a7282]" />
              <input
                type="text"
                value={keyword}
                onChange={e => handleKeywordChange(e.target.value)}
                placeholder="Tìm theo mã hoặc tên môn học..."
                className="w-full pl-9 pr-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540]"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[14px] p-6 flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && !error && (
            <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4 px-6 py-4 border-b border-[#f1f5f9] animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-40" />
                </div>
              ))}
            </div>
          )}

          {/* Bảng dữ liệu */}
          {!isLoading && !error && data && (
            <>
              {data.content.length === 0 ? (
                <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-12 text-center text-[#6a7282]">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Không tìm thấy môn học phù hợp</p>
                </div>
              ) : (
                <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#f8fafc] border-b border-[#e5e7eb]">
                        <th className="text-left px-6 py-3 font-semibold text-[#0a2540] w-32">Mã MH</th>
                        <th className="text-left px-6 py-3 font-semibold text-[#0a2540]">Tên môn học</th>
                        <th className="text-center px-6 py-3 font-semibold text-[#0a2540] w-28">Số tín chỉ</th>
                        <th className="text-left px-6 py-3 font-semibold text-[#0a2540]">Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.content.map((item, idx) => (
                        <tr
                          key={item.id}
                          className={`border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'
                          }`}
                        >
                          <td className="px-6 py-4 font-mono font-semibold text-[#0a2540]">
                            {item.maMonHoc}
                          </td>
                          <td className="px-6 py-4 text-[#1e293b] font-medium">
                            {item.tenMonHoc}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center bg-[#e0ecff] text-[#0a2540] font-bold rounded-full w-8 h-8 text-sm">
                              {item.soTinChi}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#6a7282]">
                            {item.moTa ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {data.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e7eb]">
                      <p className="text-sm text-[#6a7282]">
                        Trang {data.number + 1} / {data.totalPages} &nbsp;·&nbsp; {data.totalElements} môn học
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 0}
                          className="p-2 rounded-lg border border-[#e5e7eb] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        {[...Array(data.totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                              i === page
                                ? 'bg-[#0a2540] text-white'
                                : 'border border-[#e5e7eb] hover:bg-[#f1f5f9] text-[#334155]'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page >= data.totalPages - 1}
                          className="p-2 rounded-lg border border-[#e5e7eb] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <AIAssistantButton />
    </div>
  );
}
