import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  hero: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  //TODO: refactor this so we can use both add and 
  //remove for powers and weaknesses

  //Push new power to the array
  addPower(name: string): void {
    this.hero.powers.push(name);
  }  

  //Remove power located at 'index' in the array
  removePower(index: number): void{
    this.hero.powers.splice(index, 1);
  }
  
  //Push new weakness to the array
  addWeakness(name: string): void {
    this.hero.weaknesses.push(name);
  }

//Remove weakness located at 'index' in the array
  removeWeakness(index: number): void{
    this.hero.weaknesses.splice(index, 1);
  }

  save(): void {
    //rating cannot go outside of 0 < x < 5
    //if(this.hero.rating > 5) {this.hero.rating = 5}
    //if(this.hero.rating < 0) {this.hero.rating = 0}
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }
}
