import "@patternfly/react-core/dist/styles/base.css";

import * as React from "react";
import { Tabs, Tab } from "@patternfly/react-core/dist/js/components/Tabs";

import {
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  TextVariants,
} from "@patternfly/react-core/dist/js/components/Text";
interface State {
  activeTabKey: string | number;
}

interface Props {
  keyBindings: Map<
    string,
    Set<{
      label: string;
      combination: string;
    }>
  >;
  feelFunctions: Map<
    string,
    Set<{
      signature: string;
      documentation: string;
    }>
  >;
}

export class Cheetsheet extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { activeTabKey: 0 };
  }

  // Toggle currently active tab
  private handleTabClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: number | string) => {
    this.setState({
      activeTabKey: tabIndex,
    });
  };

  private formatKeyBindingCombination = (combination: string): string => {
    return combination
      .split("+")
      .map((w) => w.replace(/^\w/, (c) => c.toUpperCase()))
      .join(" + ");
  };

  public render() {
    return (
      <Tabs activeKey={this.state.activeTabKey} onSelect={this.handleTabClick}>
        <Tab eventKey={0} title="Keyboard Shortcuts">
          <TextContent>
            <TextList component={TextListVariants.dl}>
              {Array.from(this.props.keyBindings.keys()).map((category) => (
                <React.Fragment key={category}>
                  <Text component={TextVariants.h2}>{category}</Text>
                  {Array.from(this.props.keyBindings.get(category)!).map((keyBinding) => (
                    <React.Fragment key={keyBinding.combination}>
                      <TextListItem component={TextListItemVariants.dt}>
                        {this.formatKeyBindingCombination(keyBinding.combination)}
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>{keyBinding.label}</TextListItem>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </TextList>
          </TextContent>
        </Tab>
        <Tab eventKey={1} title="FEEL functions">
          <TextContent>
            <TextList component={TextListVariants.dl}>
              {Array.from(this.props.feelFunctions.keys()).map((dataTypeCategory) => (
                <React.Fragment key={dataTypeCategory}>
                  <Text component={TextVariants.h2}>{dataTypeCategory}</Text>
                  {Array.from(this.props.feelFunctions.get(dataTypeCategory)!).map((method) => (
                    <React.Fragment key={method.signature}>
                      <TextListItem component={TextListItemVariants.dt}>{method.signature}</TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>{method.documentation}</TextListItem>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </TextList>
          </TextContent>
        </Tab>
      </Tabs>
    );
  }
}
