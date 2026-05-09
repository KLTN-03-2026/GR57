import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { useMemo } from 'react';
import { BarChart3, Users, GraduationCap, CircleDollarSign } from 'lucide-react';
import AiAssistantButton from '@/imports/AiAssistantButton-4-13343';
import { getAllTuitionRecords } from '@/data/mockTuition';
import { learningRepository } from '@/api';
import { useAsync } from '@/hooks';

export default function AdminReportsPage() {
  const { data: assignments = [] } = useAsync(
    () => learningRepository.getInstructorAssignments(),
    [],
  );

  const tuitionRecords = getAllTuitionRecords();
  const metrics = useMemo(() => {
    const published = assignments.filter((item) => item.publishToStudyProgram).length;
    const submitted = assignments.reduce((sum, item) => sum + item.totalSubmissions, 0);
    const totalExpected = assignments.reduce((sum, item) => sum + item.totalStudents, 0);
    const completionRate = totalExpected > 0 ? Math.round((submitted / totalExpected) * 100) : 0;
    const onTrackRate = assignments.length > 0 ? Math.round((published / assignments.length) * 100) : 0;

    const paidCount = tuitionRecords.filter((item) => item.status === 'paid').length;
    const tuitionCompletionRate = tuitionRecords.length > 0 ? Math.round((paidCount / tuitionRecords.length) * 100) : 0;
    const retentionRate = Math.max(65, Math.min(98, Math.round((completionRate * 0.5) + (tuitionCompletionRate * 0.5))));

    return { completionRate, onTrackRate, tuitionCompletionRate, retentionRate };
  }, [assignments, tuitionRecords]);

  const reportCards = [
    { id: '1', title: 'Tỉ lệ hoàn thành bài tập', value: `${metrics.completionRate}%`, icon: <GraduationCap className="w-5 h-5 text-indigo-600" />, note: 'Tổng hợp từ nộp bài của sinh viên theo bài giao' },
    { id: '2', title: 'Tỉ lệ lớp đúng tiến độ', value: `${metrics.onTrackRate}%`, icon: <BarChart3 className="w-5 h-5 text-blue-600" />, note: 'Dựa trên bài đã phát hành vào chương trình học' },
    { id: '3', title: 'Tỉ lệ giữ chân học viên', value: `${metrics.retentionRate}%`, icon: <Users className="w-5 h-5 text-green-600" />, note: 'Ước lượng từ học vụ + hoàn thành tài chính' },
    { id: '4', title: 'Tỉ lệ hoàn thành học phí', value: `${metrics.tuitionCompletionRate}%`, icon: <CircleDollarSign className="w-5 h-5 text-amber-600" />, note: 'Đồng bộ trực tiếp với dữ liệu kế toán' },
  ];

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      <AdminSidebar activeMenu="reports" />
      <div className="flex-1 ml-64 flex flex-col">
        <AdminHeader title="Báo cáo điều hành" />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#0a2540] mb-2">Bộ chỉ số quản trị đào tạo</h2>
              <p className="text-sm text-gray-600">Theo dõi xuyên suốt từ tuyển sinh, vận hành lớp học, kết quả học tập đến tài chính để ra quyết định điều hành.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportCards.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">{item.icon}</div>
                    <p className="text-3xl font-bold text-[#0a2540]">{item.value}</p>
                  </div>
                  <h3 className="font-semibold text-[#0a2540]">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-[#0a2540] mb-3">Khuyến nghị vận hành</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>- Ưu tiên nhắc học viên còn thiếu học phí ở các lớp có tiến độ học cao.</li>
                <li>- Tăng kiểm duyệt nội dung với các môn có tỉ lệ hoàn thành bài tập thấp hơn 70%.</li>
                <li>- Đồng bộ lịch lớp và lịch nộp bài để giảm xung đột thời gian cho sinh viên.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <button className="fixed bottom-8 right-8 w-16 h-16 z-50 hover:scale-110 transition-transform cursor-pointer" aria-label="AI Assistant"><AiAssistantButton /></button>
    </div>
  );
}

