import { TemplateAppClientPage } from './app.po';

describe('template-app-client App', function() {
  let page: TemplateAppClientPage;

  beforeEach(() => {
    page = new TemplateAppClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
