import { updateFunctionProperty } from "actions/jsPaneActions";
import {
  ASYNC_FUNCTION_SETTINGS_HEADING,
  createMessage,
  NO_ASYNC_FUNCTIONS,
} from "@appsmith/constants/messages";
import type { JSAction } from "entities/JSCollection";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { RADIO_OPTIONS, SETTINGS_HEADINGS } from "./constants";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { Icon, Radio, RadioGroup, Tooltip } from "design-system";

type SettingsHeadingProps = {
  text: string;
  hasInfo?: boolean;
  info?: string;
  grow: boolean;
};

type SettingsItemProps = {
  action: JSAction;
  disabled?: boolean;
};

type JSFunctionSettingsProps = {
  actions: JSAction[];
  disabled?: boolean;
};

const SettingRow = styled.div<{ isHeading?: boolean; noBorder?: boolean }>`
  display: flex;
  padding: 8px;
  ${(props) =>
    !props.noBorder &&
    `
  border-bottom: solid 1px ${props.theme.colors.table.border}};
  `}

  ${(props) =>
    props.isHeading &&
    `
  background: #f8f8f8;
  font-size: ${props.theme.typography.h5.fontSize}px;
  `};
`;

const StyledIcon = styled(Icon)`
  width: max-content;
  height: max-content;
  & > svg {
    width: 13px;
    height: auto;
  }
`;

const SettingColumn = styled.div<{ grow?: boolean; isHeading?: boolean }>`
  display: flex;
  align-items: center;
  flex-grow: ${(props) => (props.grow ? 1 : 0)};
  padding: 5px 12px;
  min-width: 250px;

  ${(props) =>
    props.isHeading &&
    `
  text-transform: uppercase;
  font-weight: ${props.theme.fontWeights[2]};
  font-size: ${props.theme.fontSizes[2]}px
  margin-right: 9px;
  `}

  ${StyledIcon} {
    margin-left: 8px;
  }
`;

const JSFunctionSettingsWrapper = styled.div`
  display: flex;
  height: 100%;
  border-bottom: 1px solid ${(props) => props.theme.colors.apiPane.dividerBg};
  border-top: 1px solid ${(props) => props.theme.colors.apiPane.dividerBg};
  overflow: auto;
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px ${(props) => props.theme.spaces[13] - 2}px;
  width: max-content;
  min-width: 700px;
  height: 100%;

  & > h3 {
    margin: 20px 0;
    text-transform: capitalize;
    font-size: ${(props) => props.theme.fontSizes[5]}px;
    font-weight: ${(props) => props.theme.fontWeights[2]};
    color: var(--ads-v2-color-fg-emphasis);
  }
`;

function SettingsHeading({ grow, hasInfo, info, text }: SettingsHeadingProps) {
  return (
    <SettingColumn grow={grow} isHeading>
      <span>{text}</span>
      {hasInfo && info && (
        <Tooltip content={createMessage(() => info)}>
          <StyledIcon name="question-line" size="sm" />
        </Tooltip>
      )}
    </SettingColumn>
  );
}

function SettingsItem({ action, disabled }: SettingsItemProps) {
  const dispatch = useDispatch();
  const [executeOnPageLoad, setExecuteOnPageLoad] = useState(
    String(!!action.executeOnLoad),
  );
  const [confirmBeforeExecute, setConfirmBeforeExecute] = useState(
    String(!!action.confirmBeforeExecute),
  );

  const updateProperty = (value: boolean | number, propertyName: string) => {
    dispatch(
      updateFunctionProperty({
        action: action,
        propertyName: propertyName,
        value: value,
      }),
    );
  };
  const onChangeExecuteOnPageLoad = (value: string) => {
    setExecuteOnPageLoad(value);
    updateProperty(value === "true", "executeOnLoad");

    AnalyticsUtil.logEvent("JS_OBJECT_SETTINGS_CHANGED", {
      toggleSetting: "ON_PAGE_LOAD",
      toggleValue: value,
    });
  };
  const onChangeConfirmBeforeExecute = (value: string) => {
    setConfirmBeforeExecute(value);
    updateProperty(value === "true", "confirmBeforeExecute");

    AnalyticsUtil.logEvent("JS_OBJECT_SETTINGS_CHANGED", {
      toggleSetting: "CONFIRM_BEFORE_RUN",
      toggleValue: value,
    });
  };

  return (
    <SettingRow
      className="t--async-js-function-settings"
      id={`${action.name}-settings`}
    >
      <SettingColumn grow>
        <span>{action.name}</span>
      </SettingColumn>
      <SettingColumn className={`${action.name}-on-page-load-setting`}>
        <RadioGroup
          defaultValue={executeOnPageLoad}
          name={`execute-on-page-load-${action.id}`}
          onChange={onChangeExecuteOnPageLoad}
          orientation="horizontal"
        >
          {RADIO_OPTIONS.map((option) => (
            <Radio
              isDisabled={disabled}
              key={option.label}
              value={option.value}
            >
              {option.label}
            </Radio>
          ))}
        </RadioGroup>
      </SettingColumn>
      <SettingColumn className={`${action.name}-confirm-before-execute`}>
        <RadioGroup
          defaultValue={confirmBeforeExecute}
          name={`confirm-before-execute-${action.id}`}
          onChange={onChangeConfirmBeforeExecute}
          orientation="horizontal"
        >
          {RADIO_OPTIONS.map((option) => (
            <Radio
              isDisabled={disabled}
              key={option.label}
              value={option.value}
            >
              {option.label}
            </Radio>
          ))}
        </RadioGroup>
      </SettingColumn>
    </SettingRow>
  );
}

function JSFunctionSettingsView({
  actions,
  disabled = false,
}: JSFunctionSettingsProps) {
  const asyncActions = actions.filter(
    (action) => action.actionConfiguration.isAsync,
  );
  return (
    <JSFunctionSettingsWrapper>
      <SettingsContainer>
        <h3>{createMessage(ASYNC_FUNCTION_SETTINGS_HEADING)}</h3>
        <SettingRow isHeading>
          {SETTINGS_HEADINGS.map((setting, index) => (
            <SettingsHeading
              grow={index === 0}
              hasInfo={setting.hasInfo}
              info={setting.info}
              key={setting.key}
              text={setting.text}
            />
          ))}
        </SettingRow>
        {asyncActions && asyncActions.length ? (
          asyncActions.map((action) => (
            <SettingsItem action={action} disabled={disabled} key={action.id} />
          ))
        ) : (
          <SettingRow noBorder>
            <SettingColumn>{createMessage(NO_ASYNC_FUNCTIONS)}</SettingColumn>
          </SettingRow>
        )}
      </SettingsContainer>
    </JSFunctionSettingsWrapper>
  );
}

export default JSFunctionSettingsView;
