import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

export interface Suministro {
  id: string;
  nombre: string;
  categoria: 'Armamento' | 'Médico' | 'Sigilo' | 'Herramientas';
  stock: number;
  precioUnitario: number;
  rangoRequerido: 'Genin' | 'Chunin' | 'Jonin' | 'Anbu';
  ultimaActualizacion: string;
}

export const SUMINISTROS_MOCK: Suministro[] = [
  { id: 'S001', nombre: 'Kunai de Acero', categoria: 'Armamento', stock: 150, precioUnitario: 15, rangoRequerido: 'Genin', ultimaActualizacion: '2024-03-01' },
  { id: 'S002', nombre: 'Píldoras de Soldado', categoria: 'Médico', stock: 8, precioUnitario: 50, rangoRequerido: 'Chunin', ultimaActualizacion: '2024-03-05' },
  { id: 'S003', nombre: 'Bomba de Humo', categoria: 'Sigilo', stock: 120, precioUnitario: 25, rangoRequerido: 'Anbu', ultimaActualizacion: '2024-03-02' },
  { id: 'S004', nombre: 'Pergamino de Sellado', categoria: 'Herramientas', stock: 5, precioUnitario: 200, rangoRequerido: 'Jonin', ultimaActualizacion: '2024-03-08' },
  { id: 'S005', nombre: 'Shuriken Gigante', categoria: 'Armamento', stock: 45, precioUnitario: 80, rangoRequerido: 'Chunin', ultimaActualizacion: '2024-03-04' },
  { id: 'S006', nombre: 'Ungüento Curativo', categoria: 'Médico', stock: 3, precioUnitario: 120, rangoRequerido: 'Genin', ultimaActualizacion: '2024-03-07' },
  { id: 'S007', nombre: 'Capa de Invisibilidad', categoria: 'Sigilo', stock: 12, precioUnitario: 500, rangoRequerido: 'Anbu', ultimaActualizacion: '2024-03-01' }
];

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private suministros: Suministro[] = [...SUMINISTROS_MOCK];

  getSuministros(): Suministro[] {
    return this.suministros;
  }

  getStats() {
    return {
      totalStock: this.suministros.reduce((acc, s) => acc + s.stock, 0),
      totalValor: this.suministros.reduce((acc, s) => acc + (s.stock * s.precioUnitario), 0),
      bajoStock: this.suministros.filter(s => s.stock < 10).length,
      categoriaPrincipal: this.getMostFrequent(this.suministros.map(s => s.categoria))
    };
  }

  private getMostFrequent(arr: string[]): string {
    if (arr.length === 0) return 'Ninguna';
    const counts = arr.reduce((acc: any, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  exportarInventario(data: Suministro[], formato: 'excel' | 'pdf') {
    if (formato === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Suministros');
      XLSX.writeFile(workbook, 'Reporte_ANBU.xlsx');
    } else {
      const doc = new jsPDF();
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(204, 0, 0); 
      doc.text('MANIFIESTO DE SUMINISTROS ANBU', 14, 20);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 27);
      
      let y = 40; 
      const rowHeight = 10;
      
      const colX = {
        id: 14,
        nombre: 35,
        categoria: 85,
        stock: 125,
        precio: 155,
        rango: 180
      };

      // Cabecera manual
      doc.setFillColor(163, 0, 0);
      doc.rect(14, y, 182, rowHeight, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255); 
      
      doc.text('ID', colX.id, y + 7);
      doc.text('Nombre', colX.nombre, y + 7);
      doc.text('Categoría', colX.categoria, y + 7);
      doc.text('Stock', colX.stock, y + 7);
      doc.text('Precio', colX.precio, y + 7);
      doc.text('Rango', colX.rango, y + 7);
      
      y += rowHeight;

      // Cuerpo manual
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      
      data.forEach((s) => {
        if (s.stock < 10) {
          doc.setFillColor(254, 237, 238); 
          doc.rect(14, y, 182, rowHeight, 'F');
          doc.setTextColor(204, 0, 0); 
        } else {
          doc.setTextColor(40, 40, 40); 
        }

        doc.setDrawColor(230, 230, 230);
        doc.line(14, y + rowHeight, 196, y + rowHeight);

        doc.text(s.id, colX.id, y + 6.5);
        doc.text(s.nombre, colX.nombre, y + 6.5);
        doc.text(s.categoria, colX.categoria, y + 6.5);
        doc.text(s.stock.toString(), colX.stock, y + 6.5);
        doc.text(`${s.precioUnitario}¥`, colX.precio, y + 6.5);
        doc.text(s.rangoRequerido, colX.rango, y + 6.5);

        y += rowHeight;

        if (y > 270) {
          doc.addPage();
          y = 20; 
        }
      });

      doc.save('Manifiesto_Mision_Nativo.pdf');
    }
  }
}