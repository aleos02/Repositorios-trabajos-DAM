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

import com.example.fase1.databinding.FragmentPokedexBinding;

import java.util.ArrayList;

import Adapter.PokemonAdapter;
import ViewModel.PokemonViewModel;

public class PokedexFragment extends Fragment {
    private FragmentPokedexBinding binding;
    private PokemonViewModel viewModel;
    private PokemonAdapter adapter;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflamos el layout usando ViewBinding (en lugar de findViewById)
        binding = FragmentPokedexBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Obtenemos el ViewModel (persistente durante el ciclo de vida de la Activity, por ello usamos requireActivity)
        viewModel = new ViewModelProvider(requireActivity()).get(PokemonViewModel.class);

        // Configuramos el RecyclerView y su adaptador
        // Ahora pasamos una lista vacía al constructor (podríamos quitar ese parámetro también)
        adapter = new PokemonAdapter(requireContext(), new ArrayList<>(), viewModel);
        binding.recyclerView.setAdapter(adapter);
        binding.recyclerView.setLayoutManager(new GridLayoutManager(requireContext(), 2));

        // Observamos los datos del LiveData
        viewModel.pokemons.observe(getViewLifecycleOwner(), lista -> {
            // Si hay cambios, actualizamos la lista del adaptador del RecyclerView
            adapter.establecerLista(lista);
        });

        // Llamamos al método que recupera los animales
        viewModel.obtenerPokemon();
        eventoEliminarElto(view);

        binding.searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {

            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String texto) {
                viewModel.buscarPokemonPorNombre(texto);
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
                    // Pedimos al ViewModel que elimine el animal de esa posición
                    viewModel.eliminarPokemon(position);
                }
            }
        };

        new ItemTouchHelper(callback).attachToRecyclerView(binding.recyclerView);
    }


}