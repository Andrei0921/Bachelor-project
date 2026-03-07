package com.example.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizuri")
public class Quiz {
    @Id()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titlu;
    private String descriere;
    private String categorie;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuizQuestion> intrebari = new ArrayList<>();

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuizResult> rezultate = new ArrayList<>();

    public Quiz() {}

    public Quiz(Long id, String titlu, String descriere, String categorie) {
        this.id = id;
        this.titlu = titlu;
        this.descriere = descriere;
        this.categorie = categorie;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitlu() {
        return titlu;
    }

    public void setTitlu(String titlu) {
        this.titlu = titlu;
    }

    public String getDescriere() {
        return descriere;
    }

    public void setDescriere(String descriere) {
        this.descriere = descriere;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public List<QuizQuestion> getIntrebari() {
        return intrebari;
    }

    public void setIntrebari(List<QuizQuestion> intrebari) {
        this.intrebari = intrebari;
    }

    public List<QuizResult> getRezultate() {
        return rezultate;
    }

    public void setRezultate(List<QuizResult> rezultate) {
        this.rezultate = rezultate;
    }
}
