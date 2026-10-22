package com.example.domoticon;

import android.os.Bundle;
import android.widget.CompoundButton;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.domoticon.databinding.ActivityMainBinding;
import com.example.domoticon.databinding.ActivityTwoDevicesBinding;

public class TwoDevicesActivity extends AppCompatActivity {

    ActivityTwoDevicesBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView((binding = ActivityTwoDevicesBinding.inflate(getLayoutInflater())).getRoot());

        //Evento de ambos toggleButton
        binding.btnDevice1.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    binding.device1.setImageResource(R.drawable.encendida);
                } else {
                    binding.device1.setImageResource(R.drawable.apagada);
                }
            }
        });
        binding.btnDevice2.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    binding.device2.setImageResource(R.drawable.encendida);
                } else {
                    binding.device2.setImageResource(R.drawable.apagada);
                }
            }
        });

        //Evento de imageButton
        binding.imageButton.setOnClickListener(v -> invierte());

        //Evento del switch
        binding.switch1.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    binding.btnDevice1.setEnabled(false);
                    binding.btnDevice1.setClickable(false);
                    binding.btnDevice2.setEnabled(false);
                    binding.btnDevice2.setClickable(false);

                    binding.imageButton.setEnabled(false);
                    binding.imageButton.setClickable(false);

                    binding.checkBox.setEnabled(false);
                    binding.checkBox2.setEnabled(false);
                } else {
                    binding.btnDevice1.setEnabled(true);
                    binding.btnDevice1.setClickable(true);
                    binding.btnDevice2.setEnabled(true);
                    binding.btnDevice2.setClickable(true);

                    binding.imageButton.setEnabled(true);
                    binding.imageButton.setClickable(true);

                    binding.checkBox.setEnabled(true);
                    binding.checkBox2.setEnabled(true);
                }
            }
        });

    }

    private void invierte() {
        if (binding.checkBox.isChecked()) {
            if (binding.btnDevice1.isChecked()) {
                binding.btnDevice1.setChecked(false);
                binding.device1.setImageResource(R.drawable.apagada);
            } else {
                binding.device1.setImageResource(R.drawable.encendida);
                binding.btnDevice1.setChecked(true);
            }
        }
        if (binding.checkBox2.isChecked()) {
            if (binding.btnDevice2.isChecked()) {
                binding.btnDevice2.setChecked(false);
                binding.device2.setImageResource(R.drawable.apagada);
            } else {
                binding.device2.setImageResource(R.drawable.encendida);
                binding.btnDevice2.setChecked(true);
            }
        }
    }

}