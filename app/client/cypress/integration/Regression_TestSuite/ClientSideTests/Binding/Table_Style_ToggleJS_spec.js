/* eslint-disable cypress/no-unnecessary-waiting */

const widgetsPage = require("../../../../locators/Widgets.json");
const dsl = require("../../../../fixtures/tableNewDsl.json");
const testdata = require("../../../../fixtures/testdata.json");
import { ObjectsRegistry } from "../../../../support/Objects/Registry";

const propPane = ObjectsRegistry.PropertyPane,
  ee = ObjectsRegistry.EntityExplorer,
  agHelper = ObjectsRegistry.AggregateHelper;

describe("Table Widget property pane feature validation", function () {
  before(() => {
    cy.addDsl(dsl);
  });

  it("1. Table widget toggle test for text alignment", function () {
    ee.SelectEntityByName("Table1");
    cy.editColumn("id");
    //cy.movetoStyleTab();
    agHelper.Sleep();
    propPane.EnterJSContext("Text Align", testdata.bindingAlign);
    cy.wait("@updateLayout");
    cy.readTabledataValidateCSS("0", "0", "justify-content", "flex-start");
    cy.readTabledataValidateCSS("1", "0", "justify-content", "flex-end");
  });

  it("2. Table widget change text size and validate", function () {
    cy.readTabledataValidateCSS("0", "0", "font-size", "14px");
    //cy.movetoStyleTab();
    cy.get(widgetsPage.textSize).last().click({ force: true });
    agHelper.Sleep();
    cy.selectTxtSize("XL");
    cy.readTabledataValidateCSS("0", "0", "font-size", "30px");
  });

  it("3. Table widget toggle test for vertical Alignment", function () {
    //cy.movetoStyleTab();
    agHelper.Sleep();
    propPane.EnterJSContext("Vertical Alignment", testdata.bindingVerticalAlig);
    cy.wait("@updateLayout");
    cy.readTabledataValidateCSS("0", "0", "align-items", "flex-start");
    cy.readTabledataValidateCSS("1", "0", "align-items", "flex-end");
  });

  it("4. Table widget toggle test for text size", function () {
    //cy.movetoStyleTab();
    agHelper.Sleep();
    propPane.EnterJSContext("Text Size", testdata.bindingSize);
    cy.wait("@updateLayout");
    cy.readTabledataValidateCSS("0", "0", "font-size", "14px");
    cy.readTabledataValidateCSS("1", "0", "font-size", "24px");
  });

  it("5. Table widget toggle test for style Alignment", function () {
    //cy.movetoStyleTab();
    agHelper.Sleep();
    propPane.EnterJSContext("Font Style", testdata.bindingStyle);
    cy.wait("@updateLayout");
    cy.readTabledataValidateCSS("0", "0", "font-style", "normal");
    cy.readTabledataValidateCSS("1", "0", "font-style", "italic");
  });

  it("6. Table widget toggle test for text color", function () {
    //cy.movetoStyleTab();
    agHelper.Sleep();
    propPane.EnterJSContext("Text Color", testdata.bindingTextColor);
    cy.wait("@updateLayout");
    cy.readTabledataValidateCSS("0", "0", "color", "rgb(0, 128, 0)");
    cy.readTabledataValidateCSS("1", "0", "color", "rgb(255, 0, 0)");
  });

  it("7. Table widget toggle test for background color", function () {
    //cy.movetoStyleTab();
    agHelper.Sleep();
    propPane.EnterJSContext("Cell Background", testdata.bindingTextColor);
    cy.wait("@updateLayout");
    cy.readTabledataValidateCSS(
      "0",
      "0",
      "background",
      "rgb(0, 128, 0) none repeat scroll 0% 0% / auto padding-box border-box",
    );
    cy.readTabledataValidateCSS(
      "1",
      "0",
      "background",
      "rgb(255, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box",
    );
  });
});
