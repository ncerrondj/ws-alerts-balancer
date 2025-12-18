export class DbUtils {
  static booleanHandler(bool: boolean) {
    const boolValue = bool ? 1 : 0;
    return [undefined, null].includes(bool) ? null : boolValue;
  }
  static spParamBooleanHandler(bool: boolean) {
    if([true, false].includes(bool)) {
      return bool ? 1 : 0;
    }
    return bool;
  }
  //convertidor de datos al obtener data del sp
  static normalizeRow(row: any) {
    if(!row) return null;
    const result: any = {};
    for (const [key, value] of Object.entries(row)) {
      if (Buffer.isBuffer(value) && value.length === 1) {
        result[key] = value[0] === 1; // true / false
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  static toValidDate(date: string | Date): string | null {
    if (!date) return null;

    let d: Date;
    if (typeof date === "string") {
      d = new Date(date); // ISO en UTC
    } else {
      d = date;
    }

    // Obtener timestamp en ms y restar 5 horas (UTC-5)
    const limaTime = new Date(d.getTime() - 5 * 60 * 60 * 1000);

    const year = limaTime.getUTCFullYear();
    const month = String(limaTime.getUTCMonth() + 1).padStart(2, "0");
    const day = String(limaTime.getUTCDate()).padStart(2, "0");
    const hours = String(limaTime.getUTCHours()).padStart(2, "0");
    const minutes = String(limaTime.getUTCMinutes()).padStart(2, "0");
    const seconds = String(limaTime.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  static toJsonDate(val: string | null) {
    if (!val) return val;
    const date = new Date(val.replace(' ', 'T').concat('-05:00'));
    return date.toJSON();
  }
  
  /**
   * '31/12/2025 => '2025-12-31'
   */
  static toMysqlDate(date: string) {
      if (!date) return null;

    const [day, month, year] = date.split('/');

    if (!day || !month || !year) return '';

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  /**
   * '2025-12-31' => '31/12/2025'
   */
  static toNormalDate(date: string){
    if (!date) return null;

    const [year, month, day] = date.split('-');

    if (!year || !month || !day) return '';

    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }

  /**
   * '13:40:00' => '13:40'
   */
  static toBasicHour(hour: string) {
    if (!hour) return null;

    const parts = hour.split(':');

    if (parts.length < 2) return null;

    const [h, m] = parts;

    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
  }
}