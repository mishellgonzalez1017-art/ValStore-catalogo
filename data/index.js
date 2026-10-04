import { accesorios } from './accesorios.js';
import { blusas } from './blusas.js';
import { sueteres } from './sueteres.js';
import { shorts } from './shorts.js';
import { trajesDeBano } from './trajes-de-bano.js';
import { pantalones } from './pantalones.js';
import { vestidos } from './vestidos.js';
import { hombre } from './hombre.js';
import { ninos } from './ninos.js';
import { normalizeProduct, warnCatalogIssues } from '../js/utils.js';

const allCollections = [
  accesorios,
  blusas,
  sueteres,
  shorts,
  trajesDeBano,
  pantalones,
  vestidos,
  hombre,
  ninos
];

export const prendas = allCollections
  .flat()
  .map((product) => normalizeProduct(product));

warnCatalogIssues(prendas);
