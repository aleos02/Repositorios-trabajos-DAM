import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonModal } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';



@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class HomePage implements OnInit {
  @ViewChild('modal') modal!: IonModal;
  @ViewChild('modalEdit') modalEdit!: IonModal;
  newTitle: string = '';
  category: string = '';
  task: Task = {id: 0, name: '', quantity: 0, category_id: 0};
  categoriaButtons = [{text: 'Cerrar'},{text: 'Añadir', handler: (texto:any)=>{
      if(texto.nombre&&texto.nombre.trim()!=='')
        this.taskService.addCategoria(texto.nombre);
      else return false;
      return true;
  }}];
  categoriaInputs = [{name: 'nombre', placeholder: 'Nombre de la categoría'}];

  seccion: string = 'items';

  constructor(public taskService: TaskService) { }

  async ngOnInit() {
    await this.taskService.initializeFull();
    //JUSTO TENGO ESTA LINEA AQUI PARA REINICIAR LOS DATOS
    //await this.taskService.resetTotal();
    await this.taskService.insertTask(); 
    await this.taskService.loadTasks();
   }

   async cargarDatos() {
    const res = await this.taskService.loadTasks();
  }

  async busqueda(event: any) {
    const texto = event.target.value;
    if(texto && texto.trim()!==''){
      await this.taskService.buscarObjetos(texto);
    } else {
      await this.taskService.loadTasks();
    }
  }

  async deleteTask(id: number) {
    await this.taskService.deleteTask(id);
  }

  async subirStock(item: Task) {
    await this.taskService.subirStock(item);
  }

  async bajarStock(item: Task) {
    await this.taskService.bajarStock(item);
  }

  async guardarCambios() {
    await this.taskService.addTask(this.task.name, this.task.quantity, this.task.category_id);
    this.task =  {id: 0, name: '', quantity: 0, category_id: 0};
    this.modal.dismiss();
  }

  async cancel(){
    this.modal.dismiss();
    this.modalEdit.dismiss();
    this.task =  {id: 0, name: '', quantity: 0, category_id: 0};
  }

  async editTask(id: number) {
    if (this.task.id) {
    await this.taskService.updateTask(this.task);
    await this.modalEdit.dismiss();
    this.task = { id: 0, name: '', quantity: 0, category_id: 0 };
    }
  }

  async abrirEditar(seleccionada: Task) {
    this.task = { ...seleccionada };
    this.modalEdit.present();
  }

  async cambiarSeccion(event: any) {
    this.seccion = event.detail.value;
  }

  async eliminarCategoria(cat: any) {
    await this.taskService.deleteCategoria(cat.id);
  }
}
