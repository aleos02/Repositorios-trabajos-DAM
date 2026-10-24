package com.example.fase1;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SearchView;

import com.example.fase1.databinding.FragmentFavPokemonBinding;
import com.example.fase1.databinding.FragmentPokedexBinding;

import java.util.ArrayList;

import Adapter.PokemonAdapter;
import ViewModel.PokemonViewModel;

public class FavPokemonFragment extends Fragment {
    private FragmentFavPokemonBinding binding;
    private PokemonViewModel viewModel;
    private PokemonAdapter adapter;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentFavPokemonBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        viewModel = new ViewModelProvider(requireActivity()).get(PokemonViewModel.class);

        adapter = new PokemonAdapter(requireContext(), new ArrayList<>(), viewModel);
        binding.recyclerView.setAdapter(adapter);
        binding.recyclerView.setLayoutManager(new GridLayoutManager(requireContext(), 2));

        viewModel.pokemonFav.observe(getViewLifecycleOwner(), lista -> {
            adapter.establecerLista(lista);
        });

        viewModel.obtenerPokemonFav();
        eventoEliminarElto(view);

        binding.searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {

            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String texto) {
                viewModel.buscarPokemonPorNombreFav(texto);
                return true;
            }
        });

    }

    private void eventoEliminarElto(View view) {
        ItemTouchHelper.SimpleCallback callback = new ItemTouchHelper.SimpleCallback(
                0,
                ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT
        ) {
            @Override
            public boolean onMove(@NonNull RecyclerView recyclerView,
                                  @NonNull RecyclerView.ViewHolder viewHolder,
                                  @NonNull RecyclerView.ViewHolder target) {
                return false;
            }

            @Override
            public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
                int position = viewHolder.getBindingAdapterPosition();

                if (position != RecyclerView.NO_POSITION) {
                    viewModel.eliminarPokemon(position);
                }
            }
        };

        new ItemTouchHelper(callback).attachToRecyclerView(binding.recyclerView);
    }

    @Override
    public void onResume(){
        super.onResume();
        viewModel.obtenerPokemonFav();
    }
}