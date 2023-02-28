/* eslint-disable no-unused-vars */
import fs from 'fs/promises';
import { Scrub } from '../entities/scrubs.models.js';
import { Repo } from './repo.interface';

const file = 'data/scrubs.json';

export class ScrubsFileRepo implements Repo<Scrub> {
  async query() {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data);
  }

  async queryById(id: Scrub['id']): Promise<Scrub> {
    const data = await fs.readFile(file, 'utf-8');
    const parsedData: Scrub[] = JSON.parse(data);
    const finalData = parsedData.find((item) => item.id === id);
    if (!finalData) throw new Error('Id not found');
    return finalData;
  }

  async create(info: Partial<Scrub>): Promise<Scrub> {
    const data = await fs.readFile(file, 'utf-8');
    const parsedData: Scrub[] = JSON.parse(data);
    // info.id = Math.max(...parsedData.map((item) => item.id)) + 1;

    const finalData = JSON.stringify([...parsedData, info]);
    await fs.writeFile(file, finalData, 'utf-8');
    const resp = await fs.readFile(file, 'utf-8');
    // Esto falla, pero no lo vamos a resolver de momento porque en BBDD no tendremos este problema. Lo resolvemos con aserción de tipo
    return info as Scrub;
  }

  async update(info: Scrub): Promise<Scrub> {
    if (!info.id) throw new Error('Not valid data');
    const data = await fs.readFile(file, 'utf-8');
    const parsedData: Scrub[] = JSON.parse(data);
    let updatedItem: Scrub = {} as Scrub;

    const finalData = JSON.stringify(
      parsedData.map((item) => {
        if (item.id === info.id) {
          updatedItem = { ...item, ...info };
          return updatedItem;
        }

        return item;
      })
    );
    if (!info.id) throw new Error('Not valid data');

    await fs.writeFile(file, finalData, 'utf-8');

    return updatedItem;
  }

  async destroy(id: Scrub['id']) {
    const data = await fs.readFile(file, 'utf-8');
    const parsedData: Scrub[] = JSON.parse(data);
    const index = parsedData.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Id not found');
    const finalData = JSON.stringify(parsedData.slice(index));
    await fs.writeFile(file, finalData, 'utf-8');

    // Este método no nos permite saber si no hemos borrado algo
    // const finalData = JSON.stringify(
    //   parsedData.filter((item) => item.id !== id)
    // );
  }
}
