import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import _ from "lodash";
import { DATASOURCE_DB_FORM } from "@appsmith/constants/forms";
import { Icon } from "@blueprintjs/core";
import FormTitle from "./FormTitle";
import { Callout, Category, Variant } from "design-system-old";
import CollapsibleHelp from "components/designSystems/appsmith/help/CollapsibleHelp";
import Connected from "./Connected";
import type { Datasource } from "entities/Datasource";
import type { InjectedFormProps } from "redux-form";
import { reduxForm } from "redux-form";
import { APPSMITH_IP_ADDRESSES } from "constants/DatasourceEditorConstants";
import { getAppsmithConfigs } from "@appsmith/configs";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { convertArrayToSentence } from "utils/helpers";
import { PluginType } from "entities/Action";
import type { AppState } from "@appsmith/reducers";
import type { JSONtoFormProps } from "./JSONtoForm";
import {
  EditDatasourceButton,
  FormTitleContainer,
  Header,
  JSONtoForm,
  PluginImage,
} from "./JSONtoForm";
import DatasourceAuth from "pages/common/datasourceAuth";
import { getDatasourceFormButtonConfig } from "selectors/entitiesSelector";
import {
  hasCreateDatasourceActionPermission,
  hasManageDatasourcePermission,
} from "@appsmith/utils/permissionHelpers";
import { TEMP_DATASOURCE_ID } from "constants/Datasource";
import NewActionButton from "./NewActionButton";
import { getPagePermissions } from "selectors/editorSelectors";

const { cloudHosting } = getAppsmithConfigs();

interface DatasourceDBEditorProps extends JSONtoFormProps {
  setDatasourceViewMode: (viewMode: boolean) => void;
  openOmnibarReadMore: (text: string) => void;
  datasourceId: string;
  applicationId: string;
  pageId: string;
  isNewDatasource: boolean;
  pluginImage: string;
  viewMode: boolean;
  pluginType: string;
  messages?: Array<string>;
  datasource: Datasource;
  datasourceButtonConfiguration: string[] | undefined;
  hiddenHeader?: boolean;
  canCreateDatasourceActions?: boolean;
  canManageDatasource?: boolean;
  datasourceName?: string;
  isDatasourceBeingSavedFromPopup: boolean;
  isFormDirty: boolean;
  datasourceDeleteTrigger: () => void;
}

type Props = DatasourceDBEditorProps &
  InjectedFormProps<Datasource, DatasourceDBEditorProps>;

const StyledOpenDocsIcon = styled(Icon)`
  svg {
    width: 12px;
    height: 18px;
  }
`;

const CollapsibleWrapper = styled.div`
  width: max-content;
`;

export const FormBodyContainer = styled.div`
  flex: 8 8 80%;
`;

const CTAContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

class DatasourceDBEditor extends JSONtoForm<Props> {
  componentDidUpdate(prevProps: Props) {
    if (prevProps.datasourceId !== this.props.datasourceId) {
      super.componentDidUpdate(prevProps);
    }
  }
  // returns normalized and trimmed datasource form data
  getSanitizedData = () => {
    return this.getTrimmedData({
      ...this.normalizeValues(),
      name: this.props.datasourceName,
    });
  };

  openOmnibarReadMore = () => {
    const { openOmnibarReadMore } = this.props;
    openOmnibarReadMore("connect to databases");
    AnalyticsUtil.logEvent("OPEN_OMNIBAR", { source: "READ_MORE_DATASOURCE" });
  };

  render() {
    const { formConfig, viewMode } = this.props;

    // make sure this redux form has been initialized before rendering anything.
    // the initialized prop below comes from redux-form.
    // The viewMode condition is added to allow the conditons only run on the editMode
    if (!this.props.initialized && !viewMode) {
      return null;
    }

    const content = this.renderDataSourceConfigForm(formConfig);
    return this.renderForm(content);
  }

