/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Page } from "@playwright/test";
import { Diagram } from "../diagram";
import { DataType } from "../jsonModel";

export abstract class PropertiesPanelBase {
  constructor(public diagram: Diagram, public page: Page) {}

  public panel() {
    return this.page.getByTestId("properties-panel-container");
  }

  public async open() {
    await this.page.getByTitle("Properties panel").click();
  }

  public async setName(args: { newName: string }) {
    await this.panel().getByPlaceholder("Enter a name...").fill(args.newName);
    await this.page.keyboard.press("Enter");
  }

  public async getName() {
    return await this.panel().getByPlaceholder("Enter a name...").inputValue();
  }

  public async setDataType(args: { newDataType: DataType }) {
    await this.panel().getByPlaceholder("Select a data type...").click();
    await this.page.getByRole("option").getByText(args.newDataType, { exact: true }).click();
  }

  public async setDescription(args: { newDescription: string }) {
    await this.panel().getByPlaceholder("Enter a description...").fill(args.newDescription);

    // commit changes by click to the diagram
    await this.diagram.resetFocus();
  }

  public async getDescription() {
    return await this.panel().getByPlaceholder("Enter a description...").inputValue();
  }

  public async addDocumentationLink(args: { linkText: string; linkHref: string }) {
    await this.panel().getByTitle("Add documentation link").click();
    await this.panel()
      .locator(".kie-dmn-editor--documentation-link--row")
      .getByPlaceholder("Enter a title...")
      .fill(args.linkText);
    await this.panel()
      .locator(".kie-dmn-editor--documentation-link--row")
      .getByPlaceholder("http://")
      .fill(args.linkHref);
    await this.page.keyboard.press("Enter");
  }

  public async getDocumentationLinks() {
    return await this.panel().locator(".kie-dmn-editor--documentation-link--row-title").locator("a").all();
  }

  public async setFont(args: {
    fontSize?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    striketrough?: boolean;
    color?: string;
    fontFamily?: string;
  }) {
    await this.panel().getByTitle("Expand / collapse Font").click();

    if (args.fontSize) {
      await this.panel().getByLabel("Font size").locator("input").fill(args.fontSize);
    }
    if (args.bold) {
      await this.panel().getByLabel("Toggle font bold").click();
    }
    if (args.italic) {
      await this.panel().getByLabel("Toggle font italic").click();
    }
    if (args.underline) {
      await this.panel().getByLabel("Toggle font underline").click();
    }
    if (args.striketrough) {
      await this.panel().getByLabel("Toggle font strike through").click();
    }
    if (args.color) {
      await this.panel().getByTestId("color-picker-font").fill(args.color);
    }
    if (args.fontFamily) {
      await this.panel().getByTestId("properties-panel-node-font-style").click();
      await this.panel().getByText(args.fontFamily).click();
    }

    await this.diagram.resetFocus();
  }

  public async resetFont() {
    await this.panel().getByTitle("Reset font").click();
  }

  public async getFont() {
    await this.panel().getByTitle("Expand / collapse Font").click();

    const font = await this.panel().getByTestId("properties-panel-node-font-style").textContent();

    await this.panel().getByTitle("Expand / collapse Font").click();

    return font;
  }

  public async setShape(args: { width: string; height: string }) {
    await this.panel().getByTitle("Expand / collapse Shape").click();

    await this.panel().getByTestId("properties-panel-node-shape-width-input").fill(args.width);
    await this.panel().getByTestId("properties-panel-node-shape-height-input").fill(args.height);

    await this.panel().getByTitle("Expand / collapse Shape").click();
  }

  public async setPosition(args: { x: string; y: string }) {
    await this.panel().getByRole("button", { name: "Expand / collapse Shape" }).click();
    await this.panel().getByPlaceholder("Enter X value...").fill(args.x);
    await this.panel().getByPlaceholder("Enter Y value...").fill(args.y);
    await this.panel().getByRole("button", { name: "Expand / collapse Shape" }).click();
  }

  public async getShape() {
    await this.panel().getByTitle("Expand / collapse Shape").click();

    const width = await this.panel().getByTestId("properties-panel-node-shape-width-input").inputValue();
    const height = await this.panel().getByTestId("properties-panel-node-shape-height-input").inputValue();

    await this.panel().getByTitle("Expand / collapse Shape").click();

    return { width: width, height: height };
  }

  public async resetShape() {
    await this.panel().getByTitle("Reset shape").click();
  }
}
