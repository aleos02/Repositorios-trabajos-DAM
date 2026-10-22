package com.example.menus;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.example.menus.databinding.ActivityMainBinding;
import com.example.menus.databinding.ActivityPokemonBinding;

public class PokemonActivity extends AppCompatActivity {

    ActivityPokemonBinding binding;
    private NavController navController;
    private AppBarConfiguration appBarConfiguration;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView((binding = ActivityPokemonBinding.inflate(getLayoutInflater())).getRoot());

        // 1. Configuramos la toolbar
        setSupportActionBar(binding.toolbar);

        // 2. Obtenemos el NavController
        navController = ((NavHostFragment) getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment)).getNavController();

        // 3. Configuramos la AppBar con los destinos principales (bottom menu)
        // Los fragments que pongamos aquí se consideran top-level destinations
        // Esto quiere decir en ellas no hay botón de back porque no se llegó desde otra,
        // sino que se accede directamente desde el menú
        appBarConfiguration = new AppBarConfiguration.Builder(
                R.id.plantaFragment,
                R.id.psiquicoFragment,
                R.id.fantasmaFragment,
                R.id.dragonFragment
        ).setOpenableLayout(binding.drawerLayout) // Importante para gestionar el icono hamburguesa
                .build();

        // 4. Vinculamos la Toolbar con el NavController indicando la configuración correcta
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);

        // 5. Sincronizamos BottomNavigationView con el NavController
        NavigationUI.setupWithNavController(binding.navigationView, navController);
    }

    @Override
    public boolean onSupportNavigateUp() {
        return NavigationUI.navigateUp(navController, appBarConfiguration)
                || super.onSupportNavigateUp();
    }
}