  renderDataSourceConfigForm = (sections: any) => {
    const {
      canManageDatasource,
      datasource,
      datasourceButtonConfiguration,
      datasourceDeleteTrigger,
      datasourceId,
      formData,
      messages,
      pluginType,
      viewMode,
    } = this.props;

    const createFlow = datasourceId === TEMP_DATASOURCE_ID;

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        {!this.props.hiddenHeader && (
          <Header style={{ flex: "1 1 10%" }}>
            <FormTitleContainer>
              <PluginImage alt="Datasource" src={this.props.pluginImage} />
              <FormTitle
                disabled={!createFlow && !canManageDatasource}
                focusOnMount={this.props.isNewDatasource}
              />
            </FormTitleContainer>
            {viewMode && (
              <CTAContainer>
                <EditDatasourceButton
                  category={Category.secondary}
                  className="t--edit-datasource"
                  onClick={() => {
                    this.props.setDatasourceViewMode(false);
                  }}
                  text="EDIT"
                />
                <NewActionButton
                  datasource={datasource}
                  disabled={!this.props.canCreateDatasourceActions}
                  eventFrom="datasource-pane"
                  pluginType={pluginType}
                />
              </CTAContainer>
            )}
          </Header>
        )}
        {messages &&
          messages.map((msg, i) => (
            <Callout
              addMarginTop
              fill
              key={i}
              text={msg}
              variant={Variant.warning}
            />
          ))}

        <FormBodyContainer>
          {!this.props.hiddenHeader &&
            cloudHosting &&
            pluginType === PluginType.DB &&
            !viewMode && (
              <CollapsibleWrapper>
                <CollapsibleHelp>
                  <span>{`Whitelist the IP ${convertArrayToSentence(
                    APPSMITH_IP_ADDRESSES,
                  )}  on your database instance to connect to it. `}</span>
                  <a onClick={this.openOmnibarReadMore}>
                    {"Learn more "}
                    <StyledOpenDocsIcon icon="document-open" />
                  </a>
                </CollapsibleHelp>
              </CollapsibleWrapper>
            )}
          {(!viewMode || datasourceId === TEMP_DATASOURCE_ID) && (
            <>
              {!_.isNil(sections)
                ? _.map(sections, this.renderMainSection)
                : undefined}
              {""}
            </>
          )}
          {viewMode && <Connected />}
        </FormBodyContainer>
        {/* Render datasource form call-to-actions */}
        {datasource && (
          <DatasourceAuth
            datasource={datasource}
            datasourceButtonConfiguration={datasourceButtonConfiguration}
            datasourceDeleteTrigger={datasourceDeleteTrigger}
            formData={formData}
            getSanitizedFormData={_.memoize(this.getSanitizedData)}
            isFormDirty={this.props.isFormDirty}
            isInvalid={this.validate()}
            shouldRender={!viewMode}
            triggerSave={this.props.isDatasourceBeingSavedFromPopup}
          />
        )}
      </form>
    );
  };
}

const mapStateToProps = (state: AppState, props: any) => {
  const datasource = state.entities.datasources.list.find(
    (e) => e.id === props.datasourceId,
  ) as Datasource;

  const hintMessages = datasource && datasource.messages;

  const datasourceButtonConfiguration = getDatasourceFormButtonConfig(
    state,
    props?.formData?.pluginId,
  );

  const datasourcePermissions = datasource.userPermissions || [];

  const canManageDatasource = hasManageDatasourcePermission(
    datasourcePermissions,
  );

  const pagePermissions = getPagePermissions(state);

  const canCreateDatasourceActions = hasCreateDatasourceActionPermission([
    ...datasourcePermissions,
    ...pagePermissions,
  ]);

  return {
    messages: hintMessages,
    datasource,
    datasourceButtonConfiguration,
    isReconnectingModalOpen: state.entities.datasources.isReconnectingModalOpen,
    canCreateDatasourceActions,
    canManageDatasource,
    datasourceName: datasource?.name ?? "",
    isDatasourceBeingSavedFromPopup:
      state.entities.datasources.isDatasourceBeingSavedFromPopup,
  };
};

export default connect(mapStateToProps)(
  reduxForm<Datasource, DatasourceDBEditorProps>({
    form: DATASOURCE_DB_FORM,
    enableReinitialize: true,
  })(DatasourceDBEditor),
);
