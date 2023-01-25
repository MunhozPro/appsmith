
import * as _ from "../../../../../support/Objects/ObjectsCore";
import { WIDGET } from "../../../../../locators/WidgetLocators";
import {
    ERROR_ACTION_EXECUTE_FAIL,
    createMessage,
  } from "../../../../../support/Objects/CommonErrorMessages";

  const listData = [
    {
      id: 10,
      name: "okbuddy",
    },
    {
      id: 11,
      name: "Aliess",
    },
    {
      id: 14,
      name: "Aliess123",
    },
    {
      id: 15,
      name: "Aliess",
    }
]

let dsName : any;

describe("Verify List widget binding, Server side Pagination & functionalities with Queries and API", function() {

it("1. Create new API & verify data on List widget", function(){
    const apiUrl = `https://mock-api.appsmith.com/users`
    _.apiPage.CreateAndFillApi(apiUrl,"API1")
    _.apiPage.RunAPI()
    _.agHelper.AssertElementAbsence(
        _.locators._specificToast(
            createMessage(ERROR_ACTION_EXECUTE_FAIL, "API1")
        ),
    )
    _.apiPage.ResponseStatusCheck("200 OK")
    _.ee.DragDropWidgetNVerify(WIDGET.LIST, 300,100)
    _.propPane.UpdatePropertyFieldValue("Items", "{{API1.data.users}}")
    _.ee.NavigateToSwitcher("explorer")
    _.ee.ExpandCollapseEntity("List1")
    _.ee.ExpandCollapseEntity("Container1")
    _.ee.SelectEntityByName("Text1")
    _.propPane.UpdatePropertyFieldValue("Text", "{{currentItem.name}}")
    _.agHelper.GetNAssertElementText(_.locators._textWidget,"Barty Crouch","have.text",0)
    _.ee.SelectEntityByName("Text2")
    _.propPane.UpdatePropertyFieldValue("Text", "{{currentItem.id}}")
    _.agHelper.GetNAssertElementText(_.locators._textWidget,"1","have.text",1)
})

it("2. Verify 'onListitemClick' functionality of Show messgage event on deploy mode",function(){
    _.agHelper.GetNClick(_.locators._listWidget,0,true)
    _.propPane.EnterJSContext(
        "onListItemClick","{{showAlert('ListWidget_' + currentItem.name + '_' + currentItem.id,'success')}}"
        ,true)
    _.deployMode.DeployApp()
    _.agHelper.WaitUntilEleAppear(_.locators._listWidget)
    _.agHelper.GetNClick(_.locators._containerWidget,0,true)
    _.agHelper.ValidateToastMessage("ListWidget_Barty Crouch_1")
    _.agHelper.WaitUntilAllToastsDisappear()
    _.agHelper.GetNClick(_.locators._containerWidget,1,true)
    _.agHelper.ValidateToastMessage("ListWidget_Jenelle Kibbys_2")
    _.agHelper.WaitUntilAllToastsDisappear()
    _.deployMode.NavigateBacktoEditor()
})

it("3. Verify pagination and also verify Next_Page/Prev_Page disabled when List reach to last/first page", function(){
        _.agHelper.WaitUntilEleAppear(_.locators._listWidget)
        _.agHelper.GetNClick(_.locators._listWidget,0,true)
        _.propPane.UpdatePropertyFieldValue("Items",JSON.stringify(listData))
        _.deployMode.DeployApp()
        _.agHelper.WaitUntilEleAppear(_.locators._listWidget)
        _.agHelper.GetNAssertElementText(_.locators._listPaginateActivePage,"1","have.text")
        _.agHelper.GetNClick(_.locators._listPaginateNextButton)
        _.agHelper.GetNAssertElementText(_.locators._listPaginateActivePage,"2","have.text")
        _.agHelper.AssertElementDisabled(_.locators._listPaginateButtonsDisabled,"true")
        _.agHelper.GetNClick(_.locators._listPaginatePrevButton)
        _.agHelper.GetNAssertElementText(_.locators._listPaginateActivePage,"1","have.text")
        _.agHelper.AssertElementDisabled(_.locators._listPaginateButtonsDisabled,"true")
        _.deployMode.NavigateBacktoEditor()
        _.agHelper.Sleep()
       
    })

it("4. Delete the List widget from canvas and verify it",function(){
    _.agHelper.GetNClick(_.locators._listWidget,0,true)
    _.agHelper.GetNAssertElementText(_.locators._propertyPaneTitle,"List1","have.text")
    _.agHelper.GetNClick(_.propPane._deleteWidget)
    _.agHelper.ValidateToastMessage("List1 is removed")
    _.deployMode.DeployApp()
    _.agHelper.Sleep(2000)
    _.agHelper.AssertElementAbsence(_.locators._listWidget)
    _.deployMode.NavigateBacktoEditor()
})

it("5. Verify List widget with error message on wrong input", function(){
    _.ee.DragDropWidgetNVerify(WIDGET.LIST, 300,100)
    _.ee.NavigateToSwitcher("explorer")
    _.ee.ExpandCollapseEntity("List1")
    _.ee.ExpandCollapseEntity("Container1")
    _.ee.SelectEntityByName("Text1")
    _.propPane.UpdatePropertyFieldValue("Text", "{{text}}")
    _.agHelper.VerifyEvaluatedErrorMessage("ReferenceError: text is not defined")
    _.agHelper.GetNClick(_.locators._listWidget,0,true)
    _.propPane.UpdatePropertyFieldValue("Items", 
        "{'id': '001', 'name': 'Blue', img': 'https://assets.appsmith.com/widgets/default.png'}")
    _.agHelper.VerifyEvaluatedErrorMessage("This value does not evaluate to type Array")
    _.agHelper.Sleep()
})

it("6. Verify Copy/Paste List widget", function(){
    _.agHelper.GetNClick(_.locators._listWidget,0,true)
    _.ee.CopyPasteWidget("List1")
    _.agHelper.AssertElementExist(_.locators._listWidget,1)
    _.agHelper.GetNAssertElementText(_.locators._propertyPaneTitle,"List1Copy","have.text")
    _.agHelper.Sleep() 
})


it("7. Verify Pagination in Server side pagination and verify no pagination visible when Server Side Pagination is disabled", function(){
    _.agHelper.GetNClick(_.locators._listWidget,1,true)
    _.ee.NavigateToSwitcher("explorer")
    _.dataSources.CreateDataSource("Postgres")
    cy.get("@dsName").then(($dsName)=> {
        dsName = $dsName
        _.dataSources.CreateNewQueryInDS(
            dsName,
            "SELECT * FROM users LIMIT {{List1Copy.pageSize}} offset {{(List1Copy.pageNo-1)*List1Copy.pageSize}}",
            "postgres_ssp",
        )
        _.dataSources.ToggleUsePreparedStatement(false)
        _.dataSources.RunQuery(true)
        _.ee.NavigateToSwitcher("widgets")
        _.agHelper.GetNClick(_.locators._listWidget,1,true)
        _.propPane.UpdatePropertyFieldValue("Items", "{{postgres_ssp.data}}")
        _.propPane.ToggleOnOrOff("Server Side Pagination", "On")
        _.propPane.EnterJSContext("onPageChange","{{postgres_ssp.run()}}",true)
        _.ee.NavigateToSwitcher("explorer")
        _.ee.ExpandCollapseEntity("Widgets")
        _.ee.ExpandCollapseEntity("List1Copy")
        _.ee.ExpandCollapseEntity("Container1Copy")
        _.ee.SelectEntityByName("Text1Copy")
        _.propPane.UpdatePropertyFieldValue("Text", "{{currentItem.name}}")
        _.deployMode.DeployApp()
        _.agHelper.WaitUntilEleAppear(_.locators._listWidget)
        _.agHelper.GetNAssertElementText(_.locators._listPaginateActivePage,"1","have.text")
        _.agHelper.GetNAssertElementText(_.locators._listPaginateItem,"2","not.have.text")
        _.agHelper.GetNClick(_.locators._listPaginateNextButton)
        _.agHelper.GetNAssertElementText(_.locators._listPaginateActivePage,"2","have.text")
        _.deployMode.NavigateBacktoEditor()
        _.agHelper.GetNClick(_.locators._listWidget,1,true)
        _.propPane.ToggleOnOrOff("Server Side Pagination", "Off")
        _.agHelper.AssertElementAbsence(_.locators._listPaginateItem)
        _.deployMode.DeployApp()
        _.agHelper.WaitUntilEleAppear(_.locators._listWidget)
        _.agHelper.AssertElementAbsence(_.locators._listPaginateItem)
        _.deployMode.NavigateBacktoEditor()
        _.agHelper.Sleep()
    })
})

it("8. Verify onPageSizeChange functionality in Server Side Pagination of list widget", function(){
    _.agHelper.GetNClick(_.locators._listWidget,1,true)
    _.propPane.ToggleOnOrOff("Server Side Pagination", "On")
    _.propPane.EnterJSContext("onPageSizeChange", "{{showAlert('Page size changed ' + List1Copy.pageSize)}}", true)
    _.propPane.ToggleOnOrOff("Server Side Pagination","Off")
    _.propPane.ToggleOnOrOff("Server Side Pagination","On")
    _.agHelper.ValidateToastMessage("Page size changed 2")
    _.agHelper.Sleep()
})

after(() => {
    _.ee.ExpandCollapseEntity("Queries/JS")
    _.ee.ActionContextMenuByEntityName("API1","Delete","Are you sure?")
    _.ee.ActionContextMenuByEntityName("postgres_ssp","Delete","Are you sure?")
})
})

