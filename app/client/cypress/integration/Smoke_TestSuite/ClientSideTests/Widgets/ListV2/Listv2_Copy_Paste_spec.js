const commonlocators = require("../../../../../locators/commonlocators.json");

const modifierKey = Cypress.platform === "darwin" ? "meta" : "ctrl";

describe("List widget v2 Copy and Paste", () => {
  it("#15988", () => {
    cy.dragAndDropToCanvas("listwidgetv2", {
      x: 300,
      y: 300,
    });
    cy.openPropertyPane("imagewidget");
    cy.get(commonlocators.PropertyPaneSearchInput).type("border");
    cy.get(commonlocators.BorderRadius0px).click({ force: true });

    cy.openPropertyPane("listwidgetv2");

    cy.get("body").type(`{${modifierKey}}c`);
    cy.wait(500);
    cy.get('[id="div-selection-0"]').click();
    cy.get("body").type(`{${modifierKey}}v`, { force: true });
    cy.wait("@updateLayout").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      200,
    );

    cy.get(".t--draggable-listwidgetv2").should("have.length", 2);
    cy.get(".t--draggable-imagewidget").should("have.length", 6);

    cy.get(".t--widget-textwidget span:contains('Blue')").should(
      "have.length",
      2,
    );
  });
});