import React, { useCallback, useEffect, useMemo, useState } from "react";
import produce from "immer";
import { noop, set } from "lodash";

import { CommonControls } from "./CommonControls";
import { ConnectData } from "./ConnectData";
import { DEFAULT_DROPDOWN_OPTION } from "./constants";
import { DatasourceSpecificControls } from "./DatasourceSpecificControls";
import { Wrapper } from "./styles";
import type { DropdownOptionType } from "./types";
import WidgetSpecificControls from "./WidgetSpecificControls";
import { useDispatch } from "react-redux";
import { executeCommandAction } from "actions/apiPaneActions";
import { SlashCommand } from "entities/Action";

type WidgetQueryGeneratorFormContextType = {
  widgetId: string;
  propertyValue: string;
  config: {
    datasource: DropdownOptionType;
    table: DropdownOptionType;
    alias: Record<string, DropdownOptionType>;
    sheet: DropdownOptionType;
    searchable_columns: DropdownOptionType;
    tableHeaderIndex: number;
  };
  updateConfig: (propertyName: string, value: unknown) => void;
  addSnippet: () => void;
  addBinding: (binding?: string, makeDynamicPropertyPath?: boolean) => void;
};

const DEFAULT_CONFIG_VALUE = {
  datasource: DEFAULT_DROPDOWN_OPTION,
  table: DEFAULT_DROPDOWN_OPTION,
  sheet: DEFAULT_DROPDOWN_OPTION,
  alias: {},
  searchable_columns: DEFAULT_DROPDOWN_OPTION,
  tableHeaderIndex: 1,
};

const DEFAULT_CONTEXT_VALUE = {
  config: DEFAULT_CONFIG_VALUE,
  updateConfig: noop,
  addSnippet: noop,
  addBinding: noop,
  widgetId: "",
  propertyValue: "",
};

export const WidgetQueryGeneratorFormContext =
  React.createContext<WidgetQueryGeneratorFormContextType>(
    DEFAULT_CONTEXT_VALUE,
  );

type Props = {
  propertyPath: string;
  propertyValue: string;
  expectedType?: string;
  entityId: string;
  onUpdate: (snippet?: string, makeDynamicPropertyPath?: boolean) => void;
  widgetId: string;
};

function WidgetQueryGeneratorForm(props: Props) {
  const dispatch = useDispatch();

  const {
    entityId,
    expectedType,
    onUpdate,
    propertyPath,
    propertyValue,
    widgetId,
  } = props;

  const [config, setConfig] = useState({
    ...DEFAULT_CONFIG_VALUE,
    widgetId,
  });

  const updateConfig = (propertyName: string, value: unknown) => {
    setConfig(
      produce(config, (draftConfig) => {
        set(draftConfig, propertyName, value);

        if (propertyName === "datasource") {
          set(draftConfig, "table", DEFAULT_DROPDOWN_OPTION);
          set(draftConfig, "sheet", DEFAULT_DROPDOWN_OPTION);
          set(draftConfig, "searchable_columns", DEFAULT_DROPDOWN_OPTION);
          set(draftConfig, "alias", {});
        }

        if (propertyName === "table") {
          set(draftConfig, "sheet", DEFAULT_DROPDOWN_OPTION);
          set(draftConfig, "searchable_columns", DEFAULT_DROPDOWN_OPTION);
          set(draftConfig, "alias", {});
        }

        if (propertyName === "sheet") {
          set(draftConfig, "searchable_columns", DEFAULT_DROPDOWN_OPTION);
          set(draftConfig, "alias", {});
        }
      }),
    );
  };

  const addSnippet = useCallback(() => {
    dispatch(
      executeCommandAction({
        actionType: SlashCommand.NEW_SNIPPET,
        args: {
          entityType: "widget",
          expectedType: expectedType || "Array",
          entityId: entityId,
          propertyPath: propertyPath,
        },
        callback: (snippet: string) => {
          onUpdate(snippet, true);
        },
      }),
    );
  }, [propertyPath, entityId, expectedType, onUpdate]);

  const addBinding = useCallback(
    (binding?: string, makeDynamicPropertyPath?: boolean) => {
      onUpdate(binding, makeDynamicPropertyPath);
    },
    [onUpdate],
  );

  const contextValue = useMemo(() => {
    return {
      config: {
        ...config,
      },
      updateConfig,
      addSnippet,
      addBinding,
      propertyValue,
      widgetId,
    };
  }, [config, updateConfig, addSnippet, addBinding, propertyValue, widgetId]);

  useEffect(() => {
    updateConfig("datasource", DEFAULT_DROPDOWN_OPTION);
  }, [propertyValue]);

  return (
    <Wrapper>
      <WidgetQueryGeneratorFormContext.Provider value={contextValue}>
        <CommonControls />
        <DatasourceSpecificControls />
        <WidgetSpecificControls hasSearchableColumn />
        <ConnectData />
      </WidgetQueryGeneratorFormContext.Provider>
    </Wrapper>
  );
}

export default WidgetQueryGeneratorForm;
