package com.example.fase1.Model;

import java.io.Serializable;
import java.util.Objects;

public class Pokemon implements Serializable {
    private String nombre;
    private int imagen;
    private int id;
    private String descripcion;
    private String tipos;
    private boolean favorito;

    public Pokemon(String nombre, int imagen, int id, String descripcion, String tipos){
        this.nombre = nombre;
        this.imagen = imagen;
        this.id = id;
        this.descripcion = descripcion;
        this.tipos = tipos;
        this.favorito = false;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Pokemon)) return false;
        Pokemon pokemon = (Pokemon) o;
        return imagen == pokemon.imagen && Objects.equals(nombre, pokemon.nombre) && Objects.equals(descripcion, pokemon.descripcion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombre, imagen, descripcion);
    }

    public int getId() {return id;}

    public String getTipos() {return tipos;}

    public String getNombre() {return nombre;}

    public int getImagen() {return imagen;}

    public String getDescripcion() {return descripcion;}
    public boolean isFavorito() {return favorito;}

    public void setFavorito(boolean favorito) {this.favorito = favorito;}
}
