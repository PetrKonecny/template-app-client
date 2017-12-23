import { Component } from '@angular/core';

@Component({
    selector: 'about',
    template: `
        <main-toolbar></main-toolbar>
    	<div style="padding: 16px; box-sizing: border-box; overflow: auto;" class="index-content">
        <h1>APLIKACE PRO TVORBU DOKUMENTŮ</h1>
    	<div class="mat-elevation-z4 warn" >
        <md-icon>warning</md-icon>
        Důležité: tato verze aplikace v součastnosti funguje pouze v prohlížeči Google Chrome.
        </div>
        <div class="mat-elevation-z4 warn" >
        <md-icon>warning</md-icon>
        Důležité: toto je testovací verze aplikace a proto může obsahovat chyby.
        </div>
        <div class="mat-elevation-z4 warn-att">
        <md-icon>warning</md-icon>
        <div>pro přístup do aplikace musí být uživatel přihlášen. Jako testovací účet lze použít např. následující login: </div><div><ul><li><b>už. jmeno:</b> kraj.vary <li><b>heslo:</b> vary.Web2 </ul></div>
        </div>
        <div class="mat-elevation-z4 card">
        <h2>SEZNÁMENÍ</h2>
        Aplikace slouží pro tvorbu a sdílení grafických materiálů a dokumentů.
    	Aplikace umožnuje tvorbu šablon, podle kterých mohou ostatní dokumenty vytvářet. Běžné užívání by mělo vypadat asi takto.
    	<ul>
    	<li>Vytvořte šablonu v editoru šablon a uložte ji.
    	<li>Ostatní šablonu uvidí a mohou ji vyplnit a rovnou ji stáhnout jako PDF.
    	<li>Vytvořenou šablonu lze upravit. Upravy se promítnou ve všech dokumentech které z ní ostatní vytvořili.
    	</ul>
        Kromě toho lze: 
        <ul>
        <li>vytvářet vlastní dokumenty, z kterých nelze dělat šablony.
        <li>cizí šablony upravit podle sebe a vytvořit z nich nový dokument. 
		</ul>
        </div>
        <div class="mat-elevation-z4 card">
        <h2>TECHNICKE INFO</h2>
    	Tato aplikace byla vytvořena v rámci závěrečné práce na FI MU pro český skaut.
    	<br>
        <ul>
    	<li>Aplikace je v testovacím provozu. Jediný podporovaný prohlížeč je Google Chrome (<a href="https://www.google.com/chrome/browser/desktop/index.html">zde ke stažení</a>).
    	V ostatních prohlížečích aplikace může ale také nemusí fungovat správně.
    	<li>Zdrojový kód webového klienta lze nalézt <a href="https://github.com/PetrKonecny/template_app_client">zde</a>
    	<li>Zdrojový kód serveru lze nalézt <a href="https://github.com/PetrKonecny/template_app_client">zde</a>
    	</ul>
        </div>
        </div>
    `,
})
export class AboutComponent {


}