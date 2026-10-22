package com.example.vueltaalsol;

import android.content.Intent;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.vueltaalsol.databinding.ActivitySecondBinding;

import java.time.LocalDate;
import java.util.Calendar;

public class SecondActivity extends AppCompatActivity {

    int anio,mes,dia;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);
        ActivitySecondBinding binding = ActivitySecondBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        binding.btnVolver.setOnClickListener(v->volver());

        Intent intent = getIntent();
        anio = intent.getIntExtra("anio",0);
        mes = intent.getIntExtra("mes",0);
        dia = intent.getIntExtra("dia",0);

        Calendar fechaActual = Calendar.getInstance();
        Calendar fechaElegida = Calendar.getInstance();
        fechaElegida.set(anio, mes, dia);
        int x=0;
        x=fechaActual.get(Calendar.YEAR) - fechaElegida.get(Calendar.YEAR);
        if (fechaActual.get(Calendar.MONTH) < fechaElegida.get(Calendar.MONTH) ||
                (fechaActual.get(Calendar.MONTH) == fechaElegida.get(Calendar.MONTH) &&
                        fechaActual.get(Calendar.DAY_OF_MONTH) < fechaElegida.get(Calendar.DAY_OF_MONTH))) {
            x--;
        }
        binding.tvVueltas.setText("Has dado "+ x + " vueltas al sol");

    }
    @Override
    protected void onStart(){
        super.onStart();

    }

    public void volver(){
        Intent intent = new Intent(SecondActivity.this, MainActivity.class);
        startActivity(intent);
    }
}