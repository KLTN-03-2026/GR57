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
import com.university.service.auth.CustomUserDetailsService;
import jakarta.transaction.Transactional;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class UsersAdminService implements CustomUserDetailsService {

    private final UsersAdminRepository usersRepository;
    private final UsersAdminMapper usersMapper;
    private final PasswordEncoder passwordEncoder;
    private final Set<String> userNameInDb;

    public UsersAdminService(UsersAdminRepository usersRepository, UsersAdminMapper usersMapper,
            PasswordEncoder passwordEncoder, Set<String> userNameInDb) {
        this.usersRepository = usersRepository;
        this.usersMapper = usersMapper;
        this.passwordEncoder = passwordEncoder;
        this.userNameInDb = userNameInDb;
    }

    public ExcelImportResult importFromExcel(MultipartFile file) throws java.io.IOException {
        UsersExcelListener listener = new UsersExcelListener(usersRepository);

        EasyExcel.read(file.getInputStream(), UsersAdminRequestDTO.class, listener)
                .sheet("Users")
                .headRowNumber(1)
                .doRead();

        return listener.getResult();
    }

    public UsersAdminResponseDTO create(UsersAdminRequestDTO dto) {
        Users users = new Users();
        users.setPassWord(passwordEncoder.encode(dto.getPassWord()));
        userNameInDb.addAll(usersRepository.findAllUserNames());
        if (userNameInDb.contains(dto.getUserName())) {
            throw new SimpleMessageException("UserName đã tồn tại");
        }
        return usersMapper.toResponseDTO(usersRepository.save(usersMapper.toEntity(dto, users)));
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

    public Users getByUserName(String userName) {
        Users users = usersRepository.findByUserName(userName);
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

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Users user = usersRepository.findByUserName(username); // reuse method của bạn

        // Xác định Role từ database (hiện tại bạn có mrole = "ADMIN")
        // String role = user.getDUserRoles() != null ? user.getDUserRoles().toString()
        // : "USERS"; // fallbac
        String role = "ADMIN";
        // Nếu bạn muốn hỗ trợ nhiều role sau này thì dùng List
        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword()) // phải là password đã bcrypt
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!Boolean.TRUE.equals(user.isTrangThai())) // nếu có trường trangThai
                .build();
    }
}