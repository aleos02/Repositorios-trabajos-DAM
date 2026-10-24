import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class HomePage implements OnInit {
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer); 

  protected misionForm: FormGroup = inject(FormBuilder).group({
    codigo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{5}$/)]],
    rango: ['', Validators.required],
    encargado: ['', [Validators.required, Validators.minLength(3)]],
    objetivos: ['', [Validators.required, Validators.minLength(10)]]
  });
  protected previewUrl: SafeResourceUrl | null = null;

  ngOnInit() {
    this.misionForm.valueChanges.subscribe(() => {
      if (this.misionForm.valid) {
        this.actualizarPrevisualizacion();
      } else {
        this.previewUrl = null; 
      }
    });
  }

  construirPDF(): jsPDF {
    const { codigo, rango, encargado, objetivos } = this.misionForm.value;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    doc.setDrawColor(101, 67, 33);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 190, 277);

    doc.setLineWidth(0.5);
    doc.rect(13, 13, 184, 271);

    doc.setFont('courier', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(139, 0, 0);
    doc.text('ORDEN DE MISIÓN OFICIAL', 105, 30, { align: 'center' });

    doc.setLineWidth(0.7);
    doc.line(40, 35, 170, 35);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    doc.setFont('courier', 'bold');
    doc.text('CÓDIGO DE MISIÓN:', 25, 55);
    doc.setFont('courier', 'normal');
    doc.text(codigo.toUpperCase(), 75, 55);

    doc.setFont('courier', 'bold');
    doc.text('RANGO ASIGNADO:', 25, 67);
    doc.setFont('courier', 'normal');
    doc.text(rango, 75, 67);

    doc.setFont('courier', 'bold');
    doc.text('OFICIAL ENCARGADO:', 25, 79);
    doc.setFont('courier', 'normal');
    doc.text(encargado, 75, 79);

    doc.setFont('courier', 'bold');
    doc.text('OBJETIVOS Y DETALLES DE LA MISIÓN:', 25, 100);
    doc.setLineWidth(0.3);
    doc.line(25, 103, 185, 103);

    doc.setFont('courier', 'normal');
    const anchoMaximoTexto = 160;
    const lineasTexto = doc.splitTextToSize(objetivos, anchoMaximoTexto);
    
    let yActual = 110;
    const limiteY = 260; 

    lineasTexto.forEach((linea: string) => {
      if (yActual > limiteY) {
        doc.addPage();
        doc.setDrawColor(101, 67, 33);
        doc.setLineWidth(1.5);
        doc.rect(10, 10, 190, 277);
        doc.setLineWidth(0.5);
        doc.rect(13, 13, 184, 271);
        yActual = 25;
      }
      doc.text(linea, 25, yActual);
      yActual += 7; 
    });

    return doc;
  }

  actualizarPrevisualizacion() {
    const doc = this.construirPDF();
    const dataUri = doc.output('datauristring');
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dataUri);
  }

  descargarPDF() {
    if (this.misionForm.invalid) return;
    const doc = this.construirPDF();
    const codigo = this.misionForm.get('codigo')?.value;
    doc.save(`mision_${codigo.toLowerCase()}.pdf`);
  }
}