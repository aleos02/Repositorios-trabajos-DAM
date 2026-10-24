package ViewModel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.fase1.Model.Pokemon;

import java.util.List;

import com.example.fase1.Repository.PokemonRepository;

public class PokemonViewModel extends ViewModel {

    private PokemonRepository repository;
    public MutableLiveData<List<Pokemon>> pokemons = new MutableLiveData<>();
    public MutableLiveData<Pokemon> pokemonSeleccionado = new MutableLiveData<>();
    public MutableLiveData<List<Pokemon>> pokemonFav = new MutableLiveData<>();



    public PokemonViewModel() {
        repository = new PokemonRepository();
    }

    public void eliminarPokemon(int position) {
        List<Pokemon> listaActual = pokemons.getValue();

        if (listaActual != null && position >= 0 && position < listaActual.size()) {

            Pokemon eliminado = listaActual.get(position);

            repository.eliminarPokemon(eliminado);

            pokemons.setValue(repository.getPokemon());
        }

        obtenerPokemonFav();
        obtenerPokemon();
    }

    public void obtenerPokemon() {
        pokemons.setValue(repository.getPokemon());
    }

    public void obtenerPokemonFav(){
        pokemonFav.setValue(repository.getPokemonFav());
    }


    public void seleccionarPokemon(Pokemon pokemon) {
        pokemonSeleccionado.setValue(pokemon);
    }

    public void actualizarPokemon(Pokemon pokemon) {
        repository.actualizarPokemon(pokemon);

        pokemonFav.setValue(repository.getPokemonFav());


    }


    public void buscarPokemonPorNombre(String texto) {
        pokemons.setValue(repository.getPokemonPorNombre(texto));
    }

    public void buscarPokemonPorNombreFav(String texto) {
        pokemonFav.setValue(repository.getPokemonPorNombreFav(texto));
    }
}
