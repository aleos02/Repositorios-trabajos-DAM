package com.example.procesoonboarding;

import android.app.DatePickerDialog;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.DatePicker;
import android.widget.Toast;

import com.example.procesoonboarding.databinding.FragmentContactBinding;

import java.util.Calendar;

public class ContactFragment extends Fragment {

    FragmentContactBinding binding;

    int anioActual,mesActual,diaActual;

    String birthdate, userName;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments() != null) {
            userName = getArguments().getString("userName");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        binding = FragmentContactBinding.inflate(inflater, container, false);

        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.btnContinuar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if(!binding.etFecha.getText().toString().isEmpty() && !binding.etNumero.getText().toString().isEmpty()){
                    Bundle bundle = new Bundle();
                    bundle.putString("userName", userName);
                    bundle.putString("birthdate", birthdate);

                    NavController navController = Navigation.findNavController(view);
                    navController.navigate(R.id.action_contactFragment_to_sportFragment, bundle);
                }
                else Toast.makeText(getContext(), "Complete los campos", Toast.LENGTH_SHORT).show();
            }
        });

        binding.btnSkip2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!binding.etFecha.getText().toString().isEmpty() && !binding.etNumero.getText().toString().isEmpty()) {
                    Bundle bundle = new Bundle();
                    bundle.putString("userName", userName);
                    bundle.putString("birthdate", birthdate);

                    NavController navController = Navigation.findNavController(view);
                    navController.navigate(R.id.action_contactFragment_to_resumeFragment, bundle);
                } else
                    Toast.makeText(getContext(), "Complete los campos", Toast.LENGTH_SHORT).show();
            }
        });


        Calendar c = Calendar.getInstance();
        anioActual = c.get(Calendar.YEAR);
        mesActual = c.get(Calendar.MONTH);
        diaActual = c.get(Calendar.DATE);

        DatePickerDialog.OnDateSetListener dateSetListener = new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker datePicker, int anio, int mes, int dia) {
                //anioE=anio;
                //mesE=mes;
                //diaE=dia;
                birthdate = dia + "/" + (mes+1) + "/" + anio;
                binding.etFecha.setText(dia + "/" + (mes+1) + "/" + anio);
            }
        };

        binding.etFecha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DatePickerDialog calendario = new DatePickerDialog(
                        getActivity(),
                        dateSetListener,
                        anioActual,
                        mesActual,
                        diaActual
                );

                Calendar fechaMaxima = Calendar.getInstance();
                calendario.getDatePicker().setMaxDate(fechaMaxima.getTimeInMillis());
                calendario.show();
            }
        });

    }

}