import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => 
        {
          //Sort the array before slicing and returning it
          this.heroes = heroes.sort((a, b) => b.rating - a.rating);
          this.heroes = heroes.slice(0, 4);
        });
        //Peu maintenable, il aurait mieux valu créer une fonction de tri
        //par note que tu aurais pu appeler sortByRatings(a:Hero, b:Hero): number
        //,de plus tu aurais pu typer tes paramètres pour augmenter la lisibilité et la propreté du code.
        // Le tout fonctionne néanmoins très bien. Bon travail d'implémentation.
  }
}
