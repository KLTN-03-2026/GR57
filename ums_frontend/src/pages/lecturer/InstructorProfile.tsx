import { InstructorSidebar } from '@/components/layouts/InstructorSidebar';
import { InstructorHeader } from '@/components/layouts/InstructorHeader';
import {
  User, Mail, Phone, Calendar as CalendarIcon, Edit, Save, X,
  CheckCircle, ChevronLeft, ChevronRight, Clock, DoorOpen
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks';
import AiAssistantButton from '@/imports/AiAssistantButton';
import lecturerApi, { LecturerProfileResponseDTO, LecturerScheduleDTO } from '@/api/lecturer.api';

export default function InstructorProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'schedule'>('info');
  const [profile, setProfile] = useState<LecturerProfileResponseDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [schedule, setSchedule] = useState<LecturerScheduleDTO[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0);

  const getWeekRange = (offset: number) => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + offset * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { monday, sunday };
  };

  useEffect(() => {
    if (!user?.id) return;
    lecturerApi.getProfile(user.id).then(p => {
      setProfile(p);
      setEditEmail(p.email);
      setEditPhone(p.soDienThoai);
    }).catch(console.error);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const { monday, sunday } = getWeekRange(currentWeek);
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    lecturerApi.getSchedule(user.id, fmt(monday), fmt(sunday))
      .then(setSchedule)
      .catch(console.error);
  }, [user?.id, currentWeek]);

  const handleSave = async () => {
    if (!user?.id || !profile) return;
    setSaving(true);
    try {
      const updated = await lecturerApi.updateProfile(user.id, {
        email: editEmail,
        soDienThoai: editPhone,
      });
      setProfile(updated);
      setIsEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditEmail(profile.email);
      setEditPhone(profile.soDienThoai);
    }
    setIsEditing(false);
  };

  const getInitials = (name: string) => name.split(' ').pop()?.charAt(0).toUpperCase() ?? '?';

  const getWeekDates = (offset: number) => {
    const { monday } = getWeekRange(offset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(currentWeek);
  const dayNames = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
  const { monday, sunday } = getWeekRange(currentWeek);

  const getEventsForDay = (date: Date) =>
    schedule.filter(e => new Date(e.ngayHoc).toDateString() === date.toDateString());

  const formatDate = (d: Date) =>
    d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

  if (!profile) {
    return (
      <div className="flex h-screen bg-gray-50">
        <InstructorSidebar />
        <div className="flex-1 ml-64 flex items-center justify-center text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <InstructorSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <InstructorHeader title="Hồ sơ cá nhân" />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hồ sơ giảng viên</h2>
              <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và lịch giảng dạy</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex gap-2">
              {[
                { key: 'info', label: 'Thông tin cá nhân', Icon: User },
                { key: 'schedule', label: 'Lịch dạy cá nhân', Icon: CalendarIcon },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as 'info' | 'schedule')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === key ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'info' ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600">
                  <h3 className="font-semibold text-white text-lg">Thông tin cá nhân</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      <Edit className="w-4 h-4" />Chỉnh sửa
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
                      >
                        <X className="w-4 h-4" />Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  {/* Avatar */}
                  <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                    <div className="relative">
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt="Avatar"
                          className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-blue-100">
                          <span className="text-white text-4xl font-bold">{getInitials(profile.hoTen)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{profile.hoTen}</h3>
                      <p className="text-blue-600 mt-1">{profile.email}</p>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4" />Họ và tên
                      </label>
                      <input
                        type="text"
                        value={profile.hoTen}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4" />Email
                      </label>
                      <input
                        type="email"
                        value={isEditing ? editEmail : profile.email}
                        onChange={e => setEditEmail(e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg transition-all ${
                          isEditing
                            ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            : 'bg-gray-50 border-gray-300 text-gray-700 cursor-not-allowed'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4" />Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={isEditing ? editPhone : profile.soDienThoai}
                        onChange={e => setEditPhone(e.target.value)}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg transition-all ${
                          isEditing
                            ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            : 'bg-gray-50 border-gray-300 text-gray-700 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Week navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentWeek(w => w - 1)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900">
                        {currentWeek === 0 ? 'Tuần hiện tại' : currentWeek > 0 ? `${currentWeek} tuần sau` : `${Math.abs(currentWeek)} tuần trước`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(monday)} – {formatDate(sunday)}
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentWeek(w => w + 1)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={() => setCurrentWeek(0)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Hôm nay
                  </button>
                </div>

                {/* Weekly calendar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-8 border-b border-gray-200">
                    <div className="p-4 bg-gray-50 font-semibold text-gray-600 text-sm">Giờ</div>
                    {weekDates.map((date, i) => (
                      <div
                        key={i}
                        className={`p-4 text-center border-l border-gray-200 ${
                          date.toDateString() === new Date().toDateString() ? 'bg-blue-50' : 'bg-gray-50'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 text-sm">{dayNames[date.getDay()]}</div>
                        <div className={`text-sm mt-1 ${
                          date.toDateString() === new Date().toDateString()
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-600'
                        }`}>
                          {formatDate(date)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="divide-y divide-gray-200">
                    {['07', '09', '11', '13', '15', '17'].map(hour => (
                      <div key={hour} className="grid grid-cols-8">
                        <div className="p-4 bg-gray-50 text-sm font-medium text-gray-600 border-r border-gray-200">
                          {hour}:00
                        </div>
                        {weekDates.map((date, di) => {
                          const dayEvents = getEventsForDay(date).filter(e =>
                            e.gioBatDau.startsWith(hour)
                          );
                          return (
                            <div key={di} className="p-2 border-l border-gray-200 min-h-[80px]">
                              {dayEvents.map(e => (
                                <div
                                  key={e.lichId}
                                  className="w-full p-2 rounded-lg text-xs bg-blue-100 text-blue-900 border-l-4 border-blue-600 mb-1"
                                >
                                  <div className="font-semibold">{e.maLopHocPhan}</div>
                                  <div className="truncate">{e.tenMonHoc}</div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Clock className="w-3 h-3" />
                                    {e.gioBatDau} – {e.gioKetThuc}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DoorOpen className="w-3 h-3" />
                                    {e.phong} – {e.toaNha}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-24 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Cập nhật thông tin thành công!</span>
        </div>
      )}

      <button
        className="fixed bottom-8 right-8 w-16 h-16 hover:scale-110 transition-transform duration-200 z-40"
        aria-label="AI Assistant"
      >
        <AiAssistantButton />
      </button>
    </div>
  );
}
