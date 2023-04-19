import * as React from "react";

// import { ButtonGroup, TooltipComponent } from "design-system-old";
import { SegmentedControl, Tooltip } from "design-system";
import type { ControlData, ControlProps } from "./BaseControl";
import BaseControl from "./BaseControl";
import { borderRadiusOptions } from "constants/ThemeConstants";
import type { DSEventDetail } from "utils/AppsmithUtils";
import {
  DSEventTypes,
  DS_EVENT,
  emitInteractionAnalyticsEvent,
} from "utils/AppsmithUtils";

/**
 * ----------------------------------------------------------------------------
 * TYPES
 *-----------------------------------------------------------------------------
 */
export interface BorderRadiusOptionsControlProps extends ControlProps {
  propertyValue: string | undefined;
}

const options = Object.keys(borderRadiusOptions).map((optionKey) => ({
  label: (
    <Tooltip content={optionKey} key={optionKey}>
      <div
        className="w-5 h-5 border-t-2 border-l-2 border-gray-500"
        style={{ borderTopLeftRadius: borderRadiusOptions[optionKey] }}
      />
    </Tooltip>
  ),
  value: borderRadiusOptions[optionKey],
}));

const optionsValues = new Set(Object.values(borderRadiusOptions));

/**
 * ----------------------------------------------------------------------------
 * COMPONENT
 *-----------------------------------------------------------------------------
 */
class BorderRadiusOptionsControl extends BaseControl<BorderRadiusOptionsControlProps> {
  componentRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.componentRef.current?.addEventListener(
      DS_EVENT,
      this.handleAdsEvent as (arg0: Event) => void,
    );
  }

  componentWillUnmount() {
    this.componentRef.current?.removeEventListener(
      DS_EVENT,
      this.handleAdsEvent as (arg0: Event) => void,
    );
  }

  handleAdsEvent = (e: CustomEvent<DSEventDetail>) => {
    if (
      e.detail.component === "ButtonGroup" &&
      e.detail.event === DSEventTypes.KEYPRESS
    ) {
      emitInteractionAnalyticsEvent(this.componentRef.current, {
        key: e.detail.meta.key,
      });
      e.stopPropagation();
    }
  };

  static getControlType() {
    return "BORDER_RADIUS_OPTIONS";
  }

  public render() {
    return (
      <SegmentedControl
        defaultValue={
          this.props.evaluatedValue ? this.props.evaluatedValue : ""
        }
        onClick={(value, isUpdatedViaKeyboard = false) => {
          this.updateProperty(
            this.props.propertyName,
            value,
            isUpdatedViaKeyboard,
          );
        }}
        options={options}
        ref={this.componentRef}
      />
    );
  }

  static canDisplayValueInUI(config: ControlData, value: any): boolean {
    return optionsValues.has(value);
  }
}

export default BorderRadiusOptionsControl;
