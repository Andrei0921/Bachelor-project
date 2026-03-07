package com.example.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "lessons")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titlu;
    private String descriere;

    @Column(columnDefinition = "TEXT")
    private String contentText;

    private String categorie;
    private Integer durataMinute;

    @Column(columnDefinition = "TEXT")
    private String imagineUrls;

    public Lesson() {}

    public Lesson(
            Long id,
            String titlu,
            String descriere,
            String contentText,
            String categorie,
            Integer durataMinute,
            String imagineUrls) {
        this.id = id;
        this.titlu = titlu;
        this.descriere = descriere;
        this.contentText = contentText;
        this.categorie = categorie;
        this.durataMinute = durataMinute;
        this.imagineUrls = imagineUrls;
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

    public String getContentText() {
        return contentText;
    }

    public void setContentText(String contentText) {
        this.contentText = contentText;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public Integer getDurataMinute() {
        return durataMinute;
    }

    public void setDurataMinute(Integer durataMinute) {
        this.durataMinute = durataMinute;
    }

    public String getImagineUrls() {
        return imagineUrls;
    }

    public void setImagineUrls(String imagineUrls) {
        this.imagineUrls = imagineUrls;
    }
}
