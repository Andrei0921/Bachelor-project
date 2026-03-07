package com.example.dto;

import java.util.ArrayList;
import java.util.List;

public class QuizResponseDTO {
    private Long id;
    private String titlu;
    private String descriere;
    private String categorie;
    private List<QuestionResponseDTO> intrebari = new ArrayList<>();

    public QuizResponseDTO() {}

    public QuizResponseDTO(
            Long id, String titlu, String descriere, String categorie, List<QuestionResponseDTO> intrebari) {
        this.id = id;
        this.titlu = titlu;
        this.descriere = descriere;
        this.categorie = categorie;
        this.intrebari = intrebari;
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

    public List<QuestionResponseDTO> getIntrebari() {
        return intrebari;
    }

    public void setIntrebari(List<QuestionResponseDTO> intrebari) {
        this.intrebari = intrebari;
    }
}
