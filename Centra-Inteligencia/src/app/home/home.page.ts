import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType, Chart } from 'chart.js';
import { 
  BarController, BarElement, CategoryScale, LinearScale, 
  DoughnutController, ArcElement, RadarController, RadialLinearScale, 
  PointElement, LineElement, Filler, Tooltip, Legend 
} from 'chart.js';
import { InventarioService, Suministro } from '../services/inventario';

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

import { addIcons } from 'ionicons';
import { createOutline, trashOutline } from 'ionicons/icons';

Chart.register(
  BarController, BarElement, CategoryScale, LinearScale, 
  DoughnutController, ArcElement, RadarController, RadialLinearScale, 
  PointElement, LineElement, Filler, Tooltip, Legend
);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, BaseChartDirective],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  suministrosOriginales: Suministro[] = [];
  suministrosFiltrados: Suministro[] = [];
  stats: any = {};

  filtroTexto: string = '';
  filtroStockMin: number = 0;
  
  columnaOrdenada: keyof Suministro | '' = '';
  ordenAscendente: boolean = true;
  suministrosSeleccionados: Set<string> = new Set<string>();

  isModalOpen: boolean = false;
  editando: boolean = false;
  formSuministro: Partial<Suministro> = {};

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { 
      legend: { position: 'top', labels: { color: '#e0e0e0', font: { size: 10 } } } 
    },
    scales: { 
      r: { 
        grid: { color: '#1e293b' }, 
        angleLines: { color: '#1e293b' }, 
        pointLabels: { color: '#8ec5fc', font: { size: 10 } }, 
        ticks: { display: false, backdropColor: 'transparent' }, 
        suggestedMin: 0 
      } 
    }
  };
  public radarChartType: ChartType = 'radar';
  public radarChartData!: ChartData<'radar'>;

  public donutChartOptions: ChartConfiguration['options'] = { 
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'right', labels: { color: '#e0e0e0' } } }
  };
  public donutChartType: ChartType = 'doughnut';
  public donutChartData!: ChartData<'doughnut'>;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { 
      x: { ticks: { color: '#777' }, grid: { display: false } }, 
      y: { ticks: { color: '#777' }, grid: { color: '#1a1a1a' }, min: 0 } 
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData!: ChartData<'bar'>;

  constructor(private inventarioService: InventarioService) {
    addIcons({ createOutline, trashOutline });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.suministrosOriginales = this.inventarioService.getSuministros();
    this.stats = this.inventarioService.getStats();
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.suministrosFiltrados = this.suministrosOriginales.filter(s => {
      const cumpleTexto = s.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) || 
                          s.id.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
                          s.categoria.toLowerCase().includes(this.filtroTexto.toLowerCase());
      
      const cumpleStockMin = s.stock >= this.filtroStockMin;      
      return cumpleTexto && cumpleStockMin;
    });

    if (this.columnaOrdenada) {
      this.ordenar(this.columnaOrdenada, false);
    } else {
      this.actualizarGraficos();
    }
  }

  ordenar(columna: keyof Suministro, cambiarSentido: boolean = true) {
    if (cambiarSentido) {
      if (this.columnaOrdenada === columna) { this.ordenAscendente = !this.ordenAscendente; } 
      else { this.columnaOrdenada = columna; this.ordenAscendente = true; }
    }
    this.suministrosFiltrados.sort((a, b) => {
      let valA = a[columna]; let valB = b[columna];
      if (typeof valA === 'string') {
        return this.ordenAscendente ? (valA as string).localeCompare(valB as string) : (valB as string).localeCompare(valA as string);
      } else {
        return this.ordenAscendente ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }
    });
    this.actualizarGraficos();
  }

  abrirModalNuevo() {
    this.editando = false;
    this.formSuministro = {
      nombre: '',
      categoria: 'Armamento',
      stock: 0,
      precioUnitario: 0,
      rangoRequerido: 'Genin'
    };
    this.isModalOpen = true;
  }

  cargarEnFormulario(suministro: Suministro) {
    this.editando = true;
    this.formSuministro = { ...suministro }; 
    this.isModalOpen = true;
  }

  guardarActivo() {
    if (!this.formSuministro.nombre) return;

    if (this.editando) {
      const index = this.suministrosOriginales.findIndex(s => s.id === this.formSuministro.id);
      if (index !== -1) {
        this.suministrosOriginales[index] = this.formSuministro as Suministro;
      }
    } else {
      const siguienteId = `S00${this.suministrosOriginales.length + 1}`;
      const nuevo: Suministro = {
        id: siguienteId,
        nombre: this.formSuministro.nombre,
        categoria: this.formSuministro.categoria as any,
        stock: this.formSuministro.stock || 0,
        precioUnitario: this.formSuministro.precioUnitario || 0,
        rangoRequerido: this.formSuministro.rangoRequerido as any,
        ultimaActualizacion: new Date().toISOString().split('T')[0]
      };
      this.suministrosOriginales.push(nuevo);
    }

    this.recalcularYRefrescar();
    this.isModalOpen = false;
  }

  eliminarActivo(id: string) {
    this.suministrosOriginales = this.suministrosOriginales.filter(s => s.id !== id);
    this.suministrosSeleccionados.delete(id);
    this.recalcularYRefrescar();
  }

  recalcularYRefrescar() {
    this.stats.totalStock = this.suministrosOriginales.reduce((acc, s) => acc + s.stock, 0);
    this.stats.totalValor = this.suministrosOriginales.reduce((acc, s) => acc + (s.stock * s.precioUnitario), 0);
    this.stats.bajoStock = this.suministrosOriginales.filter(s => s.stock < 10).length;
    
    this.aplicarFiltros(); 
  }

  toggleSeleccion(id: string) { if (this.suministrosSeleccionados.has(id)) { this.suministrosSeleccionados.delete(id); } else { this.suministrosSeleccionados.add(id); } }
  toggleSeleccionarTodo() { if (this.suministrosSeleccionados.size === this.suministrosFiltrados.length) { this.suministrosSeleccionados.clear(); } else { this.suministrosFiltrados.forEach(s => this.suministrosSeleccionados.add(s.id)); } }

  actualizarGraficos() {
    const categorias = ['Armamento', 'Médico', 'Sigilo', 'Herramientas'];
    
    const stockPorCategoria = categorias.map(cat => 
      this.suministrosFiltrados.filter(s => s.categoria === cat).reduce((sum, s) => sum + s.stock, 0)
    );

    this.radarChartData = {
      labels: ['Armamento', 'Médico', 'Sigilo', 'Herramientas'],
      datasets: [{ 
        data: stockPorCategoria, 
        label: 'Balance de Arsenal (Unidades)', 
        borderColor: '#00d2ff', 
        borderWidth: 2, 
        pointBackgroundColor: '#ffffff', 
        pointBorderColor: '#00d2ff', 
        pointBorderWidth: 2, 
        pointRadius: 4, 
        fill: false, 
        backgroundColor: 'transparent' 
      }]
    };

    this.donutChartData = { 
      labels: categorias, 
      datasets: [{ 
        data: stockPorCategoria, 
        backgroundColor: ['#00d2ff', '#0084ff', '#10b981', '#ff4757'], 
        borderWidth: 0 
      }] 
    };
    
    this.barChartData = { 
      labels: categorias, 
      datasets: [{ 
        data: stockPorCategoria, 
        backgroundColor: '#00d2ff', 
        borderRadius: 4 
      }] 
    };
  }

  exportar(formato: 'excel' | 'pdf') {
    const datosAExportar = this.suministrosSeleccionados.size > 0 
      ? this.suministrosOriginales.filter(s => this.suministrosSeleccionados.has(s.id)) 
      : this.suministrosFiltrados;

    if (formato === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(datosAExportar);
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
      
      const colX = { id: 14, nombre: 35, categoria: 85, stock: 125, precio: 155, rango: 180 };

      doc.setFillColor(26, 34, 47); 
      doc.rect(14, y, 182, rowHeight, 'F'); 
      
      doc.setDrawColor(35, 45, 60);
      doc.setLineWidth(0.5);
      doc.rect(14, y, 182, rowHeight, 'D'); 

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255); 
      
      doc.text('ID', colX.id, y + 7);
      doc.text('Material', colX.nombre, y + 7);
      doc.text('Categoría', colX.categoria, y + 7);
      doc.text('Stock', colX.stock, y + 7);
      doc.text('Precio', colX.precio, y + 7);
      doc.text('Rango', colX.rango, y + 7);
      
      y += rowHeight;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      
      datosAExportar.forEach((s) => {
        if (s.stock < 10) {
          doc.setFillColor(254, 237, 238); 
          doc.rect(14, y, 182, rowHeight, 'F');
          doc.setTextColor(185, 28, 28); 
        } else {
          doc.setTextColor(40, 40, 40); 
        }

        doc.setDrawColor(200, 200, 200); 
        doc.setLineWidth(0.3);
        doc.rect(14, y, 182, rowHeight, 'D'); 

        doc.line(colX.nombre - 2, y, colX.nombre - 2, y + rowHeight);
        doc.line(colX.categoria - 2, y, colX.categoria - 2, y + rowHeight);
        doc.line(colX.stock - 2, y, colX.stock - 2, y + rowHeight);
        doc.line(colX.precio - 2, y, colX.precio - 2, y + rowHeight);
        doc.line(colX.rango - 2, y, colX.rango - 2, y + rowHeight);

        doc.text(s.id, colX.id, y + 6.5);
        doc.text(s.nombre, colX.nombre, y + 6.5);
        doc.text(s.categoria, colX.categoria, y + 6.5);
        doc.text(s.stock.toString(), colX.stock, y + 6.5);
        
        doc.text(`${s.precioUnitario} €`, colX.precio, y + 6.5);
        
        doc.text(s.rangoRequerido, colX.rango, y + 6.5);

        y += rowHeight;

        if (y > 270) {
          doc.addPage();
          y = 20; 
        }
      });

      doc.save('Manifiesto_Mision_Oficial.pdf');
    }
  }
}