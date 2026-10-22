package com.example.procesoonboarding;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.procesoonboarding.databinding.FragmentSportBinding;

import java.util.ArrayList;

public class SportFragment extends Fragment {

    FragmentSportBinding binding;

    String userName, birthdate;

    ArrayList<String> sports = new ArrayList<>();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments() != null) {
            userName = getArguments().getString("userName");
            birthdate = getArguments().getString("birthdate");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentSportBinding.inflate(inflater, container, false);

        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.btnContinuar2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(binding.deporte1.isChecked()) sports.add("Padel");
                if(binding.deporte2.isChecked()) sports.add("Formula 1");
                if(binding.deporte3.isChecked()) sports.add("Basket");
                if(binding.deporte4.isChecked()) sports.add("E-Sports");
                Bundle bundle = new Bundle();
                bundle.putString("userName", userName);
                bundle.putString("birthdate", birthdate);
                bundle.putStringArrayList("sports", sports);
                NavController navController = Navigation.findNavController(view);
                navController.navigate(R.id.action_sportFragment_to_resumeFragment,bundle);
            }
        });
    }

}