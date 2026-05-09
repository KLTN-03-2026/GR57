package com.university.mapper.lecturer;

import com.university.dto.response.lecturer.AttendanceStudentResponseDTO;
import com.university.dto.response.lecturer.GradeStudentResponseDTO;
import com.university.dto.response.lecturer.LecturerClassStudentResponseDTO;
import com.university.dto.response.lecturer.LecturerProfileResponseDTO;
import com.university.dto.response.lecturer.LecturerScheduleDTO;
import com.university.entity.DiemDanh;
import com.university.entity.HocVien;
import com.university.entity.Lich;
import com.university.entity.Users;
import com.university.entity.FileStorage;
import com.university.enums.FileEnum;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class LecturerMapper {

    public LecturerProfileResponseDTO toProfileResponse(Users user, List<LecturerScheduleDTO> schedule) {
        return new LecturerProfileResponseDTO(
                user.getId(),
                user.getHoTen(),
                user.getEmail(),
                user.getSoDienThoai(),
                extractAvatarUrl(user),
                schedule
        );
    }

    public LecturerScheduleDTO toScheduleDTO(Lich lich) {
        return new LecturerScheduleDTO(
                lich.getId(),
                lich.getLopHocPhan().getId(),
                lich.getLopHocPhan().getMaLopHocPhan(),
                lich.getLopHocPhan().getMonHoc().getTenMonHoc(),
                lich.getNgayHoc(),
                lich.getGioHoc().getThoiGianBatDau().toString(),
                lich.getGioHoc().getThoiGianKetThuc().toString(),
                lich.getPhong().getTenPhong(),
                lich.getPhong().getToaNha()
        );
    }

    public LecturerClassStudentResponseDTO toStudentDTO(HocVien hocVien) {
        return new LecturerClassStudentResponseDTO(
                hocVien.getId(),
                hocVien.getUsers().getHoTen(),
                hocVien.getMaHocVien(),
                extractAvatarUrl(hocVien.getUsers())
        );
    }

    public AttendanceStudentResponseDTO toAttendanceStudentDTO(HocVien hocVien, Boolean trangThai) {
        return new AttendanceStudentResponseDTO(
                hocVien.getId(),
                hocVien.getUsers().getHoTen(),
                hocVien.getMaHocVien(),
                trangThai
        );
    }

    public GradeStudentResponseDTO toGradeStudentDTO(HocVien hocVien, Float average) {
        return new GradeStudentResponseDTO(
                hocVien.getId(),
                hocVien.getUsers().getHoTen(),
                hocVien.getMaHocVien(),
                average
        );
    }

    public String extractAvatarUrl(Users user) {
        if (user == null || user.getDFileStorages() == null) {
            return null;
        }
        Optional<FileStorage> avatar = user.getDFileStorages().stream()
                .filter(fs -> fs.getFileType() == FileEnum.AVATAR)
                .min(Comparator.comparing(FileStorage::getCreatedAt));
        return avatar.map(FileStorage::getFileUrl).orElse(null);
    }
}
