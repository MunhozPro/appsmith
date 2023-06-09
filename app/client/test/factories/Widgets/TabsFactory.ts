import * as Factory from "factory.ts";
import { generateReactKey } from "utils/generators";
import type { WidgetProps } from "widgets/BaseWidget";

export const OldTabsFactory = Factory.Sync.makeFactory<WidgetProps>({
  isVisible: true,
  shouldScrollContents: false,
  tabs: [
    {
      label: "Tab 1",
      id: "tab1",
      widgetId: "o9ody00ep7",
    },
    {
      label: "Tab 2",
      id: "tab2",
      widgetId: "plhuaxd4lo",
    },
  ],
  shouldShowTabs: true,
  defaultTab: "Tab 1",
  type: "TABS_WIDGET",
  isLoading: false,
  parentColumnSpace: 74,
  parentRowSpace: 40,
  leftColumn: 1,
  rightColumn: 9,
  topRow: 12,
  bottomRow: 19,
  parentId: "0",
  children: [
    {
      type: "CANVAS_WIDGET",
      tabId: "tab1",
      tabName: "Tab 1",
      widgetId: "o9ody00ep7",
      parentId: "jd83uvbkmp",
      detachFromLayout: true,
      children: [],
      parentRowSpace: 1,
      parentColumnSpace: 1,
      leftColumn: 0,
      rightColumn: 592,
      topRow: 0,
      bottomRow: 280,
      isLoading: false,
      widgetName: "Canvas1",
      renderMode: "CANVAS",
    },
    {
      type: "CANVAS_WIDGET",
      tabId: "tab2",
      tabName: "Tab 2",
      widgetId: "plhuaxd4lo",
      parentId: "jd83uvbkmp",
      detachFromLayout: true,
      children: [],
      parentRowSpace: 1,
      parentColumnSpace: 1,
      leftColumn: 0,
      rightColumn: 592,
      topRow: 0,
      bottomRow: 280,
      isLoading: false,
      widgetName: "Canvas1",
      renderMode: "CANVAS",
    },
  ],
  dynamicBindingPathList: [],
  widgetName: Factory.each((i) => `Tabs${i + 1}`),
  widgetId: generateReactKey(),
  renderMode: "CANVAS",
  version: 1,
});

export const TabsFactory = Factory.Sync.makeFactory<WidgetProps>({
  isVisible: true,
  shouldScrollContents: false,
  tabsObj: {
    tab1: {
      label: "Tab 1",
      id: "tab1",
      widgetId: "o9ody00ep7",
    },
    tab2: {
      label: "Tab 2",
      id: "tab2",
      widgetId: "plhuaxd4lo",
    },
  },
  shouldShowTabs: true,
  defaultTab: "Tab 1",
  type: "TABS_WIDGET",
  isLoading: false,
  parentColumnSpace: 74,
  parentRowSpace: 40,
  leftColumn: 1,
  rightColumn: 9,
  topRow: 12,
  bottomRow: 19,
  parentId: "0",
  children: [
    {
      type: "CANVAS_WIDGET",
      tabId: "tab1",
      tabName: "Tab 1",
      widgetId: "o9ody00ep7",
      parentId: "jd83uvbkmp",
      detachFromLayout: true,
      children: [],
      parentRowSpace: 1,
      parentColumnSpace: 1,
      leftColumn: 0,
      rightColumn: 592,
      topRow: 0,
      bottomRow: 280,
      isLoading: false,
      widgetName: "Canvas1",
      renderMode: "CANVAS",
    },
    {
      type: "CANVAS_WIDGET",
      tabId: "tab2",
      tabName: "Tab 2",
      widgetId: "plhuaxd4lo",
      parentId: "jd83uvbkmp",
      detachFromLayout: true,
      children: [],
      parentRowSpace: 1,
      parentColumnSpace: 1,
      leftColumn: 0,
      rightColumn: 592,
      topRow: 0,
      bottomRow: 280,
      isLoading: false,
      widgetName: "Canvas1",
      renderMode: "CANVAS",
    },
  ],
  dynamicBindingPathList: [],
  widgetName: Factory.each((i) => `Tabs${i + 1}`),
  widgetId: generateReactKey(),
  renderMode: "CANVAS",
  version: 3,
});
