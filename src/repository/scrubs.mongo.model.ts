import { model, Schema, SchemaTypes } from 'mongoose';
import { Scrub } from '../entities/scrubs.models.js';

// Scheme es la definición de la estructura que van a tener los datos

const scrubSchema = new Schema<Scrub>({
  name: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
  },
  img: {},
  occupattion: {
    type: SchemaTypes.String,
    required: true,
  },
  personality: {},
  extendPerso: {},
});

// Modelo es un objeto que implementa el esquema para usarlo en la colección de mongo (crearla o modificarla)
// Todas nuestras operaciones las vamos a hacer contra el modelo

export const ScrubModel = model('Scrub', scrubSchema, 'scrubs');
