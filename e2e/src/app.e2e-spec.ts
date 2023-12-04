import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Tour of Heroes';
const expectedTitle = `${expectedH1}`;
const targetHero = { id: 15, name: 'Magneta' };
const targetHeroDashboardIndex = 1;
const nameSuffix = 'X';
const newHeroName = targetHero.name + nameSuffix;
const newCategoryName = "AntiHero";
const newRating = 3;
const newOriginalUniverse = "Campus Academy";
const newPowers = ["Fast learner","Awesome tester"];
const newWeaknesses = ["Anxious as hell","Too awesome"];


class Hero {
  id: number;
  name: string;

  // Factory methods

  // Hero from string formatted as '<id> <name>'.
  static fromString(s: string): Hero {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // Hero from hero list <li> element.
  static async fromLi(li: ElementFinder): Promise<Hero> {
      const stringsFromA = await li.all(by.css('a')).getText();
      const strings = stringsFromA[0].split(' ');
      return { id: +strings[0], name: strings[1] };
  }

  // Hero id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Hero> {
    // Get hero id from the first <div>
    const id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    const name = await detail.element(by.css('h2')).getText();
    return {
        id: +id.substr(id.indexOf(' ') + 1),
        name: name.substr(0, name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    const navElts = element.all(by.css('app-root nav a'));

    return {
      navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topHeroes: element.all(by.css('app-root app-dashboard > div h4')),

      appHeroesHref: navElts.get(1),
      appHeroes: element(by.css('app-root app-heroes')),
      allHeroes: element.all(by.css('app-root app-heroes li')),
      selectedHeroSubview: element(by.css('app-root app-heroes > div:last-child')),

      heroDetail: element(by.css('app-root app-hero-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Heroes'];
    it(`has views ${expectedViewNames}`, () => {
      const viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      const page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top heroes', () => {
      const page = getPageElts();
      expect(page.topHeroes.count()).toEqual(4);
    });

    const expectedHeroes = ['Deadpool', 'Magneta', 'Dynama', 'Dr IQ'];
    it('has sort top heroes ratings', () => {
      //DONE vérifier la présence des ratings sur le dashboard et que les 4 héros sont triés dans le bon ordre.
      const heroes = getPageElts().appDashboard.all(by.css('h4'));
      const ratings = getPageElts().appDashboard.all(by.css('label'));
      expect(heroes).toBeTruthy();  // check that we got heroes
      expect(ratings).toBeTruthy(); // check that we got ratings
      for(let i = 0; i < ratings.length; i++)
      {
        // expect ratings to be ordered from highest to lowest
        expect(Number(ratings[i].getText())).toBeGreaterThanOrEqual(Number(ratings[i+1].getText()));
      }
      for(let i = 0; i < heroes.length; i++)
      {
        // expect the heroes names to be what is in our list
        expect(Number(heroes[i].getText())).toEqual(expectedHeroes[i]);
      }
    });

    it(`selects and routes to ${targetHero.name} details`, dashboardSelectTargetHero);

    it(`updates hero name (${newHeroName}) in details view`, updateHeroNameInDetailView);

    it(`cancels and shows ${targetHero.name} in Dashboard`, () => {
      element(by.buttonText('go back')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetHeroElt = getPageElts().topHeroes.get(targetHeroDashboardIndex);
      expect(targetHeroElt.getText()).toEqual(targetHero.name);
    });

    it(`selects and routes to ${targetHero.name} details`, dashboardSelectTargetHero);

    it(`updates hero name (${newHeroName}) in details view`, updateHeroNameInDetailView);

    it(`saves and shows ${newHeroName} in Dashboard`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetHeroElt = getPageElts().topHeroes.get(targetHeroDashboardIndex);
      expect(targetHeroElt.getText()).toEqual(newHeroName);
    });

  });

  fdescribe('Heroes tests', () => {

    beforeAll(() => browser.get(''));

    fit('can switch to Heroes view', () => {
      getPageElts().appHeroesHref.click();
      const page = getPageElts();
      expect(page.appHeroes.isPresent()).toBeTruthy();
      expect(page.allHeroes.count()).toEqual(14, 'number of heroes');
    });

    const expectedHeroes = [ 11, 13, 12, 14, 15, 16, 17, 18, 19, 20 ];
    const expectedAntiHeroes = [ 23, 25 ];
    const expectedVillains = [ 22, 24 ];
    fit('has category filter', () => {
      //DONE vérifier la présence des filtres de category Hero AntiHero Villain et vérifier qu'ils fonctionnent tout les trois à la fois en décochant et en cochant
      //A la fin du test tout les filtres doivent être à l'état initial.

      // Count how many checkboxes are present
      expect(element.all(by.xpath('//input[@type="checkbox"]')).count()).toEqual(3);
      element.all(by.xpath('//input[@type="checkbox"]')).click(); // Uncheck all the checkboxes

      element.all(by.xpath('(//input[@type="checkbox"])[1]')).click();  // Only keep the first one
      browser.waitForAngular(); // wait for angular to show the list
      expectedHeroes.forEach(hero => {
        expect(getHeroLiEltById(hero).isPresent()).toBeTruthy();  // Compare against the list of heroes ids
      });
      element.all(by.xpath('(//input[@type="checkbox"])[1]')).click();  // Uncheck the first one
      element.all(by.xpath('(//input[@type="checkbox"])[2]')).click();  // Only keep the second one
      browser.waitForAngular();
      expectedAntiHeroes.forEach(antiHero => {
        expect(getHeroLiEltById(antiHero).isPresent()).toBeTruthy(); // Compare against the list of antiheroes ids
      });

      element.all(by.xpath('(//input[@type="checkbox"])[2]')).click(); // Uncheck the second one
      element.all(by.xpath('(//input[@type="checkbox"])[3]')).click(); // Only keep the third one
      browser.waitForAngular();
      expectedVillains.forEach(villain => {
        expect(getHeroLiEltById(villain).isPresent()).toBeTruthy(); // Compare against the list of villain ids
      });

      element.all(by.xpath('(//input[@type="checkbox"])[3]')).click();  // Uncheck the third one
      element.all(by.xpath('//input[@type="checkbox"]')).click(); // Re-check everything
    })

    it('can route to hero details', async () => {
      getHeroLiEltById(targetHero.id).click();

      const page = getPageElts();
      expect(page.heroDetail.isPresent()).toBeTruthy('shows hero detail');
      const hero = await Hero.fromDetail(page.heroDetail);
      expect(hero.id).toEqual(targetHero.id);
      expect(hero.name).toEqual(targetHero.name.toUpperCase());
    });

    it(`updates hero name (${newHeroName}), category (${newCategoryName}), rating (${newRating}), universe (${newOriginalUniverse}), 
      powers (${newPowers}), weaknesses (${newWeaknesses}) in details view`, () => {
      //DONE mettre à jour ce test pour qu'il mette à jour tout les details dans son intitulé et qu'il contrôle que les modifications 
      //ont bien été enregistrés en revenant dans son hero details.

      // Create let for each field used for this test
      let heroName = element(by.id('heroName'));
      let category = element(by.xpath('//input[@value="' + newCategoryName + '"]'));
      let ratingField = element(by.xpath('//input[@placeholder="rating"]'));
      let universeField = element(by.xpath('//input[@placeholder="universe"]'));
      let powerField = element(by.id('power'));
      let weaknessField = element(by.id('weakness'));

      // for each field replace the field with the new value
      heroName.clear().then(function() {
        heroName.sendKeys(newHeroName);
      });
      category.click(); // click on the new category
      ratingField.clear().then(function() {
        ratingField.sendKeys(newRating);
      });
      universeField.clear().then(function() {
        universeField.sendKeys(newOriginalUniverse);
      });
      // for each new power/weakness, fill in the field then click on the add button
      newPowers.forEach(newPower => {
        powerField.clear().then(function() {
          powerField.sendKeys(newPower);
          browser.findElement(by.buttonText('add power')).click();
        });
      });
      newWeaknesses.forEach(newWeakness => {
        weaknessField.clear().then(function() {
          weaknessField.sendKeys(newWeakness);
          browser.findElement(by.buttonText('add weakness')).click();
        });
      });

      //updateHeroNameInDetailView; // We do not need this anymore, since we click on save ourselves

      // click on save, wait for angular to load, then go back to the modified hero
      browser.findElement(by.buttonText('save')).click();
      browser.waitForAngular();
      getHeroLiEltById(targetHero.id).click();
      browser.waitForAngular();

      // check if each field contains the new value (in "ng-reflect-model" since Angular doesn't assume stuff by itself)
      expect(element(by.id('heroName')).getAttribute("ng-reflect-model")).toEqual(newHeroName);
      expect(element(by.xpath('//input[@value="' + newCategoryName + '"]')).getAttribute("ng-reflect-model")).toEqual(newCategoryName);
      expect(element(by.xpath('//input[@placeholder="rating"]')).getAttribute("ng-reflect-model")).toEqual(newRating.toString());
      expect(element(by.xpath('//input[@placeholder="universe"]')).getAttribute("ng-reflect-model")).toEqual(newOriginalUniverse);
      // for each list, check if the newPowers/newWeaknesses are in the list
      newPowers.forEach(power => {
        expect(element(by.xpath("//app-hero-detail/div/div[contains(string(), 'Powers: ')]")).getText()).toContain(power);
      });
      newWeaknesses.forEach(weakness => {
        expect(element(by.xpath("//app-hero-detail/div/div[contains(string(), 'Weaknesses: ')]")).getText()).toContain(weakness);
      });
    });

    it(`delete powers (${newPowers}), weaknesses (${newWeaknesses}) in details view`, () => {
      //DONE supprimer les nouveau pouvoirs et faiblesses ajoutés dans le précédent test, sauvegarder et revenir vérifier qu'ils ont bien été 
      //supprimés puis revenir à l'aide du bouton "goBack" sur Heroes

      // Search for the delete button using the power/weakness name, then the delete button using its class
      newPowers.forEach(power => {
        // Désolé Ludo, mais étrangement, je trouve les XPaths relativement simples x)
        element(by.xpath("//app-hero-detail/div/div/li[contains(string(), '" + power + "')]/button[@class='delete']")).click();
      });
      
      newWeaknesses.forEach(weakness => {
        // Du coup je m'excuse en avance pour cette horreur que tu ne souhaitera pas lire, oupsy :P
        element(by.xpath("//app-hero-detail/div/div/li[contains(string(), '" + weakness + "')]/button[@class='delete']")).click();
      });

      // for each list, check if the newPowers/newWeaknesses are NOT in the list
      newPowers.forEach(power => {
        expect(element(by.xpath("//app-hero-detail/div/div[contains(string(), 'Powers: ')]")).getText()).not.toContain(power);
      });
      newWeaknesses.forEach(weakness => {
        expect(element(by.xpath("//app-hero-detail/div/div[contains(string(), 'Weaknesses: ')]")).getText()).not.toContain(weakness);
      });
    });

    it(`shows ${newHeroName} in Heroes list`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();
      const expectedText = `${targetHero.id} ${newHeroName}`;
      expect(getHeroAEltById(targetHero.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newHeroName} from Heroes list`, async () => {
      const heroesBefore = await toHeroArray(getPageElts().allHeroes);
      const li = getHeroLiEltById(targetHero.id);
      li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(page.appHeroes.isPresent()).toBeTruthy();
      expect(page.allHeroes.count()).toEqual(13, 'number of heroes');
      const heroesAfter = await toHeroArray(page.allHeroes);
      // console.log(await Hero.fromLi(page.allHeroes[0]));
      const expectedHeroes =  heroesBefore.filter(h => h.name !== newHeroName);
      expect(heroesAfter).toEqual(expectedHeroes);
      // expect(page.selectedHeroSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetHero.name}`, async () => {
      const addedHeroName = 'Alice';
      const heroesBefore = await toHeroArray(getPageElts().allHeroes);
      const numHeroes = heroesBefore.length;

      element(by.css('input')).sendKeys(addedHeroName);
      element(by.buttonText('add')).click();

      const page = getPageElts();
      const heroesAfter = await toHeroArray(page.allHeroes);
      expect(heroesAfter.length).toEqual(numHeroes + 1, 'number of heroes');

      expect(heroesAfter.slice(0, numHeroes)).toEqual(heroesBefore, 'Old heroes are still there');

      const maxId = heroesBefore[heroesBefore.length - 1].id;
      expect(heroesAfter[numHeroes]).toEqual({id: maxId + 1, name: addedHeroName});
    });

    it('displays correctly styled buttons', async () => {
      element.all(by.buttonText('x')).then(buttons => {
        for (const button of buttons) {
          // Inherited styles from styles.css
          expect(button.getCssValue('font-family')).toBe('Arial');
          expect(button.getCssValue('border')).toContain('none');
          expect(button.getCssValue('padding')).toBe('5px 10px');
          expect(button.getCssValue('border-radius')).toBe('4px');
          // Styles defined in heroes.component.css
          expect(button.getCssValue('left')).toBe('194px');
          expect(button.getCssValue('top')).toBe('-32px');
        }
      });

      const addButton = element(by.buttonText('add'));
      // Inherited styles from styles.css
      expect(addButton.getCssValue('font-family')).toBe('Arial');
      expect(addButton.getCssValue('border')).toContain('none');
      expect(addButton.getCssValue('padding')).toBe('5px 10px');
      expect(addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive hero search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      getPageElts().searchBox.sendKeys('Ma');
      browser.sleep(1000);

      expect(getPageElts().searchResults.count()).toBe(6);
    });

    it(`continues search with 'g'`, async () => {
      getPageElts().searchBox.sendKeys('g');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetHero.name}`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      const page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      const hero = page.searchResults.get(0);
      expect(hero.getText()).toEqual(targetHero.name);
    });

    it(`navigates to ${targetHero.name} details view`, async () => {
      const hero = getPageElts().searchResults.get(0);
      expect(hero.getText()).toEqual(targetHero.name);
      hero.click();

      const page = getPageElts();
      expect(page.heroDetail.isPresent()).toBeTruthy('shows hero detail');
      const hero2 = await Hero.fromDetail(page.heroDetail);
      expect(hero2.id).toEqual(targetHero.id);
      expect(hero2.name).toEqual(targetHero.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetHero() {
    const targetHeroElt = getPageElts().topHeroes.get(targetHeroDashboardIndex);
    expect(targetHeroElt.getText()).toEqual(targetHero.name);
    targetHeroElt.click();
    browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    const page = getPageElts();
    expect(page.heroDetail.isPresent()).toBeTruthy('shows hero detail');
    const hero = await Hero.fromDetail(page.heroDetail);
    expect(hero.id).toEqual(targetHero.id);
    expect(hero.name).toEqual(targetHero.name.toUpperCase());
  }

  async function updateHeroNameInDetailView() {
    // Assumes that the current view is the hero details view.
    addToHeroName(nameSuffix);

    const page = getPageElts();
    const hero = await Hero.fromDetail(page.heroDetail);
    expect(hero.id).toEqual(targetHero.id);
    expect(hero.name).toEqual(newHeroName.toUpperCase());
  }

});

function addToHeroName(text: string): promise.Promise<void> {
  const input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    const hTag = `h${hLevel}`;
    const hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
}

function getHeroAEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getHeroLiEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toHeroArray(allHeroes: ElementArrayFinder): Promise<Hero[]> {
  const promisedHeroes = await allHeroes.map(Hero.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return Promise.all(promisedHeroes) as Promise<any>;
}
