import { Injectable, Logger } from '@nestjs/common';
import * as schedule from 'node-schedule';


@Injectable()
export class TaskService {
  private jobs: Map<string, schedule.Job> = new Map();
  private readonly logger = new Logger(TaskService.name);
  program(id: string, date: Date, func: () => Promise<any>) {
    if (this.jobs.has(id)){
      this.logger.warn(`Se intento la tarea con id ${id} pero ya existía`);
      return;
    }
    const now = Date.now();
    if (date.getTime() <= now) {
      this.logger.warn(`Tarea con id '${id}' tiene fecha/hora menor al tiempo actual (${date.toLocaleString()}), ejecutando ahora`);
      // Ejecuta inmediatamente
      func();
      return;
    }
    const job = schedule.scheduleJob(date, async () => {
      await func()
      this.jobs.delete(id);
    });
    this.jobs.set(id, job);
    this.logger.log(`Tarea con id '${id}' programada para ${date.toLocaleString('es-PE', { timeZone: 'America/Lima' })}`);
  }
  cancel(id: string) {
    const job = this.jobs.get(id);
    if (!job) {
      this.logger.warn(`No existe tarea con id '${id}' para cancelar`);
      return false;
    }
    job.cancel();
    this.jobs.delete(id);
    this.logger.log(`Tarea ${id} cancelada`);
    return true;
  }
  list() {
    return Array.from(this.jobs.keys());
  }
}