import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks';
import { apiClient } from '@/api/axiosClient';
import { StudentSidebar } from '@/components/layouts/StudentSidebar';
import { StudentHeader } from '@/components/layouts/StudentHeader';
import { AIAssistantButton } from '@/components/chatbot/AIAssistantButton';
import {
  FileText, Video, Search, Download, AlertCircle,
  ChevronLeft, ChevronRight, File, Calendar, BookOpen,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

type LoaiTaiLieu = 'PDF' | 'VIDEO' | 'SLIDE';

interface LopHocPhan {
  id: string;          // dangKyTinChi.id
  lopHocPhanId: string;
  maLopHocPhan: string;
  maMonHoc: string;
  soTinChi: number;
}

interface TaiLieuItem {
  id: string;
  tenTaiLieu: string;
  moTa: string | null;
  fileTaiLieuUrl: string;
  loaiTaiLieu: LoaiTaiLieu;
  ngayDang: string;
  lopHocPhanId: string;
}

interface PageResponse {
  content: TaiLieuItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const LOAI_CONFIG: Record<LoaiTaiLieu, { label: string; className: string; icon: React.ReactNode }> = {
  PDF:   { label: 'PDF',   className: 'bg-red-100 text-red-700',       icon: <FileText className="w-3.5 h-3.5" /> },
  VIDEO: { label: 'Video', className: 'bg-purple-100 text-purple-700', icon: <Video className="w-3.5 h-3.5" /> },
  SLIDE: { label: 'Slide', className: 'bg-orange-100 text-orange-700', icon: <File className="w-3.5 h-3.5" /> },
};

const formatDate = (s: string) =>
  s ? new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

// ── Component ────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();

  // danh sách lớp đã đăng ký
  const [danhSachLop, setDanhSachLop] = useState<LopHocPhan[]>([]);
  const [loadingLop, setLoadingLop] = useState(true);
  const [errorLop, setErrorLop] = useState<string | null>(null);

  // lớp học phần đang chọn
  const [selectedLopId, setSelectedLopId] = useState<string>('');

  // tài liệu
  const [data, setData] = useState<PageResponse | null>(null);
  const [loadingTaiLieu, setLoadingTaiLieu] = useState(false);
  const [errorTaiLieu, setErrorTaiLieu] = useState<string | null>(null);

  // filter & pagination
  const [keyword, setKeyword] = useState('');
  const [loaiFilter, setLoaiFilter] = useState<LoaiTaiLieu | ''>('');
  const [page, setPage] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !authUser) { navigate('/'); return; }
    if (authUser.role !== 'student') { navigate('/'); return; }
  }, [isAuthenticated, authUser, navigate]);

  // ── Fetch danh sách lớp học phần ──────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !authUser || authUser.role !== 'student') return;
    fetchDanhSachLop();
  }, [isAuthenticated, authUser]);

  const fetchDanhSachLop = async () => {
    setLoadingLop(true);
    setErrorLop(null);
    try {
      const res = await apiClient.get<LopHocPhan[]>('/student/dang-ky-tin-chi');
      const list = res.data ?? [];
      setDanhSachLop(list);
      if (list.length > 0) {
        setSelectedLopId(list[0].lopHocPhanId);
      }
    } catch {
      setErrorLop('Không thể tải danh sách lớp học phần.');
    } finally {
      setLoadingLop(false);
    }
  };

  // ── Fetch tài liệu khi lớp / trang thay đổi ───────────────────────────────
  useEffect(() => {
    if (!selectedLopId) return;
    fetchTaiLieu(keyword, loaiFilter, page);
  }, [selectedLopId, page]);

  const fetchTaiLieu = async (kw: string, loai: LoaiTaiLieu | '', pg: number) => {
    if (!selectedLopId) return;
    setLoadingTaiLieu(true);
    setErrorTaiLieu(null);
    try {
      const params = new URLSearchParams({
        lopHocPhanId: selectedLopId,
        page: String(pg),
        size: String(PAGE_SIZE),
      });
      if (kw.trim()) params.append('keyword', kw.trim());
      if (loai)      params.append('loaiTaiLieu', loai);

      const res = await apiClient.get<PageResponse>(`/student/tailieu/search?${params}`);
      setData(res.data);
    } catch (err: any) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 403)
        setErrorTaiLieu('Bạn không có quyền truy cập tài liệu của lớp học phần này.');
      else
        setErrorTaiLieu(detail || 'Không thể tải tài liệu. Vui lòng thử lại.');
    } finally {
      setLoadingTaiLieu(false);
    }
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLopChange = (lopHocPhanId: string) => {
    setSelectedLopId(lopHocPhanId);
    setKeyword('');
    setLoaiFilter('');
    setPage(0);
    setData(null);
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(0);
      fetchTaiLieu(value, loaiFilter, 0);
    }, 400);
  };

  const handleLoaiChange = (value: LoaiTaiLieu | '') => {
    setLoaiFilter(value);
    setPage(0);
    fetchTaiLieu(keyword, value, 0);
  };

  const handleDownload = (item: TaiLieuItem) => {
    window.open(item.fileTaiLieuUrl, '_blank', 'noopener,noreferrer');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      <StudentSidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <StudentHeader userName={authUser?.fullName ?? ''} />

        <main className="flex-1 overflow-y-auto p-8">

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0a2540]">Tài liệu học tập</h1>
            <p className="text-[#6a7282] mt-2">Xem tài liệu theo từng lớp học phần đã đăng ký</p>
          </div>

          {/* ── Chọn lớp học phần ── */}
          <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-5 mb-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#0a2540] mb-3">
              <BookOpen className="w-4 h-4" />
              Lớp học phần
            </label>

            {loadingLop ? (
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-full" />
            ) : errorLop ? (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errorLop}
              </div>
            ) : danhSachLop.length === 0 ? (
              <p className="text-sm text-[#6a7282]">Bạn chưa đăng ký lớp học phần nào.</p>
            ) : (
              <select
                value={selectedLopId}
                onChange={e => handleLopChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540] bg-white"
              >
                {danhSachLop.map(lop => (
                  <option key={lop.lopHocPhanId} value={lop.lopHocPhanId}>
                    {lop.maLopHocPhan} — {lop.maMonHoc} ({lop.soTinChi} TC)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* ── Search + Filter ── */}
          {selectedLopId && (
            <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-4 mb-4 flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a7282]" />
                <input
                  type="text"
                  value={keyword}
                  onChange={e => handleKeywordChange(e.target.value)}
                  placeholder="Tìm theo tên tài liệu..."
                  className="w-full pl-9 pr-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540]"
                />
              </div>
              <select
                value={loaiFilter}
                onChange={e => handleLoaiChange(e.target.value as LoaiTaiLieu | '')}
                className="px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2540] bg-white min-w-[160px]"
              >
                <option value="">Tất cả loại</option>
                <option value="PDF">PDF</option>
                <option value="VIDEO">Video</option>
                <option value="SLIDE">Slide</option>
              </select>
            </div>
          )}

          {/* ── Error tài liệu ── */}
          {errorTaiLieu && (
            <div className="bg-red-50 border border-red-200 rounded-[14px] p-5 flex items-center gap-3 text-red-700 mb-4">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{errorTaiLieu}</p>
            </div>
          )}

          {/* ── Loading skeleton ── */}
          {loadingTaiLieu && !errorTaiLieu && (
            <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 px-6 py-4 border-b border-[#f1f5f9] animate-pulse">
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          )}

          {/* ── Bảng tài liệu ── */}
          {!loadingTaiLieu && !errorTaiLieu && data && (
            data.content.length === 0 ? (
              <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm p-12 text-center text-[#6a7282]">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Lớp học phần này chưa có tài liệu</p>
              </div>
            ) : (
              <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#e5e7eb]">
                      <th className="text-left px-6 py-3 font-semibold text-[#0a2540]">Tên tài liệu</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#0a2540] w-28">Loại</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#0a2540]">Mô tả</th>
                      <th className="text-left px-6 py-3 font-semibold text-[#0a2540] w-36">Ngày đăng</th>
                      <th className="text-center px-6 py-3 font-semibold text-[#0a2540] w-32">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.content.map((item, idx) => {
                      const loai = LOAI_CONFIG[item.loaiTaiLieu] ?? LOAI_CONFIG.PDF;
                      return (
                        <tr
                          key={item.id}
                          className={`border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'
                          }`}
                        >
                          <td className="px-6 py-4 font-medium text-[#0a2540]">{item.tenTaiLieu}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${loai.className}`}>
                              {loai.icon}{loai.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#6a7282]">{item.moTa ?? '—'}</td>
                          <td className="px-6 py-4 text-[#6a7282]">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(item.ngayDang)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDownload(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a2540] text-white text-xs font-medium rounded-lg hover:bg-[#0d2f52] transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Tải xuống
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e7eb]">
                    <p className="text-sm text-[#6a7282]">
                      Trang {data.number + 1} / {data.totalPages}&nbsp;·&nbsp;{data.totalElements} tài liệu
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 0}
                        className="p-2 rounded-lg border border-[#e5e7eb] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {[...Array(data.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i)}
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
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= data.totalPages - 1}
                        className="p-2 rounded-lg border border-[#e5e7eb] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}

        </main>
      </div>

      <AIAssistantButton />
    </div>
  );
}
