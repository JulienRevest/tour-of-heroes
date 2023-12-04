import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { HeroService } from "../hero.service";
import { HeroDetailComponent } from "./hero-detail.component";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";
import { browser, element } from 'protractor';

fdescribe("HeroDetailComponent", () => {

    let component: HeroDetailComponent;
    let fixture: ComponentFixture<HeroDetailComponent>;

    beforeEach(() => {
        const activatedRouteStub = () => ({
            snapshot: { paramMap: { get: () => ({}) } }
        });
        const locationStub = () => ({ back: () => ({}) });
        const heroServiceStub = () => ({
            getHero: id => ({
                subscribe: f => f({})
            }),
            updateHero: hero => ({ subscribe: f => f({}) })
        });
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [FormsModule],
            declarations: [HeroDetailComponent],
            providers: [
                { provide: ActivatedRoute, useFactory: activatedRouteStub },
                { provide: Location, useFactory: locationStub },
                { provide: HeroService, useFactory: heroServiceStub }
            ]
        });
        fixture = TestBed.createComponent(HeroDetailComponent);
        component = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit", () => {
        it("makes expected calls", () => {
            //DONE vérifier qu'à l'appel de ngOnInit getHero est appelée
            const heroServiceStub: HeroService = fixture.debugElement.injector.get(
                HeroService
            );
            spyOn(heroServiceStub, "getHero").and.callThrough();    // spy on getHero so when we
            component.ngOnInit();   // call ngOnInit, we know that getHero was called
            expect(heroServiceStub.getHero).toHaveBeenCalled();
        });
    });

    describe("getHero", () => {
        it("makes expected calls", () => {
            const heroServiceStub: HeroService = fixture.debugElement.injector.get(
                HeroService
            );
            spyOn(heroServiceStub, "getHero").and.callThrough();
            component.getHero();
            expect(heroServiceStub.getHero).toHaveBeenCalled();
        });
    });

    describe("goBack", () => {
        it("makes expected calls", () => {
            const locationStub: Location = fixture.debugElement.injector.get(
                Location
            );
            spyOn(locationStub, "back").and.callThrough();
            component.goBack();
            expect(locationStub.back).toHaveBeenCalled();
        });
    });

    describe("save", () => {
        it("makes expected calls", () => {
            const heroServiceStub: HeroService = fixture.debugElement.injector.get(
                HeroService
            );
            spyOn(component, "goBack").and.callThrough();
            spyOn(heroServiceStub, "updateHero").and.callThrough();
            component.save();
            expect(component.goBack).toHaveBeenCalled();
            expect(heroServiceStub.updateHero).toHaveBeenCalled();
        });
    });

    describe("Without a hero", () => {
        it("Doesn't display anything", () => {
            const heroServiceStub = TestBed.inject(HeroService);
            spyOn(heroServiceStub, "getHero").and.returnValue(of(undefined));
            fixture.detectChanges();
            const anyDiv = fixture.debugElement.query(By.css("div"));
            expect(anyDiv).toBeFalsy();
        });
    });

    describe("With hero", () => {
        beforeEach(() => {
            const hero = { id: 15, name: 'Magneta', category: 'Hero', rating: 2, universe: "Angular", powers: ["Being alive", "Day to day life", "He doesn't know"], weaknesses: ["Waking up"] }
            const heroServiceStub = TestBed.inject(HeroService);
            spyOn(heroServiceStub, "getHero").and.returnValue(
                of(hero)
            );
            fixture.detectChanges();
        });

        it("Displays content when initialized with a hero", () => {
            //DONE Vérifier que quelque chose s'affiche
            const details: HTMLHeadingElement = fixture.debugElement.query(
                By.css("div")   // if a div is present, we got a hero
            ).nativeElement;
            expect(details.textContent).toBeTruthy();
        });

        it("Has header with hero name in uppercase", () => {
            const header: HTMLHeadingElement = fixture.debugElement.query(
                By.css("h2")
            ).nativeElement;
            expect(header.textContent).toContain("MAGNETA Details");
        });

        it("Shows hero id", () => {
            const div: HTMLDivElement = fixture.debugElement.query(
                By.css("div div") // first inner div
            ).nativeElement;
            expect(div.textContent).toContain("id: 15");
        });

        it("Has input box with the name", async () => {
            await fixture.whenStable();
            const input: HTMLInputElement = fixture.debugElement.query(
                By.css("input")
            ).nativeElement;
            expect(input.value).toBe("Magneta");
        });

        it("Calls location.back() when go back button is clicked", () => {
            //DONE Verifier que lors du click sur le bouton "go back", la méthode goBack est appelée
            const button: HTMLButtonElement = fixture.debugElement.query(
                By.css("#goBack")   // goBack button
            ).nativeElement;
            spyOn(component, 'goBack'); // spy on the goBack function
            button.click();             // so we can know it has been called
            expect(component.goBack).toHaveBeenCalled();
        });

        it("Updates hero property when user types on the input", () => {
            const input: HTMLInputElement = fixture.debugElement.query(
                By.css("#heroName")
            ).nativeElement;
            input.value = "ABC";
            input.dispatchEvent(new Event("input"));
            fixture.detectChanges();
            expect(component.hero.name).toBe("ABC");
        });

        it("Updates hero then goes back when save button is clicked", () => {
            const heroServiceStub = TestBed.inject(HeroService);
            spyOn(heroServiceStub, "updateHero").and.returnValue(of(undefined));
            const locationStub = TestBed.inject(Location);
            spyOn(locationStub, "back");
            const button: HTMLButtonElement = fixture.debugElement.queryAll(
                By.css("#save")
            )[0].nativeElement; // second button
            button.click();
            expect(heroServiceStub.updateHero).toHaveBeenCalledWith(component.hero);
            expect(locationStub.back).toHaveBeenCalled();
        });
    });
});
