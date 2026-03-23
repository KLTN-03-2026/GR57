package com.university.entity;

import java.util.UUID;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tai_lieu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaiLieu {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String tenTaiLieu;

    @Column(nullable = false)
    private String fileTaiLieuUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lop_hoc_phan_id", nullable = false)
    private LopHocPhan lopHocPhan;
}
