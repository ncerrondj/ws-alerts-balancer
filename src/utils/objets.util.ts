export class ObjectUtils {

    static deepEqual(obj1: any, obj2: any): boolean {
        // Mismo valor o misma referencia
        if (obj1 === obj2) return true;

        // Si alguno no es objeto o es null
        if (
            typeof obj1 !== 'object' || obj1 === null ||
            typeof obj2 !== 'object' || obj2 === null
        ) {
            return false;
        }

        // Arrays
        if (Array.isArray(obj1) !== Array.isArray(obj2)) {
            return false;
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // Distinta cantidad de propiedades
        if (keys1.length !== keys2.length) return false;

        // Comparar cada propiedad
        for (const key of keys1) {
            if (!keys2.includes(key)) return false;

            if (!ObjectUtils.deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }
}
