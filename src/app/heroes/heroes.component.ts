import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  //By default, we want to see every type of characters
  //If a checkbox is checked, the corresponding value will change here
  filter = {hero: true, antihero: true, villain: true };

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => {
      this.heroes = heroes;
      //On the list we get back from the db, filter the character depending on which
      //checkbox is checked
      this.heroes = this.heroes.filter(heroes=> (heroes.category === 'Hero' && this.filter.hero)
      || (heroes.category === 'AntiHero' && this.filter.antihero)
      || (heroes.category === 'Villain' && this.filter.villain)
      );
    });
  }

  //Default values for all elements of the character
  add(name: string, category: string = "Hero", rating: number = 0,
   universe: string= "DC", powers: string[] = [""], weaknesses: string[] = [""]): void {
    name = name.trim();
    category = category.trim();
    universe = universe.trim();
    if (!name) { return; }
    if (!category) { return; }
    this.heroService.addHero({ name, category, rating, universe, powers, weaknesses } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}
