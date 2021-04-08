/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { WebElement } from "vscode-extension-tester";
import { labeledInputElementInPropertiesPanel } from "../CommonLocators";

/**
 * Class for accessing expanded DMN Properties panel
 */
export default class PropertiesPanelHelper {
  private root: WebElement;

  constructor(root: WebElement) {
    this.root = root;
  }

  /**
   * Change a property to a provided value. The Original value is replaced by the new value completely.
   * Just visible properties are assumed. Accordion view hidden content can not be changed by this method.
   *
   * @param propertyName
   * @param propertyValue
   */
  public changeProperty = async (propertyName: string, propertyValue: string): Promise<PropertiesPanelHelper> => {
    const property = await this.root.findElement(labeledInputElementInPropertiesPanel(propertyName));
    await property.clear();
    await property.sendKeys(propertyValue);

    return this;
  };
}
