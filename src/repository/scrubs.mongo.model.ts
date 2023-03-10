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
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
  },
});

// Esto es un método para determinar la salida, en este caso la salida JSON, que transforma lo que le llega y devuelve un objeto
// Lo vamos a usar para modificar la llegada de los datos de _id y de __v que nos devuelve mongo

scrubSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Modelo es un objeto que implementa el esquema para usarlo en la colección de mongo (crearla o modificarla)
// Todas nuestras operaciones las vamos a hacer contra el modelo

export const ScrubModel = model('Scrub', scrubSchema, 'scrubs');
