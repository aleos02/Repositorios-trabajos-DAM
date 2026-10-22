package com.example.menus;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.menus.databinding.FragmentHomeBinding;


public class HomeFragment extends Fragment {

    FragmentHomeBinding binding;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        binding = FragmentHomeBinding.inflate(inflater, container, false);

        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.btnFormula1.setOnClickListener(v->navegaF1());

        binding.btnPokemon.setOnClickListener(v->navegaPokemon());
    }

    public void navegaF1(){
        Intent intent = new Intent(getActivity(), FormulaActivity.class);
        startActivity(intent);
    }

    public void navegaPokemon(){
        Intent intent = new Intent(getActivity(), PokemonActivity.class);
        startActivity(intent);
    }
}