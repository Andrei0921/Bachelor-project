package com.example.repository;

import com.example.domain.Quiz;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    @Query("select distinct q.categorie from Quiz q where q.categorie is not null and q.categorie <> ''")
    List<String> findDistinctCategories();

    List<Quiz> findByCategorieIgnoreCase(String categorie);
}
