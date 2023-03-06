import * as _ from "../../../../support/Objects/ObjectsCore";

import {
  ACTION_EXECUTION_CANCELLED,
  createMessage,
} from "../../../../support/Objects/CommonErrorMessages";

const largeResponseApiUrl = "https://api.publicapis.org/entries";
//"https://jsonplaceholder.typicode.com/photos";//Commenting since this is faster sometimes & case is failing

describe("Abort Action Execution", function() {
  it("1. Bug #14006, #16093 - Cancel Request button should abort API action execution", function() {
    _.apiPage.CreateAndFillApi(largeResponseApiUrl, "AbortApi", 0);
    _.apiPage.RunAPI(false, 0);
    _.agHelper.GetNClick(_.locators._cancelActionExecution, 0, true);
    _.agHelper.AssertContains(
      createMessage(ACTION_EXECUTION_CANCELLED, "AbortApi"),
    );
    _.agHelper.AssertElementAbsence(_.locators._specificToast("{}")); //Assert that empty toast does not appear - Bug #16093
    _.agHelper.ActionContextMenuWithInPane("Delete", "Are you sure?");
  });

  it("2. Bug #14006, #16093 Cancel Request button should abort Query action execution", function() {
    _.dataSources.CreateDataSource("MySql");
    cy.get("@dsName").then(($dsName) => {
      _.dataSources.CreateQueryAfterDSSaved(
        "SELECT * FROM worldCountryInfo wc join countryFlags cf on wc.Name = cf.Country CROSS JOIN customers cc",
        "AbortQuery",
      );
      _.dataSources.SetQueryTimeout(0);
      _.dataSources.RunQuery(false, false, 0);
      _.agHelper.GetNClick(_.locators._cancelActionExecution, 0, true);
      _.agHelper.AssertContains(
        createMessage(ACTION_EXECUTION_CANCELLED, "AbortQuery"),
      );
      _.agHelper.AssertElementAbsence(_.locators._specificToast("{}")); //Assert that empty toast does not appear - Bug #16093
      _.agHelper.ActionContextMenuWithInPane("Delete", "Are you sure?");
      _.dataSources.DeleteDatasouceFromWinthinDS($dsName as unknown as string);
    });
  });
});
