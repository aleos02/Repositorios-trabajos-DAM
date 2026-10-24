package com.example.fase1;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.example.fase1.databinding.FragmentDetailsBinding;

import ViewModel.PokemonViewModel;

public class DetailsFragment extends Fragment {
    private FragmentDetailsBinding binding;
    private PokemonViewModel viewModel;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
            binding = FragmentDetailsBinding.inflate(inflater, container, false);
            return binding.getRoot();
        }

        @Override
        public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
            super.onViewCreated(view, savedInstanceState);

            // Obtenemos el ViewModel compartido (misma instancia que en AnimalesFragment)
            viewModel = new ViewModelProvider(requireActivity()).get(PokemonViewModel.class);

            // Observamos el animal seleccionado
            viewModel.pokemonSeleccionado.observe(getViewLifecycleOwner(), pokemon -> {
                if (pokemon != null) {
                    // Si ha llegado un animal, cargamos sus datos en el layout
                    binding.tvNombreDetalle.setText(pokemon.getNombre());
                    binding.ivDetalle.setImageResource(pokemon.getImagen());
                    binding.tvDescripcion.setText(pokemon.getDescripcion());
                } else {
                    // En caso de error, podríamos volver atrás o mostrar un mensaje
                    Toast.makeText(requireContext(), "No se pudo cargar el detalle del pokemon", Toast.LENGTH_SHORT).show();
                    requireActivity().onBackPressed();
                }
            });
        }
}
