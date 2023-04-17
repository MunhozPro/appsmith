import { ReduxActionTypes } from "ce/constants/ReduxActionConstants";
import { PluginPackageName } from "entities/Action";
import { isNumber } from "lodash";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { WIDGET_QUERY_GENERATION_FORM_CONFIG_VERSION } from "WidgetQueryGenerators/constants";
import { WidgetQueryGeneratorFormContext } from "..";
import { DEFAULT_DROPDOWN_OPTION } from "../constants";
import { useColumns } from "../WidgetSpecificControls/ColumnDropdown/useColumns";

export function useConnectData() {
  const dispatch = useDispatch();

  const { config, widgetId } = useContext(WidgetQueryGeneratorFormContext);

  const { options: columns, primaryColumn } = useColumns("");

  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {
    setIsLoading(true);

    const payload = {
      tableName: config.table.label,
      datasourceId: config.datasource.id,
      widgetId: widgetId,
      searchableColumn: config.searchable_columns.id,
      version: WIDGET_QUERY_GENERATION_FORM_CONFIG_VERSION,
      columns: columns.map((column) => column.value),
      primaryColumn,
    };

    dispatch({
      type: ReduxActionTypes.BIND_WIDGET_TO_DATASOURCE,
      payload,
    });
  };

  const show =
    config.datasource !== DEFAULT_DROPDOWN_OPTION &&
    config.table !== DEFAULT_DROPDOWN_OPTION &&
    (config.datasource.data.pluginPackageName !==
      PluginPackageName.GOOGLE_SHEETS ||
      config.sheet !== DEFAULT_DROPDOWN_OPTION);

  const disabled =
    config.datasource.data.pluginPackageName ===
      PluginPackageName.GOOGLE_SHEETS &&
    (!config.tableHeaderIndex ||
      !isNumber(Number(config.tableHeaderIndex)) ||
      isNaN(Number(config.tableHeaderIndex)));

  return {
    show,
    disabled,
    onClick,
    isLoading,
  };
}
