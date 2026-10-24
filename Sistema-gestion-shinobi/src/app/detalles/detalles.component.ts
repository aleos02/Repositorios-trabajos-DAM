import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../services/api';
import { Mission } from '../moduls/missions';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { Camera, CameraResultType } from '@capacitor/camera';
import { arrowBackOutline, lockClosedOutline, cameraOutline, journal, journalOutline, image } from 'ionicons/icons';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DetallesComponent implements OnInit {
  mision?: Mission;
  imageUrl: string | undefined;
  reporteEnviado: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: Api
  ) {
    addIcons({ arrowBackOutline, lockClosedOutline, cameraOutline, journalOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarMision(id);
    }
  }

  foto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    this.imageUrl = image.webPath;
  };



  cargarMision(id: string) {
    this.api.getMissionById(id).subscribe({
      next: (res: any) => {
        this.mision = res.data ? res.data : res;
        console.log('Misión cargada:', this.mision);
      },
      error: (err) => {
        console.error('Error al obtener la misión:', err);
        this.router.navigate(['/misiones']);
      }
    });
  }

  volver() {
    imageUrl: undefined;
    this.router.navigate(['/misiones']);
  }

  aceptarMision() {
    if (!this.mision) return;

    this.api.aceptarMision(this.mision.id).subscribe({
      next: (res) => {
        this.mision = res.mission;
        console.log('Misión asignada!');
      },
      error: (err) => alert(err.error?.message || 'Error de rango')
    });
  }

  abandonar() {
    if (!this.mision) return;

    this.api.abandonarMision(this.mision.id).subscribe({
      next: () => {
        this.mision!.status = 'DISPONIBLE';
        this.volver();
      }
    });
  }

  completar() {
    if (!this.mision) return;

    this.api.completarMision(this.mision.id).subscribe({
      next: (res) => {
        this.reporteEnviado = true;
        this.mision!.status = 'COMPLETADA';
        this.volver();
      }
    });
  }

}