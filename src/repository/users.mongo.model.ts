import { model, Schema } from 'mongoose';
import { User } from '../entities/user.models.js';

// Scheme es la definición de la estructura que van a tener los datos

export const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwd: {
    type: String,
    required: true,
  },
  // Esta última propiedad es opcional si tenemos la relación 1-n
  scrubs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Scrub',
    },
  ],
});

// Estos objectId no tienen contenido, para dárselo, utilizaremos populate para transformar un objectID en el contenido almacenado en la DB
// Es un método de mongooses

// Esto es un método para determinar la salida, en este caso la salida JSON, que transforma lo que le llega y devuelve un objeto
// Lo vamos a usar para modificar la llegada de los datos de _id y de __v que nos devuelve mongo
// Los passwd nunca deben retornarse con un get

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

// Modelo es un objeto que implementa el esquema para usarlo en la colección de mongo (crearla o modificarla)
// Todas nuestras operaciones las vamos a hacer contra el modelo

export const UserModel = model('User', userSchema, 'users');
