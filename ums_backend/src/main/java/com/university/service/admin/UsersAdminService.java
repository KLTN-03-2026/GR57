package com.university.service.admin;

import com.alibaba.excel.EasyExcel;
import com.university.dto.request.admin.UsersAdminRequestDTO;
import com.university.dto.response.admin.ExcelImportResult;
import com.university.dto.response.admin.UsersAdminResponseDTO;
import com.university.entity.Users;
import com.university.exception.SimpleMessageException;
import com.university.mapper.admin.UsersAdminMapper;
import com.university.repository.admin.UsersAdminRepository;
import com.university.service.admin.excel.UsersExcelListener;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsersAdminService {

    @Autowired
    private final UsersAdminRepository usersRepository;

    private final UsersAdminMapper usersMapper;

    private final Set<String> userNameInDb;

    public ExcelImportResult importFromExcel(MultipartFile file) throws java.io.IOException {
        UsersExcelListener listener = new UsersExcelListener(usersRepository);

        EasyExcel.read(file.getInputStream(), UsersAdminRequestDTO.class, listener)
                .sheet("Users")
                .headRowNumber(1)
                .doRead();

        return listener.getResult();
    }

    public UsersAdminResponseDTO create(UsersAdminRequestDTO dto) {
        userNameInDb.addAll(usersRepository.findAllUserNames());
        if (userNameInDb.contains(dto.getUserName())) {
            throw new SimpleMessageException("UserName đã tồn tại");
        }
        return usersMapper.toResponseDTO(usersRepository.save(usersMapper.toEntity(dto)));
    }

    public List<UsersAdminResponseDTO> getAll() {
        return usersRepository.findAll().stream()
                .map(usersMapper::toResponseDTO)
                .toList();
    }

    public UsersAdminResponseDTO getById(UUID id) {
        UsersAdminResponseDTO users = usersRepository.findById(id)
                .map(usersMapper::toResponseDTO)
                .orElseThrow(() -> new SimpleMessageException("Users không tồn tại"));
        return users;
    }

    public Optional<Users> getByUserName(String userName) {
        Optional<Users> users = usersRepository.findByUserName(userName);
        return users;
    }

    public UsersAdminResponseDTO update(UUID id, UsersAdminRequestDTO dto) {
        Users users = usersRepository.findById(id)
                .orElseThrow(() -> new SimpleMessageException("Users không tồn tại"));
        usersMapper.updateEntity(users, dto);
        usersRepository.save(users);
        return usersMapper.toResponseDTO(users);
    }

    public void delete(UUID id) {
        if (!usersRepository.existsById(id)) {
            throw new SimpleMessageException("Users không tồn tại");
        }
        usersRepository.deleteById(id);
    }

    @Transactional
    public void deleteMultiple(List<UUID> ids) {
        usersRepository.deleteAllByIdInBatch(ids);
    }

    public void deleteAll() {
        usersRepository.deleteAll();
    }
}