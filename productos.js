import { accesorios } from './productos/accesorios.js';
import { blusas } from './productos/blusas.js';
import { sueteres } from './productos/sueteres.js';
import { shorts } from './productos/shorts.js';
import { trajesDeBano } from './productos/trajes-de-bano.js';
import { pantalones } from './productos/pantalones.js';
import { vestidos } from './productos/vestidos.js';
import { hombre } from './productos/hombre.js';
import { ninos } from './productos/ninos.js';

export const prendas = [
    ...accesorios,
    ...blusas,
    ...sueteres,
    ...shorts,
    ...trajesDeBano,
    ...pantalones,
    ...vestidos,
    ...hombre,
    ...ninos
];
