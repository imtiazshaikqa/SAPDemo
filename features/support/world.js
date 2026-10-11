const { setWorldConstructor } = require('@cucumber/cucumber');

class PlaywrightWorld {
  constructor() {
    this.browser = undefined;
    this.context = undefined;
    this.page = undefined;
    this.popup = undefined;
    this.submittedApplications = [];
  }
}

setWorldConstructor(PlaywrightWorld);
