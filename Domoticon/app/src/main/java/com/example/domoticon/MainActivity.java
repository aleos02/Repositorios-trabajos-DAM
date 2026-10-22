package com.example.domoticon;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.domoticon.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {

    ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView((binding = ActivityMainBinding.inflate(getLayoutInflater())).getRoot());

        String[] devices = {"","2","3"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                this,
                R.layout.texto_spinner,
                devices
        );
        binding.spinner.setAdapter(adapter);

        binding.spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener(){
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id){
                if(parent.getItemAtPosition(position).toString().equals("2")){
                    Intent intent = new Intent(MainActivity.this, TwoDevicesActivity.class);
                    startActivity(intent);
                }
                else if(parent.getItemAtPosition(position).toString().equals("3")){
                    Intent intent = new Intent(MainActivity.this, ThreeDevicesActivity.class);
                    startActivity(intent);
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent){}
        });
    }
}