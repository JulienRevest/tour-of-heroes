import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import { Hero } from './hero';

const mockData = [
  { id: 1, name: 'Hulk' },
  { id: 2, name: 'Thor' },
  { id: 3, name: 'Iron Man' }
] as Hero[];

describe('Hero Service', () => {

  let heroService;
  let httpTestingController: HttpTestingController;
  let mockHeroes;
  let mockHero;
  let mockId;


  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [HeroService, MessageService]
    });
    httpTestingController = TestBed.get(HttpTestingController);

    mockHeroes = [...mockData];
    mockHero = mockHeroes[0];
    mockId = mockHero.id;
    heroService = TestBed.get(HeroService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(heroService).toBeTruthy();
  });

  describe('getHeroes', () => {
    it('should return mock heroes', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.getHeroes().subscribe(
        heroes => expect(heroes.length).toEqual(mockHeroes.length),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(heroService.heroesUrl);
      expect(req.request.method).toEqual('GET');
      // Respond with the mock heroes
      req.flush(mockHeroes);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual('HeroService: fetched heroes');
    });

    it('should turn 404 into a user-friendly error', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      const msg = 'Deliberate 404';
      heroService.getHeroes().subscribe(
        heroes => expect(heroes).toEqual([]),
        fail
      );

      const req = httpTestingController.expectOne(heroService.heroesUrl);
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(heroService.handleError).toHaveBeenCalledTimes(1);
      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: getHeroes failed: Http failure response for ${heroService.heroesUrl}: 404 Bad Request`);
    });
  });

  describe('getHero', () => {

    it('should return a single mock hero', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.getHero(mockHero.id).subscribe(
        response => expect(response).toEqual(mockHero),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/${mockHero.id}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the mock heroes
      req.flush(mockHero);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: fetched hero id=${mockHero.id}`);
    });

    it('should fail gracefully on error', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.getHero(mockHero.id).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/${mockHero.id}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the mock heroes
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(heroService.handleError).toHaveBeenCalledTimes(1);
      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: getHero id=${mockHero.id} failed: Http failure response for ${heroService.heroesUrl}/${mockHero.id}: 404 Bad Request`);
    });
  });

  describe('getHeroNo404', () => {

    it('should return a single mock hero', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.getHeroNo404(mockHero.id).subscribe(
        //Fails: Unable to flush and recognise mockHero
        response => expect(response).toEqual(mockHero),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/?id=${mockHero.id}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the mock heroes
      req.flush(mockHeroes);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: fetched hero id=${mockHero.id}`);
    });

    it('should fail gracefully with undefined when id not found', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.getHeroNo404(mockHero.id).subscribe(
        //Fails: Unable to flush and recognise mockHero
        response => expect(response).toBeUndefined(),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/?id=${mockHero.id}`);
      expect(req.request.method).toEqual('GET');
      // Flushing a object not of type array causes unexpeced behaviour?
      req.flush(mockHero);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: did not find hero id=${mockHero.id}`);
    });

    it('should fail gracefully on error', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.getHeroNo404(mockHero.id).subscribe(
        heroes => expect(heroes).toBeUndefined(),
        fail
      );

      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/?id=${mockHero.id}`);
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(heroService.handleError).toHaveBeenCalledTimes(1);
      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: getHero id=${mockHero.id} failed: Http failure response for ${heroService.heroesUrl}/?id=${mockHero.id}: 404 Bad Request`);
    });
  });

  describe('addHero', () => {

    it('should add a single Hero', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.addHero(mockHero).subscribe(
        response => expect(response).toEqual(mockHero),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}`);
      expect(req.request.method).toEqual('POST');
      // Respond with the mock heroes
      req.flush(mockHero);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: added hero w/ id=${mockHero.id}`);
    });

    it('should fail gracefully on error', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.addHero(mockHero).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}`);
      expect(req.request.method).toEqual('POST');
      // Respond with the mock heroes
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(heroService.handleError).toHaveBeenCalledTimes(1);
      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: addHero failed: Http failure response for api/heroes: 404 Bad Request`);
    });
  });

  describe('updateHero', () => {
    it('should update hero', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.updateHero(mockHero).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );

      // Receive PUT request
      const req = httpTestingController.expectOne(heroService.heroesUrl);
      expect(req.request.method).toEqual('PUT');
      // Respond with the updated hero
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(heroService.handleError).toHaveBeenCalledTimes(1);
      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: updateHero failed: Http failure response for ${heroService.heroesUrl}: 404 Bad Request`);
    });

    it('should fail gracefully on error', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.updateHero(mockHero).subscribe(
        response => expect(response).toEqual(mockHero),
        fail
      );

      // Receive PUT request
      const req = httpTestingController.expectOne(heroService.heroesUrl);
      expect(req.request.method).toEqual('PUT');
      // Respond with the updated hero
      req.flush(mockHero);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: updated hero id=${mockHero.id}`);
    });
  });

  describe('deleteHero', () => {

    it('should delete hero using id', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.deleteHero(mockId).subscribe(
        response => expect(response).toEqual(mockId),
        fail
      );
      // Receive DELETE request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/${mockHero.id}`);
      expect(req.request.method).toEqual('DELETE');
      // Respond with the updated hero
      req.flush(mockId);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: deleted hero id=${mockHero.id}`);
    });

    it('should delete hero using hero object', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.deleteHero(mockHero).subscribe(
        response => expect(response).toEqual(mockHero.id),
        fail
      );
      // Receive DELETE request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/${mockHero.id}`);
      expect(req.request.method).toEqual('DELETE');
      // Respond with the updated hero
      req.flush(mockHero.id);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: deleted hero id=${mockHero.id}`);
    });
  });

  describe('searchHero', () => {
    it('should find heroes matching the search criteria', () => {
      const searchTerm = 'r'
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.searchHeroes(searchTerm).subscribe(
        response => expect(response).toEqual([mockHeroes[1], mockHeroes[2]]),
        fail
      );

      // Receive PUT request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/?name=${searchTerm}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the updated hero
      req.flush([mockHeroes[1], mockHeroes[2]]);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: found heroes matching "${searchTerm}"`);
    });

    it('should not find heroes matching the search criteria', () => {
      const searchTerm = 'f'
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.searchHeroes(searchTerm).subscribe(
        response => expect(response).toEqual([]),
        fail
      );

      // Receive PUT request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/?name=${searchTerm}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the updated hero
      req.flush([]);

      expect(heroService.log).toHaveBeenCalledTimes(1);
      expect(heroService.messageService.messages[0]).toEqual(`HeroService: no heroes matching "${searchTerm}"`);
    });


    it('should return an empty array when passing an empty search string', () => {
      const searchTerm = '';
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.searchHeroes(searchTerm).subscribe(
        response => expect(response).toEqual([]),
        fail
      );

      // Receive PUT request
      const req = httpTestingController.expectNone(`${heroService.heroesUrl}/?name=${searchTerm}`);

      //This is the exception where handleError is not called. The execution path ends before the httpClient is called.
      expect(heroService.handleError).not.toHaveBeenCalled();
      expect(heroService.log).not.toHaveBeenCalled();
    });

    it('should fail gracefully on error', () => {
      const searchTerm = 'r';
      spyOn(heroService, 'log').and.callThrough();

      heroService.searchHeroes(searchTerm).subscribe(
        response => expect(response).toEqual([]),
        fail
      );

      // Receive PUT request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/?name=${searchTerm}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the updated hero
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(heroService.messageService.messages[0]).toEqual(`HeroService: searchHeroes failed: Http failure response for ${heroService.heroesUrl}/?name=${searchTerm}: 404 Bad Request`);
    });
  });

  describe('handleError', () => {
    it('should handle error gracefully', () => {

      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();
      spyOn(console, 'error');

      heroService.getHero(mockHero.id).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );
      // Receive GET request
      const req = httpTestingController.expectOne(`${heroService.heroesUrl}/${mockHero.id}`);
      expect(req.request.method).toEqual('GET');
      // Respond with the mock heroes
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });


      //The focal point of this test
      expect(heroService.handleError).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(heroService.log).toHaveBeenCalledTimes(1);
    });
  });
});
