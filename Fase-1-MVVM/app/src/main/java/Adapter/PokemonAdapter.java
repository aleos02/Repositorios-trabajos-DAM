package Adapter;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;

import com.example.fase1.R;
import com.example.fase1.databinding.ViewholderPokemonBinding;

import java.util.List;

import com.example.fase1.Model.Pokemon;

import ViewModel.PokemonViewModel;

public class PokemonAdapter extends RecyclerView.Adapter<PokemonAdapter.PokemonViewHolder>{

    private List<Pokemon> pokemons;
    private final LayoutInflater inflater;

    private PokemonViewModel viewModel;


    public PokemonAdapter(Context context, List<Pokemon> pokemons, PokemonViewModel viewModel) {
        this.pokemons = pokemons;
        this.viewModel = viewModel;
        this.inflater = LayoutInflater.from(context);
    }

    @NonNull
    @Override
    public PokemonViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.viewholder_pokemon, parent, false);
        return new PokemonViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull PokemonViewHolder holder, int position) {
        Pokemon pokemon = pokemons.get(position);

        holder.binding.tvNombre.setText(pokemon.getNombre());
        holder.binding.ivPokemon.setImageResource(pokemon.getImagen());
        holder.binding.tvID.setText("Nº " + pokemon.getId());

        holder.itemView.setOnClickListener(v -> {
            viewModel.seleccionarPokemon(pokemon);

            NavController navController = Navigation.findNavController(v);
            navController.navigate(R.id.detailsFragment);
        });

        establecerIconoFav(pokemon,holder);
        holder.binding.iconFavorite.setOnClickListener(v -> marcarFavorito(pokemon,holder));
    }

    private void marcarFavorito(Pokemon pokemon, PokemonViewHolder holder) {
        if(pokemon.isFavorito()) pokemon.setFavorito(false);
        else pokemon.setFavorito(true);

        establecerIconoFav(pokemon,holder);
        viewModel.actualizarPokemon(pokemon);
    }
    private void establecerIconoFav(Pokemon pokemon, PokemonViewHolder holder) {
        if(pokemon.isFavorito())
            holder.binding.iconFavorite.setImageResource(android.R.drawable.btn_star_big_on);
        else
            holder.binding.iconFavorite.setImageResource(android.R.drawable.btn_star_big_off);
    }


    @Override
    public int getItemCount() {
        return pokemons != null ? pokemons.size() : 0;
    }

    public void establecerLista(List<Pokemon> pokemons) {
        this.pokemons = pokemons;
        notifyDataSetChanged();
    }

    public static class PokemonViewHolder extends RecyclerView.ViewHolder {

        ViewholderPokemonBinding binding;

        public PokemonViewHolder(@NonNull View itemView) {
            super(itemView);
            binding = ViewholderPokemonBinding.bind(itemView);
        }
    }
}

