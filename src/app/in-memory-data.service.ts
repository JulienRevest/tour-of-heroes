import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 11, name: 'Dr Nice', category: 'Hero', rating: 2, universe:"Angular", powers:["Being nice to others"], weaknesses: ["Mean people"] },
      { id: 12, name: 'Narco', category: 'Hero', rating: 1, universe:"Angular", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] },
      { id: 13, name: 'Bombasto', category: 'Hero', rating: 0, universe:"Angular", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] },
      { id: 14, name: 'Celeritas', category: 'Hero', rating: 2, universe:"Angular", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] },
      { id: 15, name: 'Magneta', category: 'Hero', rating: 4, universe:"Angular", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] },
      { id: 16, name: 'RubberMan', category: 'Hero', rating: 2, universe:"4 incredibles", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] },
      { id: 17, name: 'Dynama', category: 'Hero', rating: 4, universe:"DC", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] },
      { id: 18, name: 'Dr IQ', category: 'Hero', rating: 3, universe:"DC", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] },
      { id: 19, name: 'Magma', category: 'Hero', rating: 3, universe:"DC", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"]},
      { id: 20, name: 'Tornado', category: 'Hero', rating: 1, universe:"Marvel", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] },
      { id: 21, name: 'BadMan', category: 'Antihero', rating: 3, universe:"DC", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] },
      { id: 22, name: 'SuperBadMan', category: 'Villain', rating: 2, universe:"Marvel", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] },
      { id: 23, name: 'Deadpool', category: 'AntiHero', rating: 5, universe:"His own", powers:["Physically cannot die", "4th wall breaking"], weaknesses: ["What weaknesses? I'm Deadpool, I'm inviting myself in your code buddy, you cannot stop me!"] },
      { id: 24, name: 'Luther', category: 'Villain', rating: 1, universe:"DC", powers:["Being rich", "Wide"], weaknesses: ["Batman"] },
      { id: 25, name: 'Dunnotbh', category: 'AntiHero', rating: 2, universe:"IRL", powers:["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] }
    ];
    return {heroes};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }
}
