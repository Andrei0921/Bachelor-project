package com.example.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "quiz_results")
public class QuizResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    private Integer scor;
    private Integer raspunsuriGresite;

    public QuizResult() {}

    public QuizResult(Long id, User user, Quiz quiz, Integer scor, Integer raspunsuriGresite) {
        this.id = id;
        this.user = user;
        this.quiz = quiz;
        this.scor = scor;
        this.raspunsuriGresite = raspunsuriGresite;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getScor() {
        return scor;
    }

    public void setScor(Integer scor) {
        this.scor = scor;
    }

    public Integer getRaspunsuriGresite() {
        return raspunsuriGresite;
    }

    public void setRaspunsuriGresite(Integer raspunsuriGresite) {
        this.raspunsuriGresite = raspunsuriGresite;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
