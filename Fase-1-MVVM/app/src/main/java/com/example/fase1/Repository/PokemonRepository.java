package com.example.fase1.Repository;

import android.content.Context;

import com.example.fase1.R;

import java.util.ArrayList;
import java.util.List;

import com.example.fase1.Model.Pokemon;

public class PokemonRepository {
    private List<Pokemon> listaPokemon;
    public PokemonRepository(){
        listaPokemon = new ArrayList<>();

        listaPokemon.add(new Pokemon("Venusaur", R.drawable.venusaur, 3, "La flor de su espalda crece al ritmo de su evolución. Atrae a los Pokémon de tipo insecto.", "Planta/Veneno"));
        listaPokemon.add(new Pokemon("Charizard", R.drawable.charizard, 6, "Escupe fuego tan caliente que funde todo lo que toca. Cuando está enfadado, la llama de la punta de su cola arde de forma más intensa.", "Fuego/Volador"));
        listaPokemon.add(new Pokemon("Blastoise", R.drawable.blastoise, 9, "Los cañones de su caparazón pueden echar agua con tanta fuerza que perforan planchas de acero.", "Agua"));
        listaPokemon.add(new Pokemon("Pikachu", R.drawable.pikachu, 25, "Cuando se excita, las puntas de sus mejillas emiten chispas. También produce electricidad cuando corre.", "Eléctrico"));
        listaPokemon.add(new Pokemon("Nidoqueen", R.drawable.nidoqueen, 31, "Sus escamas son tan duras que pueden resistir cualquier ataque. Protege a sus crías con fiereza.", "Veneno/Tierra"));
        listaPokemon.add(new Pokemon("Nidoking", R.drawable.nidoking, 34, "Sus brazos poderosos le permiten destruir montañas a golpes. Es feroz y no se deja domesticar.", "Veneno/Tierra"));
        listaPokemon.add(new Pokemon("Vileplume", R.drawable.vileplume, 45, "El polen de su enorme flor puede causar una fuerte fiebre. Es un peligro para los alérgicos.", "Planta/Veneno"));
        listaPokemon.add(new Pokemon("Arcanine", R.drawable.arcanine, 59, "Es un Pokémon extraordinariamente veloz que corre a más de 10.000 km/h.", "Fuego"));
        listaPokemon.add(new Pokemon("Alakazam", R.drawable.alakazam, 65, "Su cerebro desarrollado al máximo le permite usar toda clase de poderes psíquicos.", "Psíquico"));
        listaPokemon.add(new Pokemon("Machamp", R.drawable.machamp, 68, "Tiene cuatro brazos, lo que le permite lanzar mil puñetazos en dos segundos.", "Lucha"));
        listaPokemon.add(new Pokemon("Tentacruel", R.drawable.tentacruel, 73, "Los tentáculos que le salen de la cabeza tienen ventosas que se adhieren fuertemente a cualquier cosa.", "Agua/Veneno"));
        listaPokemon.add(new Pokemon("Muk", R.drawable.muk, 89, "Es tan tóxico que deja el suelo envenenado durante siete años donde se tumba a descansar.", "Veneno"));
        listaPokemon.add(new Pokemon("Gengar", R.drawable.gengar, 94, "Aunque tenga piernas, Gengar puede usar la levitación. Dicen que por las noches invocan espíritus malignos para que a todo el mundo le ocurran desgracias e infortunios.", "Fantasma/Veneno"));
        listaPokemon.add(new Pokemon("Hypno", R.drawable.hypno, 97, "Se lleva a los niños que no pueden dormir por la noche. Dicen que los devuelve al amanecer.", "Psíquico"));
        listaPokemon.add(new Pokemon("Starmie", R.drawable.starmie, 121, "La joya central posee un misterioso poder cerebral que le permite nadar sin descanso.", "Agua/Psíquico"));
        listaPokemon.add(new Pokemon("Scyther", R.drawable.scyther, 123, "Sus guadañas son tan afiladas que no hay nada que no puedan cortar. Su velocidad es asombrosa.", "Bicho/Volador"));
        listaPokemon.add(new Pokemon("Gyarados", R.drawable.gyarados, 130, "Cuando Magikarp evoluciona a Gyarados, sus células cerebrales sufren un cambio y se vuelve muy agresivo.", "Agua/Volador"));
        listaPokemon.add(new Pokemon("Lapras", R.drawable.lapras, 131, "Usado como transporte en el pasado, pero su población ha disminuido tanto que ahora es raro de ver.", "Agua/Hielo"));
        listaPokemon.add(new Pokemon("Eevee", R.drawable.eevee, 133, "Suele vivir cerca de sus entrenadores. Es de carácter sociable y amigable.", "Normal"));
        listaPokemon.add(new Pokemon("Vaporeon", R.drawable.vaporeon, 134, "Su cuerpo absorbe el agua y se hace más transparente. Es casi imposible verlo bajo el agua de noche.", "Agua"));
        listaPokemon.add(new Pokemon("Aerodactyl", R.drawable.aerodactyl, 142, "Es un Pokémon prehistórico revivido de una roca fósil. Vuela a velocidades supersónicas.", "Roca/Volador"));
        listaPokemon.add(new Pokemon("Dragonite", R.drawable.dragonite, 149, "Es completamente incansable. Vuela por todo el mundo para rescatar a los que están en peligro.", "Dragón/Volador"));
        listaPokemon.add(new Pokemon("Mewtwo", R.drawable.mewtwo, 150, "Fue creado por una serie de experimentos genéticos para ser el Pokémon más poderoso del mundo.", "Psíquico"));
        listaPokemon.add(new Pokemon("Mew", R.drawable.mew, 151, "Este Pokémon mítico fue descubierto por científicos en una selva de Guyana.", "Psíquico"));

    }


    public List<Pokemon> getPokemon(){
        return listaPokemon;
    }

    public List<Pokemon> getPokemonFav(){
        List<Pokemon> listaFav = new ArrayList<>();
        for (Pokemon a : listaPokemon) {
            if(a.isFavorito())
                listaFav.add(a);
            else listaFav.remove(a);
        }
        return listaFav;
    }


    public void actualizarPokemon(Pokemon pokemon) {
        int posicion = listaPokemon.indexOf(pokemon);

        listaPokemon.set(posicion,pokemon);
    }

    public void eliminarPokemon(Pokemon pokemon) {
        listaPokemon.remove(pokemon);
    }

    public List<Pokemon> getPokemonPorNombreFav(String texto) {
        List<Pokemon> resultado = new ArrayList<>();
        List<Pokemon> listaAux = getPokemonFav();
        for (Pokemon a : listaAux) {
            if (a.getNombre().toLowerCase().startsWith(texto)) {
                resultado.add(a);
            }
        }
        return resultado;
    }

    public List<Pokemon> getPokemonPorNombre(String texto) {
        List<Pokemon> resultado = new ArrayList<>();
        for (Pokemon a : listaPokemon) {
            if (a.getNombre().toLowerCase().startsWith(texto)) {
                resultado.add(a);
            }
        }
        return resultado;
    }

}