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
import android.widget.Toast;

import com.example.procesoonboarding.databinding.FragmentHomeBinding;

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

        binding.btnRegistrar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!binding.etUsuario.getText().toString().isEmpty() && !binding.etPassword.getText().toString().isEmpty()) {
                    Bundle bundle = new Bundle();
                    bundle.putString("userName", binding.etUsuario.getText().toString());

                    NavController navController = Navigation.findNavController(view);
                    navController.navigate(R.id.action_homeFragment_to_contactFragment, bundle);
                }
                else Toast.makeText(getContext(), "Complete los campos", Toast.LENGTH_SHORT).show();
            }
        });
    }


}