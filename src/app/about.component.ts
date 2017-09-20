import { Component } from '@angular/core';

@Component({
    selector: 'about',
    template: `
    	<div style="padding: 16px" class="index-content">
    	<h1>SEZNÁMENÍ</h1>
    	Aplikace slouží pro tvorbu a sdílení grafických materiálů a dokumentů.
    	Aplikace umožnuje tvorbu šablon, podle kterých mohou ostatní dokumenty vytvářet. Běžné užívání by mělo vypadat asi takto.
    	<ul>
    	<li>Vytvořte šablonu v editoru šablon a uložte ji.
    	<li>Ostatní šablonu uvidí a mohou ji vyplnit a rovnou ji stáhnout jako PDF.
    	<li>Vytvořenou šablonu lze upravit. Upravy se promítnou ve všech dokumentech které z ní ostatní vytvořili.
    	</ul>
		<h1>TECHNICKE INFO</h1>
    	Tato aplikace byla vytvořena v rámci závěrečné práce na FI MU pro český skaut.
    	<br>
    	Aplikace je v testovacím provozu. Jediný podporovaný prohlížeč je Google Chrome (<a href="https://www.google.com/chrome/browser/desktop/index.html">zde ke stažení</a>).
    	V ostatních prohlížečích aplikace může ale také nemusí fungovat správně.
    	Zdrojový kod webového klienta lze nalézt <a href="https://github.com/PetrKonecny/template_app_client">zde</a>
    	Zdrojový kod webového serveru lze nalézt <a href="https://github.com/PetrKonecny/template_app_client">zde</a>
    	</div>
    `,
})
export class AboutComponent {


}