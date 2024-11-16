const ejs = require('ejs');
const util = require('util');
const { logger } = require('../../middleware/logger.js');


class Templates {
  /**
   * Initializes a new instance of the class.
  *
  * This constructor promisifies the `ejs.renderFile` function using the `util.promisify` method.
  * The promisified function is then assigned to the `renderFile` property of the instance.
  *
  * @return {void}
  */
  constructor () {
    this.renderFile = util.promisify(ejs.renderFile);
    this.year = new Date().getFullYear();
  };

  /**
   * Renders a welcome template with the given username.
   *
   * @param {string} username - The username to be included in the template.
   * @return {Promise<string>} A Promise that resolves to the rendered template.
   */
  async renderWelcomeTemplate(username) {
    // Define the data
    const welcome = {
      username: username,
      companyName: 'ImadeCorp Ltd',
      productName: 'OVIDOT',
      productUrl: process.env.APP_DOMAIN,
      forgetPasswordUrl: `${process.env.APP_DOMAIN}/forget-password`,
      supportEmail: "support@ovidot.com",
      year: this.year,
      loginUrl: `${process.env.APP_DOMAIN}/login`
    }

    try {
      const result = await this.renderFile('./v1/services/views/welcome.ejs', welcome);
      return result;
    } catch(err) {
      logger.error(err);
    }
  };

  /**
   * Renders a deactivation template with the given username.
   *
   * @param {string} username - The username to be included in the template.
   * @return {Promise<string>} A Promise that resolves to the rendered template.
   */
  async renderDeactivationTemplate(username) {
    // Define the data
    const deactivate = {
      username: username,
      companyName: 'ImadeCorp Ltd',
      productName: 'OVIDOT',
      productUrl: process.env.APP_DOMAIN,
      supportEmail: `support@${process.env.APP_DOMAIN.slice(8)}`,
      year: this.year,
    }

    try {
      const result = await this.renderFile('./v1/services/views/deactivate.ejs', deactivate);
      return result;
    } catch(err) {
      logger.error(err);
    }
  };

  /**
   * Renders a goodbye template with the given username.
   *
   * @param {string} username - The username to be included in the template.
   * @return {Promise<string>} A Promise that resolves to the rendered template.
   */
  async renderGoodbyeTemplate(username) {
    // Define the data
    const goodbye = {
      username: username,
      companyName: 'ImadeCorp Ltd',
      productName: 'OVIDOT',
      productUrl: `${process.env.APP_DOMAIN}`,
      supportEmail: `support@${process.env.APP_DOMAIN.slice(8)}`,
      year: this.year
    };
  
    try {
      const result = await this.renderFile('./v1/services/views/goodbye.ejs', goodbye);
      return result;
    } catch(err) {
      logger.error(err);
    }
  };
  
  /**
   * Renders a forget password template with the given username and content.
   *
   * @param {string} username - The username to be included in the template.
   * @param {Object} content - The content object containing resetLink and userAgents.
   * @param {string} content.resetLink - The reset link for the password.
   * @param {Object} content.userAgents - The user agents object containing os and browser.
   * @param {string} content.userAgents.os - The operating system of the user.
   * @param {string} content.userAgents.browser - The browser used by the user.
   * @return {Promise<string>} A Promise that resolves to the rendered template.
   */
  async renderForgetTemplate(username, content) {
    // Define the data
    const forgetPass = {
      username: username,
      companyName: 'ImadeCorp Ltd',
      productUrl: process.env.APP_DOMAIN,
      productName: 'OVIDOT',
      resetLink: content.resetLink,
      year: this.year,
      osName: content.userAgents.os,
      browserName: content.userAgents.browser,
      supportEmail: `support@${process.env.APP_DOMAIN.slice(8)}`
    };
  
    try {
      const result = await this.renderFile('./v1/services/views/forgetPass.ejs', forgetPass);
      return result;
    } catch(err) {
      logger.error(err);
    }
  };
};


const templates = new Templates();
module.exports = templates;
