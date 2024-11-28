    package com.store.furniture.entity;

    import jakarta.persistence.*;
    import java.time.Instant;
    import lombok.*;
    import lombok.experimental.FieldDefaults;
    import org.hibernate.annotations.CreationTimestamp;
    import org.hibernate.annotations.SQLDelete;
    import org.hibernate.annotations.UpdateTimestamp;
    import org.hibernate.annotations.Where;

    @Entity
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @SQLDelete(sql = "UPDATE product SET deleted = true WHERE id = ?")
    @Where(clause = "deleted = false")
    public class Product {
        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        String id;

        String name;
        String description;
        double price;
        String image;

        @ManyToOne
        @JoinColumn(name = "category_id")
        Category category;

        @CreationTimestamp
        Instant createdAt;

        @UpdateTimestamp
        Instant updatedAt;
        boolean deleted = false;
    }
