package com.example.vueltaalsol;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.DatePicker;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.vueltaalsol.databinding.ActivityMainBinding;

import java.util.Calendar;

public class MainActivity extends AppCompatActivity {
    private ActivityMainBinding binding;

    private int anioActual,mesActual,diaActual,anioE,mesE,diaE;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView((binding = ActivityMainBinding.inflate(getLayoutInflater())).getRoot());

        binding.btnCalcula.setOnClickListener(v->navega());

        Calendar c = Calendar.getInstance();
        anioActual = c.get(Calendar.YEAR);
        mesActual = c.get(Calendar.MONTH);
        diaActual = c.get(Calendar.DATE);

        DatePickerDialog.OnDateSetListener dateSetListener = new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker datePicker, int anio, int mes, int dia) {
                anioE=anio;
                mesE=mes;
                diaE=dia;

                    binding.fecha.setText(dia + "/" + (mes+1) + "/" + anio);
            }
        };

        binding.fecha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DatePickerDialog calendario = new DatePickerDialog(
                        MainActivity.this,
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
    public void navega(){
        if (binding.fecha.getText().toString().isEmpty()){
            Toast.makeText(MainActivity.this, "Por favor, rellena el campo", Toast.LENGTH_SHORT).show();
        }else {
            Intent intent = new Intent(MainActivity.this, SecondActivity.class);
            intent.putExtra("anio", anioE);
            intent.putExtra("mes", mesE);
            intent.putExtra("dia", diaE);
            startActivity(intent);
        }
    }
}