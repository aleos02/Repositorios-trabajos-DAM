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

import com.example.procesoonboarding.databinding.FragmentResumeBinding;

import java.util.ArrayList;

public class ResumeFragment extends Fragment {

    FragmentResumeBinding binding;

    String userName, birthdate;

    ArrayList<String> sports = new ArrayList<>();


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Bundle args = getArguments();
        userName = args.getString("userName", "");
        birthdate =args.getString("birthdate", "");
        sports = args != null ? args.getStringArrayList("sports") : new ArrayList<>();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentResumeBinding.inflate(inflater, container, false);

        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.btnVolver.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                NavController navController = Navigation.findNavController(view);
                navController.navigate(R.id.action_resumeFragment_to_homeFragment);
            }
        });


        binding.tvUserName.setText(userName);
        binding.tvBirthdate.setText(birthdate);
        String sportsString = (sports==null || sports.isEmpty() ? "Pendiente de especificar" : String.join(", ", sports));
        binding.tvSports.setText(sportsString);

        if(sports != null && !sports.isEmpty()){
            int total = 0;
            for (String sport : sports) {
                if (sport.equalsIgnoreCase("Padel")) total += 70;
                if (sport.equalsIgnoreCase("Formula 1")) total += 60;
                if (sport.equalsIgnoreCase("Basket")) total += 40;
                if (sport.equalsIgnoreCase("E-Sports")) total += 30;
            }
            binding.tvPayment.setText(String.valueOf(total));
            binding.tvPayment.setVisibility(View.VISIBLE);
            binding.tvNombre4.setVisibility(View.VISIBLE);
        }
        else {
            binding.tvPayment.setVisibility(View.GONE);
            binding.tvNombre4.setVisibility(View.GONE);
        }
    }
